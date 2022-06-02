import data_manager


def get_card_status(status_id):
    """
    Find the first status matching the given id
    :param status_id:
    :return: str
    """
    status = data_manager.execute_select("""
        SELECT * FROM statuses s
        WHERE s.id = %(status_id)s
        ;
        """, {"status_id": status_id})

    return status


def get_boards():
    """
    Gather all boards
    :return:
    """
    return data_manager.execute_select("""
        SELECT * FROM boards
        Order By id
        ;
        """)


def get_cards_for_board(board_id):
    matching_cards = data_manager.execute_select("""
        SELECT * FROM cards
        WHERE cards.board_id = %(board_id)s
        ORDER BY cards.card_order
        ;
        """, {"board_id": board_id})

    return matching_cards


def add_new_board(board_title):
    return data_manager.execute_select("""
        INSERT INTO boards
        (title)
        VALUES (%(board_title)s)
        RETURNING *
        ;
        """, {"board_title": board_title}, fetchall=False)


def add_new_column(column_status, board_id):
    return data_manager.execute_select(
        """
        INSERT INTO statuses
        (title, board_id)
        VALUES (%(column_status)s, %(board_id)s)
        RETURNING *
        ;
        """
        , {"column_status": column_status,
           "board_id": board_id}, fetchall=False)


def create_default_columns(board_id):
    add_new_column("new", board_id)
    add_new_column("planning", board_id)
    add_new_column("in progress", board_id)
    add_new_column("done", board_id)


def get_cards_for_status(status_id):
    matching_cards = data_manager.execute_select("""
        SELECT * FROM cards
        WHERE cards.status_id = %(status_id)s
        ORDER BY cards.id;
        """, {"status_id": status_id})

    return matching_cards


def delete_card(card_id):
    data_manager.execute_delete("""
        DELETE FROM cards
        WHERE cards.id = %(card_id)s
        ;
        """, {"card_id": card_id})


def delete_board(board_id):
    data_manager.execute_delete("""
        DELETE FROM boards
        WHERE id = %(board_id)s
        ;
        """, {"board_id": board_id})


def delete_status(status_id):
    data_manager.execute_delete("""
        DELETE FROM statuses
        WHERE id = %(status_id)s
        ;
        """, {"status_id": status_id})


def add_card(board_id):
    max_order = data_manager.execute_select(
        """
        SELECT max(card_order) from cards
        WHERE board_id = %(board_id)s
        """, {"board_id": board_id}, False
    )
    new_order = max_order['max'] + 1 if max_order['max'] is not None else 1
    return data_manager.execute_select(statement="""
        INSERT INTO cards(board_id, status_id, title, card_order)
        VALUES('%(board_id)s',
               (SELECT min(id) from statuses
        WHERE board_id = %(board_id)s),
               'New Card',
               %(new_order)s)
        RETURNING *;
        """, variables={"board_id": board_id, "new_order": new_order}, fetchall=False)


def get_columns_by_board_id(board_id):
    columns = data_manager.execute_select(
        """
        SELECT * FROM statuses s
        WHERE s.board_id = %(board_id)s
        ;
        """
        , {"board_id": board_id})

    return columns


def update_board_title(board_id, new_title):
    return data_manager.execute_update(
        """
        UPDATE boards SET title = %(new_title)s
        WHERE id = %(board_id)s;""",
        {"board_id": board_id, "new_title": new_title}
    )


def update_card_title(card_id, new_title):
    return data_manager.execute_update(
        """
        UPDATE cards SET title = %(new_title)s
        WHERE id = %(card_id)s;""",
        {"card_id": card_id, "new_title": new_title}
    )


def update_card_status(new_status_id, card_id):
    return data_manager.execute_update(
        '''
        UPDATE cards
        SET status_id = %(new_status_id)s
        WHERE id = %(card_id)s;
        ''',
        {
            'new_status_id': new_status_id,
            'card_id': card_id
        }
    )


def update_card_order(new_card_order, card_id):
    return data_manager.execute_update(
        '''
        UPDATE cards
        SET card_order = %(new_card_order)s
        WHERE id = %(card_id)s;
        ''',
        {
            'new_card_order': new_card_order,
            'card_id': card_id
        }
    )
