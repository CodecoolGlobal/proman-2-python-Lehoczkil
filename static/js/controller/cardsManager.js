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
        const allCards = document.querySelectorAll('.card')
        const cols = document.querySelectorAll('.board-column-content');

        allCards.forEach(card => {
            card.setAttribute('draggable', true);
            card.addEventListener('dragstart', () => {
                card.classList.add('dragging');
            });

            card.addEventListener('dragend', () => {
                    card.classList.remove('dragging')
            });
        });

        cols.forEach(col => {
            col.addEventListener('dragover', e => {
                e.preventDefault();
            });

            col.addEventListener('drop', () => {
                const card = document.querySelector('.dragging');
                if (boardId === card.dataset.boardId) {
                    col.append(card);
                    const newStatusId = card.parentElement.dataset.statusId;
                    updateCardStatus(newStatusId, card.dataset.cardId);
                }
                else console.log('no, not in here')
            })
        });
    }
};

export function deleteCardButtonHandler(clickEvent) {
    const cardId = (clickEvent.target.parentElement.parentElement.dataset.cardId);
    dataHandler.deleteCard(cardId)
    clickEvent.target.parentElement.parentElement.remove()
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
