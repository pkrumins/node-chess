var Square = require('square.js');

module.exports = MoveGenerator;
function MoveGenerator(board,state,square) {
    if (!square.piece) return []; // no piece, no moves

    var generator = {
        'r' : RookMoves,
        'kn' : KnightMoves,
        'b' : BishopMoves,
        'q' : QueenMoves,
        'k' : KingMoves,
        'p' : PawnMoves
    };

    var moves = generator[piece.name]();
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
        var moves = [];

        if (state.toMove == 'w') {
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
            if (state.toMove == 'w') {
                moves.push(square.n);
            }
            else {
                moves.push(square.s);
            }
        }

        if (canMove2) {
            if (state.toMove == 'w') {
                moves.push(square.n.n);
            }
            else {
                moves.push(square.s.s);
            }
        }

        if (canCaptureW) {
            if (state.toMove == 'w') {
                moves.push(square.nw);
            }
            else {
                moves.push(square.sw);
            }
        }

        if (canCaptureE) {
            if (state.toMove == 'w') {
                moves.push(square.ne);
            }
            else {
                moves.push(square.se)
            }
        }

        return moves;
    }
};

