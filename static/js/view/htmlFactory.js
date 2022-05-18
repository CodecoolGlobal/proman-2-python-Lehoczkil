export function boardBuilder(board, status="not yet") {
    return `<section class="board" data-board-id=${board.id}>
                <div class="board-header">
                    <span class="board-title" data-board-id=${board.id}>${board.title}</span>
                    <input class="board-title-input borderless-input" data-board-id=${board.id}  value="${board.title}">         
                    <button class="board-add">Add Card</button>
                    <button class="column-add">Add Column</button>
                    <button class="board-toggle toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down" ></i></button>
                </div>
            </section>`;
}

export function cardBuilder(card) {
    return `<div class="card card-title-input borderless-input" data-card-id="${card.id}" data-card-status-id="${card.status_id}">${card.title}
                <i class="fas fa-trash-alt remove" data-card-id-remove="${card.id}"></i>
            </div>`;
}

export function columnsBuilder(boardID) {
    return `<div class="board-columns" data-board-id=${boardID}>
                    <div class="board-column">
                        <div class="board-column-title">New</div>
                        <div class="board-column-content" data-status-id="1" data-board-id=${boardID}></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">In Progress</div>
                        <div class="board-column-content" data-status-id="2" data-board-id=${boardID}></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Testing</div>
                        <div class="board-column-content" data-status-id="3" data-board-id=${boardID}></div>
                    </div>
                    <div class="board-column">
                        <div class="board-column-title">Done</div>
                        <div class="board-column-content" data-status-id="4" data-board-id=${boardID}></div>
                    </div>
                </div>`
}
