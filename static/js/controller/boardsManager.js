import {dataHandler} from "../data/dataHandler.js";
import {boardBuilder, columnsBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            const showHideButton = document.querySelector(`.toggle-board-button[data-board-id="${board.id}"]`);
            showHideButton.addEventListener("click",showHideButtonHandler)
            const boardTitle = document.querySelector(`.board-title-input[data-board-id="${board.id}"]`)
            boardTitle.addEventListener('keydown', updateTitle)
        }
    },
    addNewBoardHandler: addNewBoardHandler
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId;
    let columns = document.querySelector(`.board-columns[data-board-id="${boardId}"]`);
    if(columns){
        columns.remove();
    }else {
        columns = columnsBuilder(boardId);
        domManager.addChild(`.board[data-board-id="${boardId}"]`, columns);
        cardsManager.loadCards(boardId);
    }
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

function updateTitle(clickEvent) {
    if (clickEvent.key === "Enter") {
        let value = {
            "title": clickEvent.currentTarget.value
        }
        let boardId = clickEvent.currentTarget.dataset.boardId
        dataHandler.renameBoardTitle(boardId, value)
    }
}