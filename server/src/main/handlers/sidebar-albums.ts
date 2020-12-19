import { Request, Response } from 'express';
import { Repository } from '../repository';

export const allNotes = (repo: Repository) =>
  async (req: Request, res: Response) => {
    res.contentType('application/json');
    res.send(JSON.stringify({}));
  };
