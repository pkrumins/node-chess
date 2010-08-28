var Square = require('square');
var MoveChecker = require('movechecker');
var MoveGenerator = require('movegenerator');

module.exports = Board;
function Board (useBoard) {
    var self = this;

    self.board = useBoard ? useBoard : initBoard();

    function initBoard() {
        var y = 0;
        function Row (color, pieces) {
            var x = 0;
            var row = [];
            for (var i = 0; i < pieces.length; i++) {
                var piece = pieces[i] == '' ? null : { color : color, name : pieces[i] };
                row.push(new Square(x, y, piece));
                x++;
            }
            y++;
            return row;
        }

        var board = [
            Row('w', ['r', 'kn', 'b', 'q', 'k', 'b', 'kn', 'r']),
            Row('w', ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p']),
            Row(null, ['', '', '', '', '', '', '', '']),
            Row(null, ['', '', '', '', '', '', '', '']),
            Row(null, ['', '', '', '', '', '', '', '']),
            Row(null, ['', '', '', '', '', '', '', '']),
            Row('b', ['r', 'kn', 'b', 'q', 'k', 'b', 'kn', 'r']),
            Row('b', ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'])
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

