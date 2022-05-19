import {dataHandler} from "../data/dataHandler.js";
import {addCardButtonBuilder, boardBuilder, cardBuilder, columnsBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager, deleteCardButtonHandler} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            const showHideButton = document.querySelector(`.toggle-board-button[data-board-id="${board.id}"]`);
            showHideButton.addEventListener("click",showHideButtonHandler)
        }
    },
    addNewBoardHandler: addNewBoardHandler
};

function showHideButtonHandler(clickEvent) {
    const board = clickEvent.currentTarget.parentElement.parentElement;
    const boardId = board.dataset.boardId;
    let columns = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
    let addCardButton = document.querySelector(`.board-add[data-board-id="${boardId}"]`);
    if(board.childElementCount>1){
        addCardButton.remove();
        columns.remove();
    }else {
        addCardButton = addCardButtonBuilder(boardId);
        columns = columnsBuilder(boardId);
        domManager.addChild(`.board[data-board-id="${boardId}"]`, columns);
        domManager.addChild(`.board-header[data-board-id="${boardId}"]`, addCardButton);
        addCardButton = document.querySelector(`.board-add[data-board-id="${boardId}"]`);
        addCardButton.addEventListener("click",addCardButtonHandler);
        cardsManager.loadCards(boardId);
    }
}

function addCardButtonHandler(clickEvent){
    const boardId = clickEvent.target.dataset.boardId
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
        document.querySelector('.modal').classList.add('new-board-modal');
    });
    document.querySelector('#save-title-button').addEventListener('click', async () => {
        document.querySelector('.modal').classList.remove('new-board-modal');
        const boardTitle = document.querySelector('#board-title').value;
        if (boardTitle !== '') {
            const response = await dataHandler.createNewBoard(boardTitle);
            const newBoard = boardBuilder(response);
            domManager.addChild('.board-container', newBoard)
        }
    });
}
