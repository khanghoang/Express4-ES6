import express from "express";
import Bar from "./bar.js";
const app = express();

app.get('/', (req, res) => {
  res.send('Hello world' + Bar.foo);
})

const server = app.listen(3000, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log('Expess app listening at http://%s:%s', host, port);
});
