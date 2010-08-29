// expose this to the player over dnode

var RemoteEmitter = require('dnode/events');
var MoveGenerator = require('./movegenerator');

module.exports = Player;
Player.prototype = new RemoteEmitter;
function Player (params) {
    var self = this;
    self.name = params.name;
    self.color = params.color;
    var game = params.game;
     
    self.pieces = function (cb) {
        cb(game.board.pieces);
    };
     
    self.moves = function (square) {
        // given a square, find all moves the piece on it can make
        return MoveGenerator(game.board, state, square, true);
    };
    
    self.canMove = function (srcSq, dstSq) {
        // check if a piece on srcSq can move to dstSq
        return self.moves(srcSq).some(function (move) {
            return move.x == dstSq.x && move.y == dstSq.y;
        });
    };
    
    self.quit = function () {
        game.part(color);
    };
}

