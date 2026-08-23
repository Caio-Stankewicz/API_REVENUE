import { Router } from 'express';

const router = Router();

function extrairIngredientes(prato) {
  const lista = [];

  for (let i = 1; i <= 20; i++) {
    const nome = prato['strIngredient' + i];
    const medida = prato['strMeasure' + i];

    if (nome && nome.trim() !== '') {
      lista.push(`${medida || ''} ${nome}`.trim());
    }
  }

  return lista;
}

router.get('/', async (req, res) => {
  const termo = req.query.termo || '';
  const pagina = parseInt(req.query.page, 10) || 1;

  let pratosProntos = [];
  let totalPaginas = 0;

  if (termo) {
    try {
      const palavras = termo
        .toLowerCase()
        .split(/[,\s]+/)
        .filter(Boolean);
      const principal = palavras[0];

      const [porIngrediente, porNome] = await Promise.all([
        fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${encodeURIComponent(principal)}`).then(r => r.json()),
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(principal)}`).then(r => r.json())
      ]);

      const todosPratos = [...(porIngrediente.meals || []), ...(porNome.meals || [])];
      const idsUnicos = [...new Set(todosPratos.map(p => p.idMeal))];

      if (idsUnicos.length > 0) {
        const receitasCompletas = await Promise.all(
          idsUnicos.map(id => fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`).then(r => r.json()))
        );

        const pratosFinais = receitasCompletas
          .map(r => ({
            nome: r.meals[0].strMeal,
            imagem: r.meals[0].strMealThumb,
            ingredientes: extrairIngredientes(r.meals[0])
          }))
          .filter(prato => {
            const texto = prato.ingredientes.join(' ').toLowerCase();
            return palavras.every(p => texto.includes(p));
          });

        if (pratosFinais.length > 0) {
          totalPaginas = Math.ceil(pratosFinais.length / 6);
          pratosProntos = pratosFinais.slice((pagina - 1) * 6, pagina * 6);
        }
      }
    } catch (erro) {
      console.error("Erro na busca da API:", erro);
    }
  }

  res.render('index', {
    pratos: pratosProntos,
    termo: termo,
    paginaAtual: pagina,
    totalPaginas: totalPaginas,
  });
});

export { router };