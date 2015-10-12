import express from 'express';
import Bar from './bar';
import connectToDatabase from './config/database';
import mongoose from 'mongoose';
import config from './config/config';
import bodyParser from 'body-parser';
import methodOverride from 'method-override';

const app = express();

connectToDatabase(app, mongoose);

app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride());

app.get('/', (req, res) => {
  res.send('Hello world' + Bar.foo);
});

app.get('/test', (req, res) => {
  res.send('Hello world');
});

app.get('/somewierdurl', (req, res, next) => {
  next(new Error('this is expected error'));
});

// handle error
app.use((err, req, res, next) => {
  if (!err) {
    next();
  }

  let status = err.status || 500;
  let message = err.message || 'Opps, there was an error';

  res.status(status);

  // handle html
  if (req.accepts('html')) {
    return res.send(message);
  }

  // handle json
  if (req.accepts('application/json')) {
    return res.json({
      status: status,
      message: message
    });
  }
});

const server = app.listen(config.server.port, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Expess app listening at http://%s:%s', host, port);
});

export default app;
