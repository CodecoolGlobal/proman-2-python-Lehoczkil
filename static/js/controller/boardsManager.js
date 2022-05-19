import {dataHandler} from "../data/dataHandler.js";
import {addCardButtonBuilder, boardBuilder, columnsBuilder, newColumnBuilder, cardBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager, deleteCardButtonHandler, deleteBoardButtonHandler} from "./cardsManager.js";

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
            deleteBoardButton.addEventListener("click",deleteBoardButtonHandler)
            showHideButton.addEventListener("click",showHideButtonHandler)
        }
    },
    addNewBoardHandler: addNewBoardHandler
};

async function showHideButtonHandler(clickEvent) {
    const board = clickEvent.currentTarget.parentElement.parentElement;
    const boardId = board.dataset.boardId;
    const addColumnButton = document.querySelector(`.add-column-button[data-board-id="${boardId}"]`);
    let columns = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
    let addCardButton = document.querySelector(`.board-add[data-board-id="${boardId}"]`);
    if(board.childElementCount>1){
        addCardButton.remove();
        columns.remove();
        addColumnButton.style.display = 'none';
    }else {
        addCardButton = addCardButtonBuilder(boardId);
        columns = await columnsBuilder(boardId);
        domManager.addChild(`.board[data-board-id="${boardId}"]`, columns);
        domManager.addChild(`.board-header[data-board-id="${boardId}"]`, addCardButton);
        addCardButton = document.querySelector(`.board-add[data-board-id="${boardId}"]`);
        addCardButton.addEventListener("click",addCardButtonHandler);
        await cardsManager.loadCards(boardId);
        addColumnButton.style.display = 'inline';
    }
}

function addCardButtonHandler(clickEvent){
    const boardId = clickEvent.target.dataset.boardId
    const column = document.querySelector(`.board-column-content[data-board-id="${boardId}"]`)
    dataHandler.createNewCard("newCard", boardId,"1").then(res => {const newCard = res;
    console.log(newCard)})
    console.log(column)
    let card
    dataHandler.createNewCard("newCard", boardId,"1").then(res => {
        card = cardBuilder(res);
        domManager.addChild(`.board-column-content[data-board-id="${boardId}"]`,card);
        domManager.addEventListener(
                `[data-card-id-remove="${res.id}"]`,
                "click",
                deleteCardButtonHandler
            );
    });
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
    console.log(boardID);
    const addColumnButton = document.querySelector('.add-column-button');
    document.querySelector('.modal.add-column-modal').classList.add('new-board-modal');
    document.querySelector('#save-status-button').addEventListener('click', async () => {
        document.querySelector('.modal.add-column-modal').classList.remove('new-board-modal');
        const columnStatus = document.querySelector('#column-status').value;
        if (columnStatus !== '') {
            const response = await dataHandler.createNewColumn(columnStatus, boardID);
            const newColumn = newColumnBuilder(boardID, response);
            domManager.addChild('.board-columns', newColumn)
        }
    });
}
