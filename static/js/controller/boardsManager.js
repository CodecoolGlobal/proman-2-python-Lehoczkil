import {dataHandler} from "../data/dataHandler.js";
import {addButtonBuilder, boardBuilder, columnsBuilder, newColumnBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            const addColumnButton = document.querySelector(`.add-column-button[data-board-id="${board.id}"]`);
            addColumnButton.addEventListener("click", addColumnHandler);
            const showHideButton = document.querySelector(`.toggle-board-button[data-board-id="${board.id}"]`);
            showHideButton.addEventListener("click",showHideButtonHandler)
        }
    },
    addNewBoardHandler: addNewBoardHandler
};

function showHideButtonHandler(clickEvent) {
    const board = clickEvent.currentTarget.parentElement.parentElement;
    const boardId = board.dataset.boardId;
    const addColumnButton = document.querySelector(`.add-column-button[data-board-id="${boardId}"]`);
    let columns = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
    let addButton = document.querySelector(`.board-add[data-board-id="${boardId}"]`);
    if(board.childElementCount>1){
        addButton.remove();
        columns.remove();
    }else {
        addButton = addButtonBuilder(boardId);
        columns = columnsBuilder(boardId);
        domManager.addChild(`.board[data-board-id="${boardId}"]`, columns);
        domManager.addChild(`.board-header[data-board-id="${boardId}"]`, addButton);
        addButton = document.querySelector(`.board-add[data-board-id="${boardId}"]`);
        addButton.addEventListener("click",addButtonHandler);
        cardsManager.loadCards(boardId);
        addColumnButton.style.display = 'inline';
    }
}

function addButtonHandler(clickEvent){
    const boardId = clickEvent.target.dataset.boardId
    const column = document.querySelector(`.board-column-content[data-board-id="${boardId}"]`)
    dataHandler.createNewCard("newCard", boardId,"1").then(res => {const newCard = res;
    console.log(newCard)})
    console.log(column)
}


export function addNewBoardHandler() {
    const addNewBoardButton = document.querySelector('.new-board-button');
    addNewBoardButton.addEventListener('click', () => {
        document.querySelector('.modal.add-board-modal').classList.add('new-board-modal');
    });
    document.querySelector('#save-title-button').addEventListener('click', async () => {
        document.querySelector('.modal.add-board-modal').classList.remove('new-board-modal');
        const boardTitle = document.querySelector('#board-title').value;
        if (boardTitle !== '') {
            const response = await dataHandler.createNewBoard(boardTitle);
            const newBoard = boardBuilder(response);
            domManager.addChild('.board-container', newBoard)
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
            const response = await dataHandler.createNewColumn(columnStatus);
            console.log(boardID);
            const newColumn = newColumnBuilder(boardID, response);
            domManager.addChild('.board-columns', newColumn)
        }
    });
}
