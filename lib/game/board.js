var Square = require('square');
var Piece = require('piece');
var MoveChecker = require('movechecker');
var MoveGenerator = require('movegenerator');

function WP (type) { // White Piece
    return new Piece(type, 'white');
}

function BP (type) { // Black Piece
    return new Piece(type, 'black');
}

module.exports = Board;
function Board (useBoard) {
    var self = this;

    self.board = useBoard ? useBoard : initBoard();

    function initBoard() {
        var x = 0, y = 0;
        function S (piece) {
            var square = new Square(x++, y, piece);
            if (x == 7) {
                x = 0;
                y++;
            }
        }

        function SWP (piece) { // Square with White Piece
            return S(WP(piece));
        }

        function SBP (piece) { // Square with Black Piece
            return S(BP(piece));
        }

        var white_pieces = [
            SWP('r'), SWP('kn'), SWP('b'), SWP('q'), SWP('k'), SWP('b'), SWP('kn'), SWP('r')
        ];
        var white_pawns = [
            SWP('p'), SWP('p'), SWP('p'), SWP('p'), SWP('p'), SWP('p'), SWP('p'), SWP('p')
        ];
        var empty_row_2 = [
            S(null), S(null), S(null), S(null), S(null), S(null), S(null), S(null)
        ];
        var empty_row_3 = [
            S(null), S(null), S(null), S(null), S(null), S(null), S(null), S(null)
        ];
        var empty_row_4 = [
            S(null), S(null), S(null), S(null), S(null), S(null), S(null), S(null)
        ];
        var empty_row_5 = [
            S(null), S(null), S(null), S(null), S(null), S(null), S(null), S(null)
        ];
        var black_pieces = [
            SBP('r'), SBP('kn'), SBP('b'), SBP('q'), SBP('k'), SBP('b'), SBP('kn'), SBP('r')
        ];
        var black_pawns = [
            SBP('p'), SBP('p'), SBP('p'), SBP('p'), SBP('p'), SBP('p'), SBP('p'), SBP('p')
        ];
        var board = [
            white_pieces,
            white_pawns,
            empty_row_2,
            empty_row_3,
            empty_row_4,
            empty_row_5,
            black_pawns,
            black_pieces,
        ];
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (j != 0)
                    board[i][j].w = board[i][j-1];
                if (j != 7)
                    board[i][j].e = board[i][j+1];
                if (i != 0)
                    board[i][j].s = board[i-1][j];
                if (i != 7)
                    board[i][j].n = board[i+1][j];
            }
        }
        return board;
    }

    function at(x,y) {
        return self.board[x][y];
    }

    self.empty = function (x,y) { // is the square at x,y empty?
        return at(x,y).empty();
    }

    self.pieceAt = function (x,y) { // piece at x,y
        return at(x,y).piece;
    }
 
    self.eachPiece = function (cb) {
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                var piece = self.pieceAt(x,y);
                if (piece) {
                    cb({
                        x : x,
                        y : y,
                        piece : piece
                    });
                }
            }
        }
    };

    self.move = function (sx,sy,dx,dy) {
        self.at(dx,dy).piece = self.at(sx,sy).piece;
        self.at(sx,sy).clear();
    }

    self.check = function (sx,sy,dx,dy) {
        return MoveChecker(self,sx,sy,dx,dy);
    }

    self.moves = function (x,y) {
        // given a piece at position x,y, find all the moves that it can make
        return MoveGenerator(self,sx,sy);
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

