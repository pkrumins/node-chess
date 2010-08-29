var Board = require('./board');
var Player = require('./player');
var MoveGenerator = require('./movegenerator');
var EventEmitter = require('events').EventEmitter;

module.exports = Game;
Game.prototype = new EventEmitter;
function Game () {
    if (!(this instanceof Game)) return new Game;
    var self = this;
    
    self.state = new GameState;
    self.board = new Board;
    
    self.pass = function (name, em) {
        em.on(name, function () {
            var args = [].slice.call(arguments);
            args.unshift(name);
            self.emit.apply(self, args);
        });
    };
    
    self.pass('move', self.board);
    
    self.players = {
        white : null,
        black : null
    };
    
    self.join = function (name, color) {
        var player = new Player({
            color : color,
            game : self,
            name : name
        });
        self.players[color] = player;
        player.on('quit', function () {
            self.emit('part', {
                name : name,
                color : color
            });
            
            self.players[color] = null;
            
            if (!self.players.white && !self.players.black) {
                self.emit('end');
            }
        });
        
        self.emit('join', { name : name, color : color });
        
        return player;
    };
}

Game.GameState = GameState;
function GameState () {
    if (!(this instanceof GameState)) return new GameState;
    var self = this;
    
    self.toMove = 'w'; // white to move
    self.whiteKingMoved = false; // has white king moved (if so, white can't do castling)
    self.blackKingMoved = false; // has black king moved (if so, black can't do castling)
    self.rookA1Moved = false; // has rook on A1 moved (if so, white can't do long castling)
    self.rookH1Moved = false; // has rook on H1 moved (if so, white can't do short castling)
    self.rookA8Moved = false; // has rook on A8 moved (if so, black can't do long castling)
    self.rookH8Moved = false; // has rook on H8 moved (if so, black can't do short castling)
    self.moves = []; // keep track of the game moves

    self.newMove = function (piece, sx, sy, dx, dy) {
        self.moves.push({
            piece : piece,
            from : { x : sx, y : sy },
            to : { x : dx, y : dy }
        });
    };
}

