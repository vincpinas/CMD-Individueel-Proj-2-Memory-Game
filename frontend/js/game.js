import { get_random_memories, createEl, compare_cards, fetchMemories } from "./helpers.js"

export default class Game {
    constructor() {
        this.card_amount = 8;
        this.memories = [];
        this.game_deck = document.querySelector("section.game")
        this.flipped = [];
        this.correct = [];
        this.flipDelay = 650

        this.init();
    }

    async init() {
        this.memories = await fetchMemories();

        this.createCards();

        setInterval(() => {
            if(this.correct.length === this.card_amount) {
                this.reset();
            }
        }, 400)
    }

    async createCards() {
        const memories = get_random_memories(this.memories, this.card_amount / 2);

        memories.forEach(memory => {
            const card = createEl("div", "card");
            const card_inner = createEl("div", "card-inner");
            const card_front = createEl("div", "card-front");
            const card_back = createEl("div", "card-back");

            card_front.innerHTML = `<img src="Logo.svg" alt="Logo">`
            card_back.innerHTML = `<img src=${memory.src} alt="memory">`

            card_inner.appendChild(card_front)
            card_inner.appendChild(card_back)
            card_inner.style.transition = `transform ${this.flipDelay}ms`
            card.appendChild(card_inner)

            card.dataset.flip = true;
            card.dataset.id = memory.id;

            card.addEventListener("click", (e) => {
                this.flipCard(e.target, memory)
                this.checkCards();
            })

            this.game_deck.appendChild(card)
        })
    }

    flipCard(target, memory) {
        if (this.flipped.length >= 2) return;
        if (target.dataset.flip == false) return;
        if (target.classList.contains("flipped")) return;

        this.flipped.push({ el: target, memory})
        target.className = "card flipped"
    }

    checkCards() {
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
        }, this.flipDelay + 100)
    }

    reset() {
        location.reload();
    }
}
