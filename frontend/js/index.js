import Game from "./game.js";
import Menu from "./menu.js";
import Library from "./library.js";

const library = new Library();
const game = new Game();
new Menu(game, library);