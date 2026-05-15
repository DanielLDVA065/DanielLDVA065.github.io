import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

app.listen(1984, () => {
  console.log('Up and up');
});
