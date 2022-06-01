import {boardsManager, registerHandler} from "./controller/boardsManager.js";

async function init() {
    await boardsManager.loadBoards();
    boardsManager.addNewBoardHandler();
    const registerButton = document.querySelector('#bt-register')
    registerButton.addEventListener('click', registerHandler)
}


init();
