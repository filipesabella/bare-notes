import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import * as auth from './auth';
import { allNotes } from './handlers/all-notes';
import { deleteNote } from './handlers/delete-note';
import { saveNote } from './handlers/save-note';
import { Repository } from './repository';

const repo = new Repository();
const app = express();

app
  .use((req, res, next) => {
    next();
    const logLine = `${req.method} ${req.path} - ${res.statusCode}`;
    console.log(logLine);
  })
  .use(bodyParser.json())
  .use(bodyParser.text())
  .use(cors())
  .use(require('cookie-parser')())
  .use('/', express.static('../client/dist/'))
  .get('/setup', auth.setup)
  .post('/authenticate', auth.authenticate)
  .get('/api/notes', auth.authenticating(allNotes(repo)))
  .post('/api/notes', auth.authenticating(saveNote(repo)))
  .delete('/api/notes/:id', auth.authenticating(deleteNote(repo)));


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
