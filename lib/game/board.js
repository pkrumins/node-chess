var EventEmitter = require('events').EventEmitter;

var Square = require('./square');

module.exports = Board;
Board.prototype = new EventEmitter;
function Board (usePieces) {
    var self = this;
    
    self.initialize = function () {
        function row(y, color, ps) {
            return ps.map(function (p, x) {
                return p ? {
                    x : x,
                    y : y,
                    color : color,
                    code : p
                } : null;
            });
        }
        
        self.withPieces([].concat(
            row(7, 'b', ['r', 'kn', 'b', 'q', 'k', 'b', 'kn', 'r']),
            row(6, 'b', ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p']),
            row(1, 'w', ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p']),
            row(0, 'w', ['r', 'kn', 'b', 'q', 'k', 'b', 'kn', 'r'])
        ));
        
        return self;
    };
    
    self.withPieces = function (pieces) {
        self.squares = emptySquares();
        
        pieces.forEach(function (p) {
            self.squares[p.x][p.y].piece = p;
        });
    };
    
    if (usePieces) {
        self.withPieces(usePieces);
    }
    else {
        self.initialize();
    }
    
    self.at = function (x,y) { // return the square at x,y
        return self.squares[x][y];
    }
    
    self.empty = function (x,y) { // is the square at x,y empty?
        return self.at(x,y).empty();
    };
    
    self.pieceAt = function (x,y) { // piece at x,y
        return self.at(x,y).piece;
    };
     
    self.__defineGetter__('pieces', function () {
        var ps = [];
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                var piece = self.pieceAt(x,y);
                if (piece) ps.push(piece);
            }
        }
        return ps;
    });
    
    self.move = function (sx,sy,dx,dy,choice) {
        var src = self.at(sx,sy);
        var dst = self.at(dx,dy);

        if (src.empty()) return;
        if (src.x == dst.x && src.y == dst.y) return;

        var enpassant = false;

        if (src.piece.color == 'w' && src.piece.code == 'p' // white pawn
            && sy == 4 && sx != dx // on 5th row
            && dx != dy // capture
            && dst.empty()) // capture empty square
        {
            enpassant = true;
        }
        if (src.piece.color == 'b' && src.piece.code == 'p' // white pawn
            && sy == 3 && sx != dx // on 5th row
            && dx != dy // capture
            && dst.empty()) // capture empty square
        {
            enpassant = true;
        }

        src.piece.x = sx;
        src.piece.y = sy;
        dst.piece = src.piece;
        dst.piece.x = dx;
        dst.piece.y = dy;
        
        self.at(sx,sy).clear();

        if (choice) {
            dst.piece.code = choice; // pawn promotion
        }

        if (enpassant) {
            self.at(dx,sy).clear();
            self.emit('enpassant',dx,sy);
        }
        
        self.emit('move', sx, sy, dx, dy, choice);
    };
}

function emptySquares () {
    var squares = [];
    
    for (var x = 0; x < 8; x ++) {
        squares[x] = [];
        for (var y = 0; y < 8; y++) {
            squares[x][y] = new Square(x, y, null);
        }
    }
    
    for (var x = 0; x < 8; x++) {
        for (var y = 0; y < 8; y++) {
            if (y != 0) {
                squares[x][y].s = squares[x][y-1];
                if (x != 0)
                    squares[x][y].sw = squares[x-1][y-1];
                if (x != 7)
                    squares[x][y].se = squares[x+1][y-1];
            }
            if (y != 7) {
                squares[x][y].n = squares[x][y+1];
                if (x != 0)
                    squares[x][y].nw = squares[x-1][y+1];
                if (x != 7)
                    squares[x][y].ne = squares[x+1][y+1];
            }
            if (x != 0) {
                squares[x][y].w = squares[x-1][y];
            }
            if (x != 7)
                squares[x][y].e = squares[x+1][y];
        }
    }
    
    return squares;
}

