import express from 'express';
import { router } from './routes/index.js';
const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(router);

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});