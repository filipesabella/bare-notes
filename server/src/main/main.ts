import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import { allNotes } from './handlers/sidebar-albums';
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
  .post('/notes', allNotes(repo));


const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server is running at https://localhost:${port}`);
});
