import { createEl, fetchMemories, uploadMemories } from "./helpers.js";

export default class Library {
    constructor(gameObj) {
        this.menu_items = {
            close: document.querySelector("#library_close_button"),
            overview: document.querySelector("#library_cv_overview"),
            upload: document.querySelector("#library_cv_upload")
        }
        this.gameObj = gameObj;
        this.view_el = document.querySelector(".library_view");
        this.current_view = null;
        this.memories = [];
        this.active_thumbnail = null;

        this.setup_menu();
    }

    // Functions
    // ------------------------
    open_library() {
        document.querySelector(".library").classList.add("active")
        this.change_view_overview();
    }

    close_library() {
        document.querySelector(".library").classList.remove("active")
    }

    menu_select(key) {
        this.menu_items[key].classList.add("active");
        this.view_el.className = `library_view ${key}`
    }

    clear_menu_select() {
        const active_menu_button = document.querySelector(".library_menu button.active");
        if (active_menu_button) active_menu_button.classList.remove("active");
    }

    // Views
    // ------------------------

    async change_view_overview() {
        if(this.current_view === "overview") return;
        this.current_view = "overview";

        this.memories = await fetchMemories();

        this.clear_menu_select();
        this.menu_select("overview");
        this.view_el.innerHTML = "";

        const thumbnail_list = createEl("ul");
        const focus_container = createEl("div");

        this.memories.forEach((memory, i) => {
            const li = createEl("li")
            const thumbnail = createEl("img");
            thumbnail.src = memory.src;
            li.appendChild(thumbnail);

            li.addEventListener("click", () => {
                this.active_thumbnail.className = ""

                li.className = "active"
                focus_container.innerHTML = `<img src="${memory.src}">`
                this.active_thumbnail = li;
            })

            if (i === 0) {
                li.className = "active"
                focus_container.innerHTML = `<img src="${memory.src}">`
                this.active_thumbnail = li;
            }

            thumbnail_list.appendChild(li);
        })

        this.view_el.appendChild(thumbnail_list);
        this.view_el.appendChild(focus_container);
    }

    change_view_upload() {
        if(this.current_view === "upload") return;
        this.current_view = "upload";

        this.clear_menu_select();
        this.menu_select("upload");
        this.view_el.innerHTML = "";

        const upload_wrapper = createEl("div", "upload_wrapper")
        const upload_icon = createEl("img")
        upload_icon.src = "ImageIcon.svg"
        const upload_text = createEl("p")
        upload_text.innerHTML = "Drag & Drop your files here or <u>Choose here</u>"
        const upload_input = createEl("input")
        upload_input.type = "file"
        upload_input.setAttribute("multiple", true)

        const file_heading = createEl("h2")
        file_heading.innerHTML = "Selected Files (0)"
        const file_list = createEl("ul");

        const upload_button = createEl("button")
        upload_button.innerHTML = "Upload"

        upload_input.addEventListener("change", (e) => {
            file_heading.innerHTML = `Selected Files (${e.target.files.length})`;
            file_list.innerHTML = "";

            Array.from(e.target.files).forEach(file => {
                const li = createEl("li")
                const info = createEl("div")
                const remove = createEl("button")
                remove.innerHTML = "X";

                const name = createEl("p", "name")
                name.innerHTML = file.name;
                const size = createEl("p", "size")
                size.innerHTML = `${file.size / 1000} kb`

                remove.addEventListener("click", () => {
                    const dt = new DataTransfer();
                    const files = e.target.files;

                    for (let i = 0; i < files.length; i++) {
                        if (files[i].name !== file.name) {
                            dt.items.add(files[i]);
                        }
                    }

                    e.target.files = dt.files;
                    remove.parentElement.remove();
                    file_heading.innerHTML = `Selected Files (${e.target.files.length})`;
                })

                info.appendChild(name)
                info.appendChild(size)
                li.appendChild(info)
                li.appendChild(remove)

                file_list.appendChild(li);
            });
        })

        upload_button.addEventListener("click", async () => {
            await uploadMemories(upload_input.files);
            this.change_view_overview();
            this.gameObj.reset()
        })

        upload_wrapper.appendChild(upload_icon)
        upload_wrapper.appendChild(upload_text)
        upload_wrapper.appendChild(upload_input)
        this.view_el.appendChild(upload_wrapper)
        this.view_el.appendChild(file_heading)
        this.view_el.appendChild(file_list)
        this.view_el.appendChild(upload_button)
    }

    // Setup
    // ------------------------
    async setup_menu() {
        this.menu_items["close"].addEventListener("click", () => { this.close_library() });
        this.menu_items["overview"].addEventListener("click", () => { this.change_view_overview() });
        this.menu_items["upload"].addEventListener("click", () => { this.change_view_upload() });
    }
}