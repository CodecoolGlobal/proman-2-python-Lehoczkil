import {dataHandler} from "../data/dataHandler.js";

export function boardBuilder(board, status="not yet") {
    return `<section class="board" data-board-id=${board.id}>
                <div class="board-header" data-board-id=${board.id}>
                    <input width="auto" class="board-title borderless-input" data-board-id=${board.id}  value="${board.title}">       
                    <span class="board-remove"><i class="fas fa-trash-alt board-remove" data-board-id-remove="${board.id}"></i></span>
                    <button class="add-column-button" data-board-id="${board.id}">Add Column</button>
                    <button class="board-toggle toggle-board-button" data-board-id="${board.id}"><i class="fas fa-chevron-down" ></i></button>
                </div>
            </section>`;
}

export function cardBuilder(card) {
    return `<div class="card" data-card-id="${card.id}" data-card-status-id="${card.status_id}" data-board-id='${card.board_id}' data-card-order="${card.card_order}">
                <div class="ghost"></div>
                <div class="card-visible">
                <div class="card-remove"><i class="fas fa-trash-alt remove-card" data-card-id-remove="${card.id}"></i></div>
                <input width="auto" class="card-title borderless-input" data-card-id="${card.id}" value="${card.title}">
                </div>
            </div>`;
}

export function addCardButtonBuilder(boardId) {
    return `<button class="board-add" data-board-id=${boardId}>Add Card</button>`
}


export function newColumnBuilder(boardID, column) {
    return `<div class="board-column">
                <div class="board-column-title">${column.title}<i class="fas fa-trash-alt remove-column" data-status-id-remove="${column.id}"></i></div>
                <div class="board-column-content" data-status-id="${column.id}" data-board-id=${boardID}></div>
            </div>`
}


export async function columnsBuilder(boardID) {

    let columns = await dataHandler.getColumnsByBoardId(boardID);
    let columnsContent = ``;
    columns.forEach((column) => {
        columnsContent += `<div class="board-column">
                               <div class="board-column-title">${column.title}<i class="fas fa-trash-alt remove-column" data-status-id-remove="${column.id}"></i></div>
                               <div class="board-column-content" data-status-id="${column.id}" data-board-id=${column.board_id}></div>
                           </div>`
    });
    return `<div class="board-columns" data-board-id=${boardID}>
                ${columnsContent}
            </div>`;
}


    /*
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
}*/