    // ==UserScript==
    // @name         AutoChessHelper
    // @namespace    https://www.chess.com//
    // @version      0.1
    // @description  try to win it
    // @author       Propsi4
    // @include      https://www.chess.com/play/*
    // @include      https://www.chess.com/game/*
    // @icon         https://www.google.com/s2/favicons?sz=64&domain=chess.com
    // @grant        none
    // ==/UserScript==

    const xhr = new XMLHttpRequest();
    let team = 'w';
    let skill_level = 0;

    const highlight_from_div = document.createElement("div")
    const highlight_to_div = document.createElement("div")
    highlight_from_div.classList.add("hover-square")
    highlight_to_div.classList.add("hover-square")
    highlight_from_div.style.backgroundColor = "red"
    highlight_to_div.style.backgroundColor = "red"
    highlight_from_div.style.opacity = "0.5"
    highlight_to_div.style.opacity = "0.5"
    highlight_from_div.style.zIndex = "-1"
    highlight_to_div.style.zIndex = "-1"
    highlight_from_div.style.visibility = "hidden"
    highlight_to_div.style.visibility = "hidden"


    const best_move_span = document.createElement("span")
    best_move_span.innerHTML = "Best move: "
    best_move_span.style.position = "absolute"
    best_move_span.style.bottom = "0px"
    best_move_span.style.left = "0px"
    best_move_span.style.width = "90%"
    best_move_span.style.fontSize = "3rem"
    best_move_span.style.fontWeight = "bold"
    best_move_span.style.textAlign = "center"
    best_move_span.style.textShadow = "1px 1px 5px #000"
    best_move_span.style.color = "#e8c700"

    const check_if_opponent_moved = (prev_board, board) => {
        let opponent_moved = false
        if(prev_board.length !== board.length){
            let prev_w_alive = 0
            let prev_b_alive = 0
            for(let j = 0; j < prev_board.length; j++) {
                if(prev_board[j].figure == prev_board[j].figure.toUpperCase()) prev_w_alive++
                else prev_b_alive++
            }
            let w_alive = 0
            let b_alive = 0
            for(let j = 0; j < board.length; j++) {
                if(board[j].figure == board[j].figure.toUpperCase()) w_alive++
                else b_alive++
            }
            if(team == 'w' && b_alive != prev_b_alive) {
                highlight_from_div.style.visibility = "hidden"
                highlight_to_div.style.visibility = "hidden"
                return false

            }
            if(team == 'b' && w_alive != prev_w_alive) {
                highlight_from_div.style.visibility = "hidden"
                highlight_to_div.style.visibility = "hidden"
                return false

            }
            return true
        }
        for(let i = 0; i < prev_board.length; i++) {


            if(prev_board[i].posX != board[i].posX || prev_board[i].posY != board[i].posY) {
                highlight_from_div.style.visibility = "hidden"
                highlight_to_div.style.visibility = "hidden"
                if(team == 'w' && prev_board[i].figure == prev_board[i].figure.toUpperCase()) break
                if(team == 'b' && prev_board[i].figure == prev_board[i].figure.toLowerCase()) break
                opponent_moved = true
                break
            }
        }
        return opponent_moved
    }

    const display_best_move = (best_move) => {
        let map_letters = {
            'a': 1,
            'b': 2,
            'c': 3,
            'd': 4,
            'e': 5,
            'f': 6,
            'g': 7,
            'h': 8
        }
        // split 4 char string into two 2 char strings
        const best_move_letters = best_move.split('')
        const from = best_move_letters.slice(0, 2)
        const to = best_move_letters.slice(2, 4)

        // if square- in highlight_from_div.classList
        let highlight_from_div_square = Array.from(highlight_from_div.classList).find((el) => el.includes('square-'))
        if(highlight_from_div_square){
            highlight_from_div.classList.remove(highlight_from_div_square)
        }
        if(highlight_from_div.style.visibility == "hidden") highlight_from_div.style.visibility = "visible"
        highlight_from_div.classList.add(`square-${map_letters[from[0]]}${from[1]}`)

        let highlight_to_div_square = Array.from(highlight_to_div.classList).find((el) => el.includes('square-'))
        if(highlight_to_div_square){
            highlight_to_div.classList.remove(highlight_to_div_square)
        }
        if(highlight_to_div.style.visibility == "hidden") highlight_to_div.style.visibility = "visible"
        highlight_to_div.classList.add(`square-${map_letters[to[0]]}${to[1]}`)


        // change square-11 to my square-21 values


        // set background color to yellow

    }

    const send_board = (board) => {
        try{
        fetch('http://localhost:5000/update_board', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({board: board, team: team, skill_level: skill_level})
        }).then(response => response.json()).then(data => {
            best_move_span.innerHTML = "Best move: " + data.best_move
            display_best_move(data.best_move)
        })

    } catch (error) {
    window.alert("Something went wrong, please try again. Details in console")
        console.log(error)
    }
    }

    const get_board = () => {
            const wc_chess_board = document.getElementsByTagName("wc-chess-board")[0].children
            // get elements from wc_chess_board where class name starts with "piece"
            const pieces_divs = Array.from(wc_chess_board).filter((el) => el.classList[0].startsWith("piece"))
            // form lists like {'figure': 'piece-1', 'color': 'white', 'position': 'a1'}
            const pieces = pieces_divs.map((el) => {
                team_figure_string = Array.from(el.classList).find((el) => el.length === 2) // wb, bb, wr, br, etc.
                // get the last two symbols from the class name
                let figure = team_figure_string.slice(-1)
                const team = team_figure_string.slice(-2)[0]
                if(team == 'w') {
                    figure = figure.toUpperCase()
                }
                else {
                    figure = figure.toLowerCase()
                }
                let square_string = Array.from(el.classList).find((el) => el.startsWith('square-')) // square-11, square-52, etc.
                // get second last char
                const posX = parseInt(square_string.slice(-2)[0])
                // get last char
                const posY = parseInt(square_string.slice(-1))
                return {figure, posX, posY}
            })
            return pieces
    }

    const process_calculation = () => {
        let board = get_board()
        send_board(board)
        setInterval(() => {
            if(!process_calculation.prev_board){
                process_calculation.prev_board = get_board()
            }
            board = get_board()
            if(check_if_opponent_moved(process_calculation.prev_board, board)) {
                send_board(board)
            }
            process_calculation.prev_board = board
        }, 2000)
    }

    (async function() {
        'use strict';
        // check the connection, fetch via xhr to localhost:5000 and check if it works, if not then don't do anything
        // wait for response
        window.addEventListener('load', function() {
            // create a button on board-layout-chessboard div

            const board_layout_chessboard = document.getElementsByClassName("board-layout-chessboard")[0]
            let wc_chess_board
            setTimeout(() => {
                wc_chess_board = document.getElementsByTagName('wc-chess-board')[0]
                wc_chess_board.appendChild(highlight_from_div)
                wc_chess_board.appendChild(highlight_to_div)
            }, 3000)



            const predict_button = document.createElement("button")
            predict_button.innerHTML = "Start calculating"
            predict_button.onclick = () => {
                console.log("Start calculating")
                predict_button.disabled = true
                process_calculation()
            }

            // add a team change button
            const team_change_button = document.createElement("button")
            team_change_button.innerHTML = "Change team"
            team_change_button.style.color = "gray"
            team_change_button.style.fontWeight = "bold"
            team_change_button.style.backgroundColor = "white"
            team_change_button.onclick = () => {
                if(team == 'w') {
                    team = 'b'
                    team_change_button.style.backgroundColor = "black"
                }
                else {
                    team = 'w'
                    team_change_button.style.backgroundColor = "white"
                }
            }
            board_layout_chessboard.appendChild(team_change_button)

            // add a elo slider
            const skill_slider = document.createElement("input")
            const skill_slider_p = document.createElement("p")
            skill_slider_p.innerHTML = "Skill Level: " + skill_slider.value
            skill_slider_p.style.color = "white"
            skill_slider_p.style.fontWeight = "bold"
            skill_slider_p.style.writingMode = "vertical-rl"
            skill_slider_p.style.textAlign = "center"
            skill_slider_p.style.padding = "10px"

            skill_slider.type = "range"
            skill_slider.style.marginInline = "5px"
            skill_slider.style.zIndex = "2"
            skill_slider.min = 0
            skill_slider.max = 20
            skill_slider.value = 0
            skill_slider.style.width = "100%"
            skill_slider.style.appearance = 'slider-vertical'
            skill_slider.oninput = (e) => {
                skill_slider_p.innerHTML = "Skill Level: " + skill_slider.value
                skill_level = skill_slider.value
            }


            board_layout_chessboard.appendChild(predict_button)
            board_layout_chessboard.appendChild(skill_slider)
            board_layout_chessboard.appendChild(best_move_span)
            board_layout_chessboard.appendChild(skill_slider_p)


        }, false);
    }
    )();
