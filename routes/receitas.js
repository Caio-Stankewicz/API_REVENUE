import { Router } from 'express';

const router = Router();

function extrairIngredientes(prato) {
  const lista = [];

  for (let i = 1; i <= 20; i++) {

    const nome = prato[`strIngredient${i}`];
    const medida = prato[`strMeasure${i}`];

    if (nome && nome.trim() !== '') {

      lista.push({
        nome: nome.trim(),
        medida: medida?.trim() || ''
      });

    }
  }

  return lista;
}

router.get('/', async (req, res) => {
  try {

    const termo = req.query.termo || '';
    const pagina = parseInt(req.query.page) || 1;
    const limite = 6;
    let receitas = [];
    let totalPaginas = 0;

    if (termo) {
      const ingredientes = termo
        .split(',')
        .map(item => item.trim().toLowerCase())
        .filter(Boolean);
      const buscas = await Promise.all(

        ingredientes.map(async ingrediente => {

          const resposta = await fetch(
            `https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(ingrediente)}`
          );

          const dados = await resposta.json();
          return dados.meals || [];
        })
      );
      const primeiraLista = buscas[0] || [];
      const idsEmComum = primeiraLista
        .map(receita => receita.idMeal)
        .filter(id =>
          buscas.every(lista =>
            lista.some(receita =>
              receita.idMeal === id
            )
          )
        );
      totalPaginas = Math.ceil(
        idsEmComum.length / limite
      );
      const inicio = (pagina - 1) * limite;
      const fim = inicio + limite;
      const idsDaPagina = idsEmComum.slice(
        inicio,
        fim
      );
      const detalhes = await Promise.all(

        idsDaPagina.map(async id => {

          const resposta = await fetch(
            `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`
          );
          const dados = await resposta.json();
          return dados.meals?.[0];
        })
      );
      receitas = detalhes
        .filter(Boolean)
        .map(prato => ({
          id: prato.idMeal,
          nome: prato.strMeal,
          imagem: prato.strMealThumb,
          ingredientes: extrairIngredientes(prato),
          preparo: prato.strInstructions
        }));

    }
    return res.render('index', {
      receitas,
      termo,
      paginaAtual: pagina,
      totalPaginas
    });

  } catch (erro) {

    console.error(erro);

    return res.status(500).send(
      'Error while searching recipes'
    );
  }
});

export { router };