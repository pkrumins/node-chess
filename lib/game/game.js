var Board = require('./board');

module.exports = Game;
function Game () {
    var self = this;
    self.board = new Board;
}

