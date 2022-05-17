export function boardBuilder(board) {
    return `<section class="board" data-board-id=${board.id}>
                <div class="board-header">
                    <span>${board.title}</span>          
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down" ></i></button>
                </div>
            </section>`;
}

export function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}">${card.title}</div>`;
}

