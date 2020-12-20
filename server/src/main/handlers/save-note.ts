import { Request, Response } from 'express';
import { Note } from '../common/types';
import { Repository } from '../repository';

export const saveNote = (repo: Repository) =>
  async (req: Request, res: Response) => {
    repo.save(JSON.parse(req.body) as Note);
    res.sendStatus(201);
  };
