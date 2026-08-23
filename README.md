# API_REVENUE
Buscador de receitas por ingredientes utilizando a API TheMealDB

Funcionalidades

1- Busca Flexível: Pesquise por um ou mais ingredientes (ex: chicken, garlic, salt).
2- Busca Dupla Simultânea: O motor de busca procura tanto pelo nome do prato quanto pelos ingredientes ao mesmo tempo.
3- Filtro Rigoroso: O sistema garante que a receita exibida contenha todos os ingredientes que você pesquisou.
4- Destaque Visual: Os ingredientes que você pesquisou são destacados em amarelo automaticamente na tela da receita.
5- Paginação: Resultados organizados em páginas de 6 em 6 pratos para uma navegação limpa.

---

Como funciona a lógica (Under the hood)

Para contornar algumas limitações de busca da API gratuita, o backend foi construído com uma lógica de Deduplicação e Filtro Avançado. Quando o usuário faz uma pesquisa, o seguinte fluxo acontece:

1- Tratamento de Dados: O texto digitado é convertido para minúsculo e fatiado (split) removendo espaços extras, gerando um Array de palavras-chave.
2- A Busca Dupla (Promise.all): O servidor dispara duas requisições simultâneas para a API TheMealDB. Uma procurando por pratos que tenham o ingrediente principal, e outra procurando por pratos que tenham o nome da palavra digitada.
3- Limpeza de Repetidos (Set): Como buscamos em duas rotas diferentes da API, unimos todos os pratos encontrados em uma única lista e usamos a estrutura Set do Javascript para extrair apenas os IDs únicos, apagando pratos duplicados.
4- Resgate de Detalhes: Com os IDs únicos em mãos, o servidor faz novas requisições para buscar a receita completa de cada prato (já que precisamos da lista completa de medidas e ingredientes).
5- O Filtro Final (.every): O código limpa as 20 colunas de ingredientes que a API retorna, junta com as medidas e testa receita por receita. Se o prato não tiver todas as palavras que o usuário digitou, ele é descartado.
6- Renderização: O Express calcula a paginação com Math.ceil(), fatia (slice()) os 6 pratos da página atual e envia para o motor de views (EJS) desenhar o HTML.

---

Tecnologias Utilizadas

1- Backend: Node.js, Express
2- Frontend: HTML5, CSS3, EJS (Embedded JavaScript templating)
3- API Externa: TheMealDB API