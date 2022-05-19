import {boardsManager} from "./controller/boardsManager.js";

async function init() {
    boardsManager.loadBoards();
    boardsManager.addNewBoardHandler();
}


init();
