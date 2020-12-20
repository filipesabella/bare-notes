import { Request, Response } from 'express';
import { Repository } from '../repository';

export const deleteNote = (repo: Repository) =>
  async (req: Request, res: Response) => {
    const id = req.params.id;
    repo.delete(id);
    res.sendStatus(201);
  };
