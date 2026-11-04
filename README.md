# maze-generator
Create mazes using the [recursive backtracking algorithm](https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker).

Check out the [maze generator demo](https://keesiemeijer.github.io/maze-generator/).

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
