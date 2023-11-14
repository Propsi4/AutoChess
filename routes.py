from flask import request
# from modules.draw_board import draw_board
from modules.predict.predict import Predict

def routes(app):
    @app.route("/")
    def connect():
        return {"message" : "Successfully connected to server"}

    @app.route("/update_board", methods=["POST"])
    def draw():
        json = request.get_json()
        board = json["board"]
        team = json["team"]
        skill_level = json["skill_level"]
        best_move = Predict(board, team, skill_level).predict()
        return {"best_move": best_move}
        # draw_board(json)
