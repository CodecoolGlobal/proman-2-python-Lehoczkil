import {boardsManager} from "./controller/boardsManager.js";

async function init() {
    await boardsManager.loadBoards();
    boardsManager.addNewBoardHandler();
}


init();
