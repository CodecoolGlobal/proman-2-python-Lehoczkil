import {dataHandler} from "../data/dataHandler.js";
import {cardBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const content = cardBuilder(card);
            await domManager.addChild(`.board-column-content[data-status-id="${card.status_id}"][data-board-id="${boardId}"]`, content);
            domManager.addEventListener(`[data-card-id-remove="${card.id}"]`, "click", deleteCardButtonHandler);
            const cardTitle = document.querySelector(`.card-title[data-card-id="${card.id}"]`);
            cardTitle.addEventListener('keydown', updateTitle);
        }
    }
};


export function deleteCardButtonHandler(clickEvent) {
    const cardId = (clickEvent.target.parentElement.parentElement.parentElement.dataset.cardId);
    dataHandler.deleteCard(cardId)
    clickEvent.target.parentElement.parentElement.parentElement.remove()
}


export function deleteBoardButtonHandler(clickEvent) {
    const board = (clickEvent.target.parentElement.parentElement.parentElement);
    const boardId = board.dataset.boardId
    dataHandler.deleteBoard(boardId)
    board.remove()
}


function updateTitle(clickEvent) {
    if (clickEvent.key === "Enter") {
        let value = clickEvent.currentTarget.value
        let cardId = clickEvent.currentTarget.dataset.cardId
        clickEvent.currentTarget.blur()
        dataHandler.renameCardTitle(cardId, value)
    }
}


async function updateCardStatus(newCardStatus, cardId) {
    await dataHandler.updateStatus(newCardStatus, cardId);
}
