export function boardBuilder(board, status="not yet") {
    return `<section class="board" data-board-id=${board.id}>
                <div class="board-header">
                    <span class="board-title">${board.title}</span>          
                    <button class="board-add">Add Card</button>
                    <button class="board-toggle toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down" ></i></button>
                </div>
                <div class="board-columns">
                    <div class="board-column">
                        <div class="board-column-title">New</div>
                        <div class="board-column-content" data-status-id="1" data-board-id=${board.id}></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">In Progress</div>
                        <div class="board-column-content" data-status-id="2" data-board-id=${board.id}></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Testing</div>
                        <div class="board-column-content" data-status-id="3" data-board-id=${board.id}></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Done</div>
                        <div class="board-column-content" data-status-id="4" data-board-id=${board.id}></div>
                    </div>
                </div>
            </section>`;
}

export function cardBuilder(card) {
    return `<div class="card" data-card-status-id="${card.status_id}">${card.title}</div>`;
}

