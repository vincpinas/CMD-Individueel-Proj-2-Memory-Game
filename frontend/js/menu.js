export default class Menu {
    constructor(gameObj, libObj) {
        this.gameObj = gameObj;
        this.libObj = libObj;

        this.init();
    }

    init() {
        const lib_button = document.getElementById("library_button");
        const reset_button = document.getElementById("reset_button");

        lib_button.addEventListener("click", () => { this.libObj.open_library() })
        reset_button.addEventListener("click", () => { this.gameObj.reset() })
    }
}