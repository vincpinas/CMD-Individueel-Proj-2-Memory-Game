export function get_random_memories(arr, amount) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    const selected_elements = arr.slice(0, amount);

    const result = [];
    for (let i = 0; i < selected_elements.length; i++) {
        result.push(selected_elements[i]);
        const randomIndex = Math.floor(Math.random() * (result.length + 1));
        result.splice(randomIndex, 0, selected_elements[i]);
    }

    return result;
}

export function compare_cards(card_arr) {
    let card_one_memory = card_arr[0].memory;
    let card_two_memory = card_arr[1].memory;

    if (card_one_memory.id && card_two_memory.id && card_one_memory.id === card_two_memory.id) {
        return true;
    } else {
        return false;
    }
}

export function get_card_elements(card_arr) {
    return card_arr.map(card => document.querySelector)
}

export function createEl(type, className) {
    let el = document.createElement(type);
    if (typeof className === "string") el.className = className;

    return el;
}

const API_URL = (() => {
    if(window.location.href.includes("localhost")) {
        return "https://server-shy-glade-362.fly.dev"
    } else {
        return "https://server-shy-glade-362.fly.dev";
    }
})()

export const fetchMemories = async () => {
    const response = await fetch(`${API_URL}/memories`);
    const data = await response.json()

    return data;
}

export const uploadMemories = async (files) => {
    const form_data = new FormData();

    Array.from(files).forEach(file => {
        form_data.append("memories", file)
    })

    const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: form_data,
    });
    const data = await response.json();

    console.log(data)

    return data;
}