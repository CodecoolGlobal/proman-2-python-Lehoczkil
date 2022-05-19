import {dataHandler} from "../data/dataHandler.js";
import {cardBuilder} from "../view/htmlFactory.js";
import {domManager} from "../view/domManager.js";

export let cardsManager = {
    loadCards: async function (boardId) {
        const cards = await dataHandler.getCardsByBoardId(boardId);
        for (let card of cards) {
            const content = cardBuilder(card);
            await domManager.addChild(`.board-column-content[data-status-id="${card.status_id}"][data-board-id="${boardId}"]`, content);
            domManager.addEventListener(
                `[data-card-id-remove="${card.id}"]`,
                "click",
                deleteCardButtonHandler
            );
        }
    },
};

function deleteCardButtonHandler(clickEvent) {
    const cardId = (clickEvent.target.parentElement.parentElement.dataset.cardId);
    dataHandler.deleteCard(cardId)
    clickEvent.target.parentElement.parentElement.remove()
}
