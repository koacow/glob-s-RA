import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import historyRouter from './routes/history';
import latestRouter from './routes/latest';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/brsi/history', historyRouter);
app.use('/api/brsi/latest', latestRouter);
app.use(errorHandler);

export default app;