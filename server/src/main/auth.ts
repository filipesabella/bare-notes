import { Request, Response } from 'express';
import * as fs from 'fs';
import { authenticator } from 'otplib';
import * as qrcode from 'qrcode';

const authDB = '/tmp/auth-db.json';
type AuthDBData = {
  secret: string;
  token?: string;
  validUntil?: string;
};

type Handler = (req: Request, res: Response) => void;

export const authenticating = (handler: Handler): Handler => {
  return (req, res) => {
    const { token, validUntil } = loadData();
    const valid = token === req.cookies.token
      && new Date() < new Date(validUntil!);

    if (valid) {
      handler(req, res);
    } else {
      res.sendStatus(401);
    }
  };
};

export const authenticate = async (req: Request, res: Response) => {
  const token = req.body.replace(/\s/g, '');
  const secret = loadData().secret;

  if (authenticator.verify({ token, secret })) {
    const authToken = authenticator.generateSecret(64);

    // TODO have config for this
    const monthFromNow = new Date();
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);

    storeData({
      secret,
      token: authToken,
      validUntil: monthFromNow.toISOString(),
    });

    res.cookie('token', authToken, {
      expires: monthFromNow,
      sameSite: 'none',
    });
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
};

export const setup = async (req: Request, res: Response) => {
  if (fs.existsSync(authDB) && loadData().secret) {
    res.status(400).send('User was already setup');
  } else {
    const secret = authenticator.generateSecret(64);

    const otp = authenticator.keyuri('bare-notes', 'Bare Notes', secret);
    await qrcode.toFileStream(res, otp);

    storeData({ secret });

    res.status(200);
  }
};

function loadData(): AuthDBData {
  return JSON.parse(fs.readFileSync(authDB).toString());
}

function storeData(data: AuthDBData): void {
  fs.writeFileSync(authDB, JSON.stringify(data));
}
