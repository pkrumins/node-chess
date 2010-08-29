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
    
    // test testy testing:
    var toggle = true;
    setInterval(function () {
        if (toggle) {
            self.board.move(1, 0, 2, 2);
        }
        else {
            self.board.move(2, 2, 1, 0);
        }
        toggle = !toggle;
        console.log(toggle);
    }, 1000);
    
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
        player.on('part', function () {
            self.emit('parted', {
                name : player.name,
                color : player.color
            });
            self.players[color] = null;
            if (self.players.white == null
            && self.players.black == null)
                self.emit('end');
        });
        return player;
    };
}

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
}

