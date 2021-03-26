const empatyBoard = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
]

let token = localStorage.getItem('token');

if (token) {
    document.getElementById('choose').style.display = 'none';
    document.getElementById('gameBoard').style.display = 'block';
    fetch(`http://localhost:3000/game?token=${token}`, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(response => {
            let board = JSON.parse(JSON.stringify(empatyBoard));
            let history = response.history ? response.history.split(',') : [];
            for (let i = 0; i < history.length; i++) {
                board[history[i][0]][history[i][1]] = i % 2;
            }
            drowBoard(board, response.status)
        })
} else {
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById('choose').style.display = 'block';
}

function drowBoard(board, status) {
    const boardHtml = document.getElementsByClassName('tic');
    for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length; j++) {
            if (board[i][j] !== null) {
                boardHtml[i * 3 + j].innerHTML = board[i][j] == 1 ? 'O' : 'X';
            } else {
                boardHtml[i * 3 + j].innerHTML = '';
            }
        }
    }
    document.getElementById('message').innerHTML = status != 'onProccess' ? status : '';
}
function getNewGame(userChoice) {
    let forceEnd = false;
    if (document.getElementById('message').innerHTML == '') {
        forceEnd = true;
    }
    let token = localStorage.getItem('token')

    fetch(`http://localhost:3000/game`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            userChoice,
            token,
            forceEnd
        }),
    }).then(res => res.json())
        .then(response => {
            localStorage.setItem('token', response._id)
            let board = JSON.parse(JSON.stringify(empatyBoard));
            let history = response.history ? response.history.split(',') : [];
            for (let i = 0; i < history.length; i++) {
                board[history[i][0]][history[i][1]] = i % 2;
            }
            drowBoard(board, response.status)
            document.getElementById('gameBoard').style.display = 'block';
            document.getElementById('choose').style.display = 'none';
        })
}
document.getElementById('reset').addEventListener('click', () => {
    document.getElementById('gameBoard').style.display = 'none';
    document.getElementById('choose').style.display = 'block';
})
document.getElementById('playerX').addEventListener('click', () => {
    getNewGame(0)
})
document.getElementById('playerO').addEventListener('click', () => {
    getNewGame(1)
})
Array.from(document.getElementsByClassName('tic')).forEach(tic => {
    tic.addEventListener('click', (e) => {
        const status = document.getElementById('message').innerHTML
        if (e.currentTarget.innerHTML == '' && status == '') {
            let token = localStorage.getItem('token');
            fetch(`http://localhost:3000/game?token=${token}`, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    iIndex: e.currentTarget.getAttribute('data-I'),
                    jIndex: e.currentTarget.getAttribute('data-j')
                })

            })
                .then(res => res.json())
                .then(response => {
                    let board = JSON.parse(JSON.stringify(empatyBoard));
                    let history = response.history.split(',');
                    for (let i = 0; i < history.length; i++) {
                        board[history[i][0]][history[i][1]] = i % 2;
                    }
                    drowBoard(board, response.status)
                })
        }
    })
})

