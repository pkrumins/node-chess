var Board = require('./board');
var Player = require('./player');
var MoveGenerator = require('./movegenerator');

var RemoteEmitter = require('dnode/events');

module.exports = Game;
Game.prototype = new RemoteEmitter;
function Game () {
    if (!(this instanceof Game)) return new Game;
    var self = this;
    
    var state = new GameState;
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
            
            if (self.players.white == null && self.players.black == null) {
                self.emit('end');
            }
        });
        
        self.emit('join', { name : name, color : color });
        
        return player;
    };
}

function GameState () {
    if (!(this instanceof GameState)) return new GameState;
    var self = this;
    
    self.toMove = 'w'; // white to move
    self.kingMoved = false; // has king moved (if so, can't do castling)
    self.moves = []; // keep track of the game moves
}

