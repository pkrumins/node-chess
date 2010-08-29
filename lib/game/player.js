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
     
    self.moves = function (x,y) {
        // given a square, find all moves the piece on it can make
        return MoveGenerator(game.board, {}, game.board.at(x,y), true);
    };
    
    self.canMove = function (sx,sy,dx,dy) {
        // check if a piece on srcSq can move to dstSq
        return self.moves(sx,sy).some(function (move) {
            return move.x == dx && move.y == dy;
        });
    };
    
    self.quit = function () {
        game.part(color);
    };
}

