const gameController = require('../controllers/game.controller')

module.exports = function (app){
    app.route('/game')
        .get(gameController.getGame)
        .post(gameController.createNewGame)
        .put(gameController.userTurn)
}