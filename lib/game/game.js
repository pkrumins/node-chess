var Board = require('./board');
var MoveChecker = require('./movechecker');
var MoveGenerator = require('./movegenerator');

module.exports = Game;
function Game () {
    if (!(this instanceof Game)) return new Game;
    var self = this;

    var state = new GameState;
    self.board = new Board;
 
    self.moves = function (square) {
        // given a square, find all moves the piece on it can make
        return MoveGenerator(board,state,square);
    }

    self.check = function (srcSquare, dstSquare) {
        // check if a piece on srcSquare can move to dstSquare
        var moves = self.moves(srcSquare);
        for (var i = 0; i < moves.length; i++) {
            if (moves[i].x == dx && moves[i].y == dy) return true;
        }
        return false;
    }
}

function GameState () {
    if (!(this instanceof GameState)) return new GameState;
    var self = this;

    self.toMove = 'w'; // white to move
    self.kingMoved = false; // has king moved (if so, can't do castling)
    self.kingInCheck = false; // king in check right now
    self.moves = []; // keep track of the game moves
}

