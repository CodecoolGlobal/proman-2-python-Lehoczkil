import {dataHandler} from "../data/dataHandler.js";
import {
    addCardButtonBuilder,
    boardBuilder,
    cardBuilder,
    columnsBuilder,
    newColumnBuilder
} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager, deleteBoardButtonHandler, deleteCardButtonHandler} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            //await columnsBuilder(board.dataset.boardId);
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            const addColumnButton = document.querySelector(`.add-column-button[data-board-id="${board.id}"]`);
            addColumnButton.addEventListener("click", addColumnHandler);
            const showHideButton = document.querySelector(`.toggle-board-button[data-board-id="${board.id}"]`);
            const deleteBoardButton = document.querySelector(`.board-remove[data-board-id-remove="${board.id}"]`);
            deleteBoardButton.addEventListener("click", deleteBoardButtonHandler)
            showHideButton.addEventListener("click", showHideButtonHandler)
            const boardTitle = document.querySelector(`.board-title[data-board-id="${board.id}"]`)
            boardTitle.addEventListener('keydown', updateTitle)
        }
    },
    addNewBoardHandler: addNewBoardHandler
};

async function showHideButtonHandler(clickEvent) {
    const board = clickEvent.currentTarget.parentElement.parentElement;
    const boardId = board.dataset.boardId;
    const addColumnButton = document.querySelector(`.add-column-button[data-board-id="${boardId}"]`);
    addColumnButton.addEventListener("click", addColumnHandler);
    let columns = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
    let addCardButton = document.querySelector(`.board-add[data-board-id="${boardId}"]`);
    if (board.childElementCount > 1) {
        addCardButton.remove();
        columns.remove();
        addColumnButton.style.display = 'none';
    } else {
        addCardButton = addCardButtonBuilder(boardId);
        columns = await columnsBuilder(boardId);
        domManager.addChild(`.board[data-board-id="${boardId}"]`, columns);
        domManager.addChild(`.board-header[data-board-id="${boardId}"]`, addCardButton);
        addCardButton = document.querySelector(`.board-add[data-board-id="${boardId}"]`);
        addCardButton.addEventListener("click", addCardButtonHandler);
        const deleteColumButtons = document.querySelectorAll(".fas.fa-trash-alt.remove-column")
        deleteColumButtons.forEach(button => {
            button.addEventListener("click", deleteColumnHandler)
        })
        await cardsManager.loadCards(boardId);
        addColumnButton.style.display = 'inline';
        initDragAndDrop();
    }
}

function initDragAndDrop() {
    let cards = document.querySelectorAll('.card')
    const columns = document.querySelectorAll('.board-column-content')
    let currentDrag = null;
    for (let card of cards) {
        card.draggable = true
        card.ondragstart = (e) => {
            currentDrag = card
            for (let card of cards) {
                card.classList.add('hint')
            }
            for (let column of columns) {
                if (column.dataset.boardId === card.dataset.boardId) {
                    column.classList.add('dropzone-column')
                }
            }
        };
        card.ondragenter = (e) => {
            if (currentDrag !== card &&
                (parseInt(currentDrag.dataset.cardOrder) !== card.dataset.cardOrder - 1 || currentDrag.dataset.cardStatusId !== card.dataset.cardStatusId) &&
                currentDrag.dataset.boardId === card.dataset.boardId) {
                card.classList.add('active')
            }
        };
        card.ondragleave = (e) => {
            card.classList.remove('active')
        };
        card.ondragend = (e) => {
            for (let column of columns) {
                column.classList.remove('dropzone-column')
            }
            for (let card of cards) {
                card.classList.remove('active')
                card.classList.remove('hint')
            }

        };
        card.ondragover = (e) => {
            e.preventDefault()
        }
        card.ondrop = (e) => {
            e.preventDefault();
            if (card !== currentDrag) {
                if (card.dataset.boardId === currentDrag.dataset.boardId) {
                    let switchNum
                    let currentColumn = currentDrag.parentElement
                    let targetColumn = card.parentElement
                    if (card.dataset.cardStatusId === currentDrag.dataset.cardStatusId) {
                        // drop on same status, not as last card
                        switchNum = 1
                    } else {
                        // drop on different status, not as last card
                        switchNum = 2
                    }
                    targetColumn.insertBefore(currentDrag, card)
                    switch (switchNum) {
                        case 1:
                            rearrangeCardOrders(targetColumn.children)
                            break;
                        case 2:
                            currentDrag.dataset.cardStatusId=card.dataset.cardStatusId
                            dataHandler.updateStatus(card.dataset.cardStatusId, currentDrag.dataset.cardId)
                            rearrangeCardOrders(currentColumn.children)
                            rearrangeCardOrders(targetColumn.children)
                            break;
                    }
                } else {
                    console.log('drop on card in different board is not allowed')
                }
            }
        }
    }
    for (let column of columns) {
        column.ondragover = (e) => {
            e.preventDefault()
        }
        column.ondrop = (e) => {
            if (e.target === column) {
                let switchNum
                let currentColumn = currentDrag.parentElement
                if (currentDrag.dataset.boardId === column.dataset.boardId) {
                    if (currentDrag.dataset.cardStatusId === column.dataset.statusId) {
                        // drop on same status as last card
                        switchNum = 1
                    } else {
                        // drop on different status as last card
                        switchNum = 2
                    }
                    column.append(currentDrag)
                    switch (switchNum) {
                        case 1:
                            rearrangeCardOrders(column.children)
                            break;
                        case 2:
                            currentDrag.dataset.cardStatusId = column.dataset.statusId
                            dataHandler.updateStatus(column.dataset.statusId, currentDrag.dataset.cardId)
                            rearrangeCardOrders(currentColumn.children)
                            rearrangeCardOrders(column.children)
                            break;
                    }
                } else {
                    console.log('drop on column in different board is not allowed')
                }
            }
        }
    }
}

async function addCardButtonHandler(clickEvent) {
    const boardId = clickEvent.target.dataset.boardId
    const newCard = await dataHandler.createNewCard("newCard", boardId);
    domManager.addChild(`.board-column-content[data-board-id="${boardId}"]`, cardBuilder(newCard));
    domManager.addEventListener(
        `[data-card-id-remove="${newCard.id}"]`,
        "click",
        deleteCardButtonHandler
    )
    initDragAndDrop();
}


export function addNewBoardHandler() {
    const addNewBoardButton = document.querySelector('.new-board-button');
    addNewBoardButton.addEventListener('click', () => {
        document.querySelector('.modal.add-board-modal').classList.add('new-board-modal');
        document.querySelector('.modal').classList.add('new-board-modal');
        let modalCloseButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
        modalCloseButtons.forEach(button => button.addEventListener('click', async () => {
            document.querySelector('.modal').classList.remove('new-board-modal');
        }));
    });
    document.querySelector('#save-title-button').addEventListener('click', async () => {
        document.querySelector('.modal.add-board-modal').classList.remove('new-board-modal');
        const boardTitle = document.querySelector('#board-title').value;
        if (boardTitle !== '') {
            const response = await dataHandler.createNewBoard(boardTitle);
            const newBoard = boardBuilder(response);
            domManager.addChild('.board-container', newBoard);
            const showHideButton = document.querySelector(`.toggle-board-button[data-board-id="${response.id}"]`);
            const deleteBoardButton = document.querySelector(`.board-remove[data-board-id-remove="${response.id}"]`);
            deleteBoardButton.addEventListener("click", deleteBoardButtonHandler);
            showHideButton.addEventListener("click", showHideButtonHandler);
        }
    });
}

export function addColumnHandler(event) {
    const boardID = event.currentTarget.dataset.boardId;
    document.querySelector('.modal.add-column-modal').classList.add('new-board-modal');
    let modalCloseButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
    modalCloseButtons.forEach(button => button.addEventListener('click', async () => {
        document.querySelector('.add-column-modal').classList.remove('new-board-modal');
    }));
    const saveChangesButton = document.querySelector('#save-status-button')
    saveChangesButton.addEventListener('click', saveChangesButton.handler = async () => {
        document.querySelector('.modal.add-column-modal').classList.remove('new-board-modal');
        const columnStatus = document.querySelector('#column-status').value;
        if (columnStatus !== '') {
            const response = await dataHandler.createNewColumn(columnStatus, boardID);
            const newColumn = newColumnBuilder(boardID, response);
            saveChangesButton.removeEventListener('click', saveChangesButton.handler);
            domManager.addChild(`.board-columns[data-board-id="${boardID}"]`, newColumn);
            const deleteColumnButton = document.querySelector(`.fas.fa-trash-alt.remove-column[data-status-id-remove="${response.id}"]`);
            deleteColumnButton.addEventListener("click", deleteColumnHandler);
        }
        initDragAndDrop();
    });
}

export function registerHandler() {
    document.querySelector('.modal.register-modal').classList.add('new-board-modal');
    let modalCloseButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
    modalCloseButtons.forEach(button => button.addEventListener('click', async () => {
        document.querySelector('.register-modal').classList.remove('new-board-modal');
    }));
    const saveChangesButton = document.querySelector('#save-user-button')
    saveChangesButton.addEventListener('click', saveChangesButton.handler = async () => {
        document.querySelector('.modal.register-modal').classList.remove('new-board-modal');
    });
}


export function loginHandler() {
    document.querySelector('.modal.login-modal').classList.add('new-board-modal');
    let modalCloseButtons = document.querySelectorAll('[data-bs-dismiss="modal"]');
    modalCloseButtons.forEach(button => button.addEventListener('click', async () => {
        document.querySelector('.login-modal').classList.remove('new-board-modal');
    }));
    const saveChangesButton = document.querySelector('#enter-user-button')
    saveChangesButton.addEventListener('click', saveChangesButton.handler = async () => {
        document.querySelector('.modal.login-modal').classList.remove('new-board-modal');
    });
}


function deleteColumnHandler(event) {
    dataHandler.deleteStatus(event.target.dataset.statusIdRemove)
    event.target.parentElement.parentElement.remove()
}


function updateTitle(clickEvent) {
    if (clickEvent.key === "Enter") {
        let value = clickEvent.currentTarget.value
        let boardId = clickEvent.currentTarget.dataset.boardId
        clickEvent.currentTarget.blur()
        dataHandler.renameBoardTitle(boardId, value)
    }
}

function rearrangeCardOrders(column) {
    for (let i = 0; i < column.length; i++) {
        column[i].dataset.cardOrder = i
        dataHandler.updateCardOrder(i, column[i].dataset.cardId)
    }
}
