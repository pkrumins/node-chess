var Board = require('./board');
var Hash = require('traverse/hash');

module.exports = MoveGenerator;
function MoveGenerator(board,state,square,kingCheck) {
    var piece = square.piece;
    if (!piece) return []; // no piece, no moves

    var generator = {
        'r' : RookMoves,
        'kn' : KnightMoves,
        'b' : BishopMoves,
        'q' : QueenMoves,
        'k' : KingMoves,
        'p' : PawnMoves
    };

    var possibleMoves = generator[piece.code]();

    if (kingCheck) {
        return filterKingInCheck(possibleMoves);
    }
    else {
        return possibleMoves;
    }

    function filterKingInCheck(moves) {
        var ret = [];

        moves.forEach(function (move) {
            // make the possible move, then check if the king is not attacked by
            // any of the opponent's pieces
            var include = true;
            var boardCopy = new Board(Hash.clone(board.pieces));
            var stateCopy = Hash(state).clone.end;
            boardCopy.move(piece.x,piece.y,move.x,move.y);
            stateCopy.moves.push({
                piece : piece,
                from : { x : square.x, y : square.y },
                to : { x : move.x, y : move.y }
            });

            var king; // find our king
            for (var x = 0; x < 8; x++) {
                if (king) break;
                for (var y = 0; y < 8; y++) {
                    var piece2 = boardCopy.pieceAt(x,y);
                    if (piece2 && piece2.color == piece.color && piece2.code == 'k') {
                        king = piece2;
                        break;
                    }
                }
            }

            for (var ii = 0; ii < 8; ii++) {
                if (!include) break;
                for (jj = 0; jj < 8; jj++) {
                    if (!include) break;
                    var piece2 = boardCopy.pieceAt(ii,jj);
                    if (piece2 && piece2.color != piece.color) { // opponents color
                        var opponentMoves = MoveGenerator(boardCopy,stateCopy,boardCopy.at(ii,jj),false);
                        opponentMoves.forEach(function (opponentMove) {
                            if (opponentMove.x == king.x && opponentMove.y == king.y) {
                                include = false;
                                return;
                            }
                        });
                    }
                }
            }
            if (include) ret.push(move);
        });

        return ret;
    }

    function MovesInDirection(direction) {
        var validMoves = [];

        for (pos = square[direction]; pos; pos = pos[direction]) {
            if (pos.empty()) {
                validMoves.push(pos);
            }
            else {
                if (pos.piece.color != piece.color) {
                    validMoves.push(pos);
                }
                break;
            }
        }

        return validMoves;
    }

    function RookMoves() {
        var validMoves = [];

        validMoves = validMoves.concat(MovesInDirection('e'));
        validMoves = validMoves.concat(MovesInDirection('w'));
        validMoves = validMoves.concat(MovesInDirection('s'));
        validMoves = validMoves.concat(MovesInDirection('n'));

        return validMoves;
    }

    function KnightMoves() {
        // 8 cases
        var case_1 = square.e && square.e.n && square.e.n.n;
        var case_2 = square.e && square.e.s && square.e.s.s;
        var case_3 = square.w && square.w.n && square.w.n.n;
        var case_4 = square.w && square.w.s && square.w.s.s;
        var case_5 = square.e && square.e.e && square.e.e.n;
        var case_6 = square.e && square.e.e && square.e.e.s;
        var case_7 = square.w && square.w.w && square.w.w.n;
        var case_8 = square.w && square.w.w && square.w.w.s;

        var validMoves = [];

        function MyPiece(sq) {
            return sq.piece && sq.piece.color == piece.color;
        }

        if (case_1 && !MyPiece(square.e.n.n)) validMoves.push(square.e.n.n);
        if (case_2 && !MyPiece(square.e.s.s)) validMoves.push(square.e.s.s);
        if (case_3 && !MyPiece(square.w.n.n)) validMoves.push(square.w.n.n);
        if (case_4 && !MyPiece(square.w.s.s)) validMoves.push(square.w.s.s);
        if (case_5 && !MyPiece(square.e.e.n)) validMoves.push(square.e.e.n);
        if (case_6 && !MyPiece(square.e.e.s)) validMoves.push(square.e.e.s);
        if (case_7 && !MyPiece(square.w.w.n)) validMoves.push(square.w.w.n);
        if (case_8 && !MyPiece(square.w.w.s)) validMoves.push(square.w.w.s);

        return validMoves;
    }

    function BishopMoves() {
        var validMoves = [];

        validMoves = validMoves.concat(MovesInDirection('ne'));
        validMoves = validMoves.concat(MovesInDirection('nw'));
        validMoves = validMoves.concat(MovesInDirection('se'));
        validMoves = validMoves.concat(MovesInDirection('sw'));

        return validMoves;
    }

    function QueenMoves() {
        var rookMoves = RookMoves();
        var bishopMoves = BishopMoves();
        var validMoves = [];
        for (var i = 0; i < rookMoves.length; i++) {
            validMoves.push(rookMoves[i]);
        }
        for (var i = 0; i < bishopMoves.length; i++) {
            validMoves.push(bishopMoves[i]);
        }
        return validMoves;
    }

    function KingMoveValid(direction) {
        var pos = square[direction];
        if (pos) {
            if (pos.empty()) {
                return true;
            }
            else {
                if (pos.piece.color != piece.color) {
                    return true;
                }
            }
        }
        return false;
    }

    function KingMoves() {
        var validMoves = [];

        if (KingMoveValid('e')) validMoves.push(square.e);
        if (KingMoveValid('w')) validMoves.push(square.w);
        if (KingMoveValid('n')) validMoves.push(square.n);
        if (KingMoveValid('s')) validMoves.push(square.s);
        if (KingMoveValid('ne')) validMoves.push(square.ne);
        if (KingMoveValid('nw')) validMoves.push(square.nw);
        if (KingMoveValid('se')) validMoves.push(square.se);
        if (KingMoveValid('sw')) validMoves.push(square.sw);

        // todo: castling short and long
        if (piece.color == 'w') {
            if (square.x == 4 && square.y == 0) {
                if (square.e.empty() && square.e.e.empty()) {
                    if (square.e.e.e.piece && square.e.e.e.piece.color == 'w' &&
                        square.e.e.e.piece.code == 'r' &&
                        !state.whiteKingMoved &&
                        !state.rookH1Moved)
                    {
                        validMoves.push(square.e.e);
                    }
                }
                if (square.w.empty() && square.w.w.empty() && square.w.w.w.empty()) {
                    if (square.w.w.w.w.piece && square.w.w.w.w.piece.color == 'w' &&
                        square.w.w.w.w.piece.code == 'r' &&
                        !state.whiteKingMoved &&
                        !state.rookA1Moved)
                    {
                        validMoves.push(square.w.w);
                    }
                }
            }
        }
        else {
            if (square.x == 4 && square.y == 7) {
                if (square.e.empty() && square.e.e.empty()) {
                    if (square.e.e.e.piece && square.e.e.e.piece.color == 'w' &&
                        square.e.e.e.piece.code == 'r' &&
                        !state.blackKingMoved &&
                        !state.rookH8Moved)
                    {
                        validMoves.push(square.e.e);
                    }
                }
                if (square.w.empty() && square.w.w.empty() && square.w.w.w.empty()) {
                    if (square.w.w.w.w.piece && square.w.w.w.w.piece.color == 'w' &&
                        square.w.w.w.w.piece.code == 'r' &&
                        !state.blackKingMoved &&
                        !state.rookA8Moved)
                    {
                        validMoves.push(square.w.w);
                    }
                }
            }
        }

        return validMoves;
    }

    function PawnMoves() {
        var validMoves = [];

        if (piece.color == 'w') {
            var canMove2 = square.y == 1 && square.n.empty() && square.n.n.empty();
            var canMove1 = square.y < 7 && square.n.empty();
            var canCaptureW = square.x > 1 && square.nw.piece && square.nw.piece.color == 'b';
            var canCaptureE = square.x < 7 && square.ne.piece && square.ne.piece.color == 'b';
        }
        else {
            var canMove2 = square.y == 6 && square.s.empty() && square.s.s.empty();
            var canMove1 = square.y > 0 && square.s.empty();
            var canCaptureW = square.x > 1 && square.sw.piece && square.sw.piece.color == 'w';
            var canCaptureE = square.x < 7 && square.se.piece && square.se.piece.color == 'w';
        }

        if (canMove1) {
            if (piece.color == 'w') {
                validMoves.push(square.n);
            }
            else {
                validMoves.push(square.s);
            }
        }

        if (canMove2) {
            if (piece.color == 'w') {
                validMoves.push(square.n.n);
            }
            else {
                validMoves.push(square.s.s);
            }
        }

        if (canCaptureW) {
            if (piece.color == 'w') {
                validMoves.push(square.nw);
            }
            else {
                validMoves.push(square.sw);
            }
        }

        if (canCaptureE) {
            if (piece.color == 'w') {
                validMoves.push(square.ne);
            }
            else {
                validMoves.push(square.se)
            }
        }

        // en-passant
        if (piece.color == 'w' && square.y == 4) {
            var lastMove = state.moves.slice(-1)[0];
            if (lastMove.piece.code == 'p' && lastMove.from.y == 6 &&
                lastMove.to.y == 4 &&
                (lastMove.from.x == piece.x-1 || lastMove.from.x == piece.x+1))
            {
                if (lastMove.from.x == piece.x-1) {
                    validMoves.push(square.nw);
                }
                else {
                    validMoves.push(square.ne);
                }
            }
        }

        if (piece.color == 'b' && square.y == 3) {
            var lastMove = state.moves.slice(-1)[0];
            if (lastMove.piece.code == 'p' && lastMove.from.y == 1 &&
                lastMove.to.y == 3 &&
                (lastMove.from.x == piece.x-1 || lastmove.from.x == piece.x+1))
            {
                if (lastMove.from.x == piece.x-1) {
                    validMoves.push(square.sw);
                }
                else {
                    validMoves.push(square.se);
                }
            }
        }

        return validMoves;
    }
};

