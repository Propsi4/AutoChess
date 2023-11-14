import stockfish
import os
import numpy as np
# generate fen based on json with element like {"figure":"K","posx":1, "posy":5} - K is uppercase for white,  k is lowercase for black

# test = np.array([
#  ['r', ' ', 'b', ' ', 'k', 'b', 'n', 'r'],
#  ['p', ' ', ' ', 'p', ' ', 'p', ' ', 'p'],
#  [' ', ' ', ' ', ' ', 'p', ' ', ' ', ' '],
#  [' ', ' ', ' ', ' ', ' ', ' ', 'p', ' '],
#  [' ', ' ', 'P', 'p', 'P', ' ', ' ', 'P'],
#  [' ', ' ', ' ', 'B', ' ', 'P', ' ', ' '],
#  ['P', 'P', ' ', 'P', ' ', ' ', ' ', 'P'],
#  ['R', ' ', 'B', 'Q', ' ', 'K', ' ', 'R']], dtype=str)

def generate_fen(board_json, team):
    # create matrix 8x8 with text values
    board = np.full((8,8), ' ', dtype=str)
    for element in board_json:
        board[element["posX"]-1][element["posY"]-1] = element["figure"]
    
    # convert matrix to fen
    board = board.T
    board = np.flip(board, 0)

        
    print(board)
        
    
    
    fen = ""
    for row in board:
        space_count = 0
        for i, element in enumerate(row):
            if element == " ":
                space_count += 1
            elif space_count != 0:
                fen += str(space_count)
                space_count = 0
                fen += element
            else:
                fen += element
            if i == len(row)-1 and space_count != 0:
                fen += str(space_count)
        fen += "/"
    fen = fen[:-1]
    fen += " " + team + " - - 0 1"
    print(fen)
    return fen


class Predict:
    def __init__(self, board_json, team, skill_level):
        self.board_json = board_json
        self.team = team
        self.skill_level = int(skill_level)
        self.fen = generate_fen(board_json, team)
        self.engine = stockfish.Stockfish(path=os.path.join(os.path.dirname(__file__), 'stockfish-windows.exe'))
        self.engine.set_skill_level(self.skill_level)


    def check_fen(self):
        return self.engine.is_fen_valid(self.fen)
    
    def predict(self):
        self.engine.set_fen_position(self.fen)
        return self.engine.get_best_move()
    
