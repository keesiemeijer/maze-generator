# maze-generator
Create mazes using the [recursive backtracking algorithm](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker).

Check out the [maze generator demo](https://keesiemeijer.github.io/maze-generator/).

## Standalone repaginado (`maze-generator-standalone.html`)

O projeto agora também inclui uma versão standalone em arquivo único, com interface moderna e pronta para uso local/offline no navegador.

### Novas características

- UI repaginada com layout responsivo (desktop e mobile).
- Controles visuais para dimensões, espessura da parede, entrada/saída, tendência e aberturas extras.
- Personalização de aparência com seletor de cores e temas rápidos (Oceano, Floresta, Ameixa e Noite).
- Opções de plano de fundo do canvas (`solid`, `gradient`, `grid`, `dots` e `paper`).
- Ícones personalizados para entrada e saída.
- Resolução de caminho com destaque da rota e opção de limpar a solução.
- Exportação do labirinto em PNG e opção de impressão.
- Indicadores de status/estatísticas (tamanho, aberturas extras, células na solução e tempo de geração).
- Persistência das preferências via `localStorage`.
- Implementação sem dependências externas (HTML/CSS/JS em arquivo único).

**Note**: There are restrictions for the maze dimensions you can use. You can remove the restrictions in the [globals.js](https://github.com/keesiemeijer/maze-generator/blob/master/src/globals.js) file. Be aware that the larger the maze dimensions, the more memory is consumed. With recursive backtracking the whole maze is stored in memory.

![maze](https://user-images.githubusercontent.com/1436618/106612888-e1d90600-6569-11eb-87cf-2477b2578598.png)

### LICENSE

MIT

## GitHub Pages (este repositório)

Para publicar o standalone neste repositório:

1. Abra **Settings → Pages** no repositório `Raphango/maze-generator-plus`.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Escolha a branch (ex.: `main`) e a pasta **`/ (root)`**.
4. Acesse:
   - `https://raphango.github.io/maze-generator-plus/`
   - `https://raphango.github.io/maze-generator-plus/maze-generator-standalone.html`

O `index.html` já está configurado para redirecionar para `maze-generator-standalone.html`.
