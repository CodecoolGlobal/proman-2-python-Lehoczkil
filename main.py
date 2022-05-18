from flask import Flask, render_template, url_for
from dotenv import load_dotenv
from util import json_response
import mimetypes
import queries

mimetypes.add_type('application/javascript', '.js')
app = Flask(__name__)
load_dotenv()


@app.route("/")
def index():
    """
    This is a one-pager which shows all the boards and cards
    """
    return render_template('index.html')


@app.route("/api/boards")
@json_response
def get_boards():
    """
    All the boards
    """
    return queries.get_boards()


@app.route("/api/boards/<int:board_id>/cards/")
@json_response
def get_cards_for_board(board_id: int):
    """
    All cards that belongs to a board
    :param board_id: id of the parent board
    """
    return queries.get_cards_for_board(board_id)


@app.route("/api/cards/<int:card_id>/delete/", methods=["DELETE"])
def delete_card(card_id):
    print("delete card in progress")
    queries.delete_card(card_id)
    return ""


@app.route("/api/cards/<int:card_id>")
@json_response
def get_card_by_id():
    pass


@app.route("/api/boards/<int:board_id>/title", methods=['UPDATE'])
def update_board_title(board_id:int):

    return queries.update_board_title(board_id, new_title)


def main():
    app.run(debug=True)

    # Serving the favicon
    with app.app_context():
        app.add_url_rule('/favicon.ico', redirect_to=url_for('static', filename='favicon/favicon.ico'))


if __name__ == '__main__':
    main()
