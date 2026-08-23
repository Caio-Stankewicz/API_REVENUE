import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const termo = req.query.termo || 'chicken';

  try {
    const resposta = await fetch('https://www.themealdb.com/api/json/v1/1/filter.php?i=' + termo);
    const dados = await resposta.json();

    res.json({
      palavraBuscada: termo,
      receitasEncontradas: dados.meals
    });

  } catch (erro) {
    res.json({ erro: 'Não foi possível conectar na API.' });
  }
});

export { router };