const mongoose = require('mongoose');
const Game = mongoose.model('Game');

const empatyBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]
const checkBoard = (board) => {
    let leftAngle = board[0][0], rightAngel = board[0][2]
    let endGame = false;
    for (let i = 0; i < 3; i++) {
        let winX = board[i][0]; winY = board[0][i];
        for (let j = 0; j < 3; j++) {
            if (!endGame && board[i][j] == null) {
                endGame = true;
            }
            if (winX != null && board[i][j] != winX)
                winX = null
            if (winY != null && board[j][i] != winY)
                winY = null
        }
        if (winX !== null) return winX;
        if (winY !== null) return winY;
        if (leftAngle != null && board[i][i] != leftAngle)
            leftAngle = null
        if (rightAngel != null && board[i][2 - i] != rightAngel)
            rightAngel = null
    }
    if (leftAngle !== null) return leftAngle;
    if (rightAngel !== null) return rightAngel;
    return endGame;
}
const copTurn = (board, userChoice, pointCount) => {
    let winner = null;
    let userWin = null;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == null) {
                let cloneBoard = JSON.parse(JSON.stringify(board));
                cloneBoard[i][j] = 1 - userChoice;
                winner = checkBoard(cloneBoard)
                if (winner === 1 - userChoice) {
                    board[i][j] = 1 - userChoice;
                    return {
                        copI: i,
                        copJ: j,
                        winner
                    }
                }
                cloneBoard[i][j] = userChoice;
                if (checkBoard(cloneBoard) === userChoice) {
                    userWin = {
                        copI: i,
                        copJ: j
                    }
                }
            }
        }
    }
    let copI, copJ;
    if (userWin != null) {
        copI = userWin.copI;
        copJ = userWin.copJ;
    } else {
        let randomTurn = Math.trunc(Math.random() * (8 - pointCount));
        let k = 0;
        for (let i = 0; i < 9; i++) {
            if (board[Math.trunc(i / 3)][i % 3] == null) {
                if (k === randomTurn) {
                    copI = Math.trunc(i / 3);
                    copJ = i % 3;
                    break
                }
                k++;
            }
        }
    }
    board[copI][copJ] = 1 - userChoice;
    winner = checkBoard(board);
    return {
        copI,
        copJ,
        winner
    }
}
exports.getGame = (req, res) => {
    if (req.query.token) {
        Game.findById(req.query.token, (err, game) => {
            if(err) return next(err)
            res.json(game);
        })
    }
}
exports.createNewGame = (req, res) => {
    const newGame = new Game({
        userChoice: req.body.userChoice
    })
    if (req.body.userChoice == 1) {
        let board = JSON.parse(JSON.stringify(empatyBoard));
        const { copI, copJ } = copTurn(board, req.body.userChoice, 0);
        newGame.history = (copI + '' + copJ);
    }
    if(req.body.forceEnd){
        Game.findByIdAndUpdate(req.body.token, { $set: {status : 'force end'}}, (err, game) => {
            if(err) console.log(err)
        })
    }
    newGame.save((err, game) => {
        if(err) return next(err)

        res.json(game)
    })
  
}
exports.userTurn = (req, res, next) => {
    Game.findById(req.query.token, (err, game) => {
        if(err) return next(err)
       
        let board = JSON.parse(JSON.stringify(empatyBoard));
        let history = game.history ? game.history.split(',') : [];
        const userI = req.body.iIndex;
        const userJ = req.body.jIndex;
        for (let i = 0; i < history.length; i++) {
            board[history[i][0]][history[i][1]] = i % 2;
        }
        board[userI][userJ] = game.userChoice;
        history.push(userI + '' + userJ);
        const winner = checkBoard(board);
        if (winner === false) {
            game.status = 'tie';
        } else if (winner === 0 || winner === 1) {
            game.status = 'user win'
        } else {
            const { copI, copJ, winner } = copTurn(board, game.userChoice, history.length - 1);
            history.push(copI + '' + copJ);
            if (winner === false) game.status = 'tie';
            else if (winner === 0 || winner === 1) game.status = 'comp win';
        }
        game.history = history.join();
        game.save((err, changedGame) => {
            if(err) return next(err)
            res.json(game);
        })
    })
}