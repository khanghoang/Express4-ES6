import express from 'express';
import Bar from './bar';
import connectToDatabase from './config/database';
import mongoose from 'mongoose';
import config from './config/config';

const app = express();

connectToDatabase(app, mongoose);

app.get('/', (req, res) => {
  res.send('Hello world' + Bar.foo);
});

app.get('/test', (req, res) => {
  res.send('Hello world');
});

app.get('/somewierdurl', (req, res, next) => {
  next(new Error('this is expected error'));
})

// handle error
app.use((err, req, res, next) => {
  let status = err.status || 500;
  let message = err.message || 'Opps, there was an error';

  // handle html
  if(req.accepts('html')) {
    return res.status(status).send(message);
  }

  // handle json
  if(req.accepts('json')) {
    return res.status(status)
    .json({
      status: status,
      message: message
    });
  }

})

const server = app.listen(config.server.port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Expess app listening at http://%s:%s', host, port);
});

export default app;
