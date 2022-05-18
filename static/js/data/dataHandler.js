export let dataHandler = {
    getBoards: async function () {
        return await apiGet("/api/boards");
    },
    getBoard: async function (boardId) {
        // the board is retrieved and then the callback function is called with the board
    },
    getStatuses: async function () {
        // the statuses are retrieved and then the callback function is called with the statuses
    },
    getStatus: async function (statusId) {
        // the status is retrieved and then the callback function is called with the status
    },
    getCardsByBoardId: async function (boardId) {
        return await apiGet(`/api/boards/${boardId}/cards/`);
    },
    getCard: async function (cardId) {
        // the card is retrieved and then the callback function is called with the card
        return await apiGet(`/api/cards/${cardId}`)
    },
    createNewBoard: async function (boardTitle) {
        return apiPost(
            '/api/new_board',
            {'title': boardTitle}
        );
    },
    createNewCard: async function (cardTitle, boardId, statusId) {
        // creates new card, saves it and calls the callback function with its data
    },
    renameBoardTitle: async  function (boardId, newTitle) {
        return await apiPost(`/api/boards/${boardId}/update_title`, newTitle)
    },
    deleteCard: async function (cardId) {
        await apiDelete(`/api/cards/${cardId}/delete/`)

};

async function apiGet(url) {
    let response = await fetch(url, {
        method: "GET",
    });
    if (response.ok) {
        return await response.json();
    }
}

async function apiPost(url, payload) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    return response.json();
}

async function apiDelete(url) {
        await fetch(url, {
            method: "DELETE",
        });
    }

async function apiPut(url) {
}

async function apiPatch(url) {
}
