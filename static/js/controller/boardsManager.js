import {dataHandler} from "../data/dataHandler.js";
import {boardBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";
import {cardsManager} from "./cardsManager.js";

export let boardsManager = {
    loadBoards: async function () {
        const boards = await dataHandler.getBoards();
        for (let board of boards) {
            const content = boardBuilder(board);
            domManager.addChild("#root", content);
            const showHideButton = document.querySelector(`.toggle-board-button[data-board-id="${board.id}"]`);
            showHideButton.addEventListener("click",showHideButtonHandler,{once:true})
        }
    },
};

function showHideButtonHandler(clickEvent) {
    const boardId = clickEvent.currentTarget.dataset.boardId;

    cardsManager.loadCards(boardId);
}
