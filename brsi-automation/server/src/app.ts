import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import brsiRouter from './routes/brsiRouter';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api/brsi', brsiRouter);
app.use(errorHandler);

export default app;