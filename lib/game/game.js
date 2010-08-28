var MoveChecker = require('movechecker');
var MoveGenerator = require('movegenerator');

module.exports = Game;
function Game () {
    if (!(this instanceof Game)) return new Game;
    var self = this;

    var board = new Board;
    var state = new GameState();
    
    self.moves = function (sx,sy) {
        // given a piece at sx,sy, find all possible moves
        return MoveGenerator(board,state,sx,sy);
    }

    self.check = function (sx,sy,dx,dy) {
        // check if a piece can move from sx,sy to dx,dy
        var moves = self.moves(sx,sy);
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
    self.lastMove = null; // last move
}

