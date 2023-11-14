import matplotlib.pyplot as plt



def draw_board(figures):
    print(figures)
    _, ax = plt.subplots()
    ax.set_xlim(0, 8)
    ax.set_ylim(0, 8)
    ax.set_xticks(range(1, 9))
    ax.set_yticks(range(1, 9))
    ax.set_xticklabels(["A", "B", "C", "D", "E", "F", "G", "H"])
    # ax.set_yticklabels(range(1, 9))
    ax.grid(True)
    # ax.set_axisbelow(True)
    ax.set_aspect('equal')
    ax.set_facecolor('xkcd:light grey')
    ax.set_title("Chess")
    for figure in figures:
        ax.text(float(figure["posX"])-0.5, float(figure["posY"])-0.5, figure["figure"], ha="center", va="center", color=figure["team"])
    plt.show()
    plt.close()

if __name__ == "__main__":
    draw_board()
    