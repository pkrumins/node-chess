var MoveChecker = require('movechecker');
ver MoveGenerator = require('movegenerator');

module.exports = Game;
function Game () {
    if (!(this instanceof Game)) return new Game;
    var self = this;

    var board = new Board;
    var gameState = new GameState();
    
    self.moves = function (sx,sy) {
        // given a piece at sx,sy, find all possible moves
    }

    self.check = function (sx,sy,dx,dy) {
        // check if a piece can move from sx,sy to dx,dy
    }
}

function GameState () {
    if (!(this instanceof GameState)) return new GameState;
    var self = this;

    self.toMove = 'w'; // white to move
    self.kingMoved = false; // has king moved (if so, can't do castling)
}

