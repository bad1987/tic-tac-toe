// players symbols
const human = "X"
const machine = "O"
// who's turn it is? 1 for human and 2 for the machine
const player_turn = 1
// Infinity constant
const INFINITY = 1000000


const creatGrid = () => {
    const grid = document.querySelector(".grid")
    grid.innerHTML = ""
    for(let i=1; i<=9; i++){
        const box = document.createElement('div')
        box.setAttribute('class', 'box')
        box.setAttribute('id', i)
        box.addEventListener('click', handleClick)
        grid.appendChild(box)
    }
}

const handleReset = () => {
    for(let i=1; i<=9; i++){
        document.getElementById(i).innerHTML = ""
    }
    document.querySelector("#winner").innerHTML = ""
}
// attach the click event on the reset button
document.querySelector(".reset").addEventListener("click",handleReset)

const check_win = () => {
    let end = game_over()
    if(end){
        set_winner(end)
        return
    }
}

const handleClick = event => {
    check_win()
    appendText(event.target, human)
    check_win()

    if(can_play()){
        const bestmove = findBestMove(generate_board())
        const id = parseInt(bestmove[0]) * 3 + parseInt(bestmove[1]) + 1
        document.getElementById(id).innerHTML = machine
    }
    check_win()
}

const can_play = () => {
    for(let i=1; i<=9; i++){
        if(!document.getElementById(i).innerHTML){
            return true
        }
    }
    return false
}

const set_winner = winner => {
    const screen = document.querySelector("#winner")
    screen.innerHTML = winner
}

const appendText = (element, value) => {
    const text = document.createTextNode(value)
    if(!element.innerHTML){
        element.appendChild(text)
    }
}

const game_over = () => {
    const board = generate_board()
    let result = eval_func(board)
    return result ? result : can_minimax_play(board) ? null : "Draw"
}

// minimax algorithm to find the best move
const minimax = (board, depth, isMaximizer) => {
    if(!can_minimax_play(board)){
        const state = eval_func(board)
        if(state === machine){
            return 10
        }
        else if(state === human){
            return -10
        }
        else{
            return 0
        }
    }

    if(isMaximizer){
        let bestVal = -1 * INFINITY
        for(let i in board){
            for(let j in board){
                if(board[i][j] === '_'){
                    board[i][j] = machine
                    bestVal = Math.max(minimax(board, depth + 1, false), bestVal)
                    board[i][j] = '_'
                }
            }
        }
        return bestVal
    }
    else{
        let bestVal = INFINITY
        for(let i in board){
            for(let j in board){
                if(board[i][j] === '_'){
                    board[i][j] = human
                    bestVal = Math.min(minimax(board, depth + 1, true), bestVal)
                    board[i][j] = '_'
                }
            }
        }
        return bestVal
    }
}

const findBestMove = board => {
    let bestVal = -1 * Infinity
    let bestMove = []
    for(let i in board){
        for(let j in board){
            if(board[i][j] === '_'){
                board[i][j] = machine
                let curVal = minimax(board, 0, false)
                board[i][j] = '_'
                if(curVal > bestVal){
                    bestMove = [i,j]
                    bestVal = curVal
                }
            }
        }
    }
    return bestMove
}

const generate_board = () => {
    const board = []
    let temp = []
    for(let i=1; i<= 9; i++){
        const content = document.getElementById(i).innerHTML
        temp.push(content ? content : "_")
        if(i%3 === 0){
            board.push([...temp])
            temp = []
        }
    }
    return board
}

const eval_func = (board) => {
    let winner = false
    for(let row of board){
        if(row[0] === row[1] && row[1] === row[2] && (row[0] === human || row[0] === machine)){
            winner = row[0]
            break
        }
    }
    if(!winner){
        if(board[0][0] === board[1][0] && board[1][0] === board[2][0] && (board[1][0] === human || board[1][0] === machine)){
            winner = board[0][0]
        }
        else if(board[0][2] === board[1][2] && board[1][2] === board[2][2] && (board[0][2] === human || board[0][2] === machine)){
            winner = board[0][2]
        }
        else if(board[0][0] === board[1][1] && board[1][1] === board[2][2] && (board[0][0] === human || board[0][0] === machine)){
            winner = board[0][0]
        }
        else if(board[0][2] === board[1][1] && board[1][1] === board[2][0] && (board[0][2] === human || board[0][2] === machine)){
            winner = board[0][2]
        }
    }
    return winner
}

const can_minimax_play = board => {
    for(let row of board){
        if(row[0] === '_' || row[1] === '_' || row[2] === '_')
            return true
    }
    return false
}

creatGrid()