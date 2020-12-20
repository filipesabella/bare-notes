import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { allNotes } from './handlers/all-notes';
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
  .get('/notes', allNotes(repo))
  .post('/note', saveNote(repo));


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
