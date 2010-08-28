var Piece = require('piece');
var MoveChecker = require('movechecker');

function WP (type) { // White Piece
    return new Piece(type, 'white');
}

function BP (type) { // Black Piece
    return new Piece(type, 'black');
}

module.exports = Board;
function Board () {
    var self = this;

    self.board = initBoard();

    function initBoard() {
        var white_pieces = [
            WP('r'), WP('kn'), WP('b'), WP('q'), WP('k'), WP('b'), WP('kn'), WP('r')
        ];
        var white_pawns = [
            WP('p'), WP('p'), WP('p'), WP('p'), WP('p'), WP('p'), WP('p'), WP('p')
        ];
        var black_pieces = [
            BP('r'), BP('kn'), BP('b'), BP('q'), BP('k'), BP('b'), BP('kn'), BP('r')
        ];
        var black_pawns = [
            BP('p'), BP('p'), BP('p'), BP('p'), BP('p'), BP('p'), BP('p'), BP('p')
        ];
        var empty_squares = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        var board = [
            white_pieces,
            white_pawns,
            empty_squares.slice(), // slice for deep-copy
            empty_squares.slice(),
            empty_squares.slice(),
            empty_squares.slice(),
            black_pawns,
            black_pieces,
        ];
        return board;
    }

    function at(x,y) {
        return self.board[x][y];
    }

    self.empty = function (x,y) { // is the square at x,y empty?
        return at(x,y) == ' ';
    }

    self.pieceAt = function (x,y) { // piece at x,y
        if (self.empty(x,y)) return null;
        return at(x,y);
    }

    self.move = function (sx,sy,dx,dy) {
        self.board[dx][dy] = self.board[sx][sy];
        self.board[sx][sy] = ' ';
    }

    self.check = function (sx,sy,dx,dy) {
        return MoveChecker(self,sx,sy,dx,dy);
    }

    self.print = function (from) {
        function printFromWhite() {
            process.stdout.write('.---.---.---.---.---.---.---.---.\n');
            for (var i = 7; i >= 0; i--) {
                for (var j = 0; j <= 7; j++) {
                    process.stdout.write('|');
                    var piece = self.pieceAt(i,j);
                    var pieceName = piece ? piece.shortName : ' ';
                    process.stdout.write(pieceName);
                    if (pieceName.length == 1)
                        process.stdout.write('  ');
                    else if (pieceName.length == 2)
                        process.stdout.write(' ');
                }
                process.stdout.write('|');
                process.stdout.write('\n');

                i != 0 && process.stdout.write('|---+---+---+---+---+---+---+---|\n');
            }
            console.log("'---'---'---'---'---'---'---'---'\n");
        }

        // the only two lines changing in this function is the loop order
        // no time to abstract it in one function atm
        function printFromBlack() {
            process.stdout.write('.---.---.---.---.---.---.---.---.\n');
            for (var i = 0; i <= 7; i++) {
                for (var j = 7; j >= 0; j--) {
                    process.stdout.write('|');
                    var piece = self.pieceAt(i,j);
                    var pieceName = piece ? piece.shortName : ' ';
                    process.stdout.write(pieceName);
                    if (pieceName.length == 1)
                        process.stdout.write('  ');
                    else if (pieceName.length == 2)
                        process.stdout.write(' ');
                }
                process.stdout.write('|');
                process.stdout.write('\n');

                i != 7 && process.stdout.write('|---+---+---+---+---+---+---+---|\n');
            }
            console.log("'---'---'---'---'---'---'---'---'\n");
        }
        from == 'black' ? printFromBlack() : printFromWhite();
    }
};

