import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select(
        """
        SELECT * FROM boards
        ;
        """
    )


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return matching_cards



def add_new_board(board_title):
    return data_manager.execute_select(
        """
        INSERT INTO boards
        (title)
        VALUES (%(board_title)s)
        RETURNING *
        ;
        """
        , {"board_title": board_title}, fetchall=False)

def get_cards_for_status(status_id):
    matching_cards = data_manager.execute_select(
        """
        SELECT * FROM cards
        WHERE cards.status_id = %(status_id)s
        ;
        """
        , {"status_id": status_id})

    return matching_cards


def delete_card(card_id):
    data_manager.execute_delete(
        """
        DELETE FROM cards
        WHERE cards.id = %(card_id)s
        ;
        """
        , {"card_id": card_id}
    )

