import express from 'express';
import { router } from './routes/receitas.js';

const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(router);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});