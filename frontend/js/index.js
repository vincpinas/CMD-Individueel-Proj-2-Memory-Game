import Game from "./game.js";
import Menu from "./menu.js";
import Library from "./library.js";

const game = new Game();
const library = new Library(game);
new Menu(game, library);