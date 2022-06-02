import {boardsManager, registerHandler, loginHandler} from "./controller/boardsManager.js";

async function init() {
    await boardsManager.loadBoards();
    boardsManager.addNewBoardHandler();
    const registerButton = document.querySelector('#bt-register')
    registerButton.addEventListener('click', registerHandler)
    const loginButton = document.querySelector('#bt-login')
    loginButton.addEventListener('click', loginHandler)
}


init();
