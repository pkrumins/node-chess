module.exports = Board;
function Board () {
    var self = this;

    self.board = initBoard();

    function initBoard() {
        var white_pieces = ['wr', 'wkn', 'wb', 'wq', 'wk', 'wb', 'wkn', 'wr'];
        var white_pawns = ['wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp', 'wp'];
        var black_pieces = ['br', 'bkn', 'bb', 'bq', 'bk', 'bb', 'bkn', 'br'];
        var black_pawns = ['bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp', 'bp'];
        var empty_squares = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
        var board = [
            white_pieces,
            white_pawns,
            empty_squares.slice(),
            empty_squares.slice(),
            empty_squares.slice(),
            empty_squares.slice(),
            black_pawns,
            black_pieces,
        ];
        return board;
    }

    self.at = function (x,y) {
        return self.board[x][y];
    }

    self.move = function (sx,sy,dx,dy) {
        self.board[dx][dy] = self.board[sx][sy];
        self.board[sx][sy] = ' ';
    }

    self.print = function (from) {
        function printFromWhite() {
            process.stdout.write('.---.---.---.---.---.---.---.---.\n');
            for (var i = 7; i >= 0; i--) {
                for (var j = 0; j <= 7; j++) {
                    process.stdout.write('|');
                    var piece = self.at(i,j);
                    process.stdout.write(piece);
                    if (piece.length == 1)
                        process.stdout.write('  ');
                    else if (piece.length == 2)
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
                    var piece = self.at(i,j);
                    process.stdout.write(piece);
                    if (piece.length == 1)
                        process.stdout.write('  ');
                    else if (piece.length == 2)
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

