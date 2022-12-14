import express, { Application, Request, Response, NextFunction } from 'express';
import path from 'path';
import bodyParser from 'body-parser';
const app: Application = express();

//middleware
app.use(express.static(path.join(__dirname, '..', 'build')));
app.use(express.json());

app.use('/api', require('./api'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // console.error(err.stack);
  // res.status(err.status || 500).send(err.message || 'Internal server error');
  const statusCode = res.statusCode || 500;
  res.status(statusCode);
  // .send(err.message || 'Internal server error');
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});
app.get('/*', (req: Request, res: Response) => {
  if (process.env.NODE_ENV === 'production') {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'build', 'index.html'));
  } else {
    res.sendFile(
      path.join(__dirname, '..', 'frontend', 'public', 'index.html')
    );
  }
});

module.exports = app;
