import { get_random_memories, createEl, compare_cards, fetchMemories } from "./helpers.js"

export default class Game {
    constructor() {
        this.card_amount = 12;
        this.flip_delay = 650
        this.game_deck = document.querySelector("section.game")

        this.memories = [];
        this.flipped = [];
        this.correct = [];
        this.flip_permissions = false;

        this.init();
    }

    async init() {
        this.memories = await fetchMemories();
        this.createCards();
        this.set_reset_loop();
    }

    setCardCss(amount) {
        if (document.querySelector("style")) document.querySelector("style").remove();

        const mobile_large = 676;
        const mobile_small = 400;
        let rows_cols = {};

        if (amount <= 4) rows_cols = { rows: 1, columns: amount };
        else if (amount <= 8) rows_cols = { rows: 2, columns: 4 };
        else if (amount <= 12) rows_cols = { rows: 3, columns: 4 };

        const style = createEl("style");
        style.innerHTML = `
            .game {
                grid-template-rows: repeat(${rows_cols.rows}, 10rem);
                grid-template-columns: repeat(${rows_cols.columns}, 6.5rem);
            }

            @media screen and (max-width: ${mobile_large}px) {
                .game {
                    grid-template-rows: repeat(${rows_cols.rows}, 7rem);
                    grid-template-columns: repeat(${rows_cols.columns}, 4.5rem);
                }
            }

            @media screen and (max-width: ${mobile_small}px) {
                .game {
                    grid-template-rows: repeat(${rows_cols.rows}, 4.5rem);
                    grid-template-columns: repeat(${rows_cols.columns}, 3rem);
                }
            }
        `
        document.body.appendChild(style);
    }

    async createCards(replace = false) {
        const memories = await get_random_memories(this.memories, this.card_amount / 2);

        this.card_amount = memories.length;

        if (replace) {
            this.game_deck.innerHTML = "";
        }

        this.setCardCss(memories.length);

        memories.forEach(memory => {
            const card = createEl("div", "card");
            const card_inner = createEl("div", "card-inner");
            const card_front = createEl("div", "card-front");
            const card_back = createEl("div", "card-back");

            card_front.innerHTML = `<img src="Logo.svg" alt="Logo">`
            card_back.innerHTML = `<img src=${memory.src} alt="memory">`

            card_inner.appendChild(card_front)
            card_inner.appendChild(card_back)
            card_inner.style.transition = `transform ${this.flip_delay}ms`
            card.appendChild(card_inner)

            card.dataset.flip = true;
            card.dataset.id = memory.id;

            card.addEventListener("click", (e) => {
                if (this.flip_permissions === false) return;
                this.flip_card(e.target, memory)
                this.check_cards();
            })

            this.game_deck.appendChild(card)
        })

        this.flip_permissions = true;
    }

    set_reset_loop() {
        setInterval(() => {
            if (this.correct.length === this.card_amount && this.card_amount > 2) {
                this.reset();
            }
        }, 400)
    }

    flip_card(target, memory) {
        if (this.flipped.length >= 2) return;
        if (target.dataset.flip == false) return;
        if (target.classList.contains("flipped")) return;

        this.flipped.push({ el: target, memory })
        target.className = "card flipped"
    }

    check_cards() {
        if (this.flipped.length !== 2) return;

        setTimeout(() => {
            let correct = compare_cards(this.flipped);

            if (correct) {
                this.flipped.forEach(card => {
                    card.el.dataset.flip = false;
                })
                this.correct = [...this.correct, ...this.flipped];
            } else {
                this.flipped.forEach(card => {
                    card.el.className = "card"
                })
            }
            this.flipped = [];
        }, this.flip_delay + 100)
    }

    async reset() {
        this.flipped = [];
        this.correct = [];
        this.flip_permissions = false;
        this.card_amount = 12;
        this.memories = await fetchMemories();

        const child_elements = Array.from(this.game_deck.children);

        child_elements.forEach(child => {
            if (child.classList.contains("flipped")) child.classList.remove("flipped")
        })

        setTimeout(() => { this.createCards(true) }, this.flip_delay)

        this.flip_permissions = true;
    }
}
