module.exports = MoveGenerator;
function MoveGenerator(state,square) {
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

    var moves = generator[piece.code]();
    return moves; // for now, todo: kingInCheck

    function RookMoves() {

    }

    function KnightMoves() {

    }

    function BishopMoves() {

    }

    function QueenMoves() {

    }

    function KingMoves() {

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
            var lastMove = state.moves.slice(-1);
            if (lastMove.piece.code == 'p' && lastMove.from.y == 6 &&
                lastMove.to.y == 4 &&
                (lastMove.from.x == piece.x-1 || lastMove.from.x == piece.x+1))
            {
                if (lastMove.from.x == piece.x-1) {
                    validMoves.push(squares.nw);
                }
                else {
                    validMoves.push(squares.ne);
                }
            }

        }

        if (piece.color == 'b' && square.y == 3) {
            var lastMove = state.moves.slice(-1);
            if (lastMove.piece.code == 'p' && lastMove.from.y == 1 &&
                lastMove.to.y == 3 &&
                (lastMove.from.x == piece.x-1 || lastmove.from.x == piece.x+1))
            {
                if (lastMove.from.x == piece.x-1) {
                    validMoves.push(squares.sw);
                }
                else {
                    validMoves.push(squares.se);
                }
            }
        }

        return validMoves;
    }
};

