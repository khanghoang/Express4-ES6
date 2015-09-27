import express from "express";
import Bar from "./bar";
import connectToDatabase from "./config/database";
import mongoose from "mongoose";

const app = express();

connectToDatabase(app, mongoose);

app.get('/', (req, res) => {
  res.send('Hello world' + Bar.foo);
})

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Expess app listening at http://%s:%s', host, port);
});

export default app;
