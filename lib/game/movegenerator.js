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
            var canMove2 = square.x == 1 && square.n.empty() && square.n.n.empty();
            var canMove1 = square.x < 7 && square.n.empty();
        }
        else {
            var canMove2 = square.x == 6 && square.s.empty() && square.s.s.empty();
            var canMove1 = square.x > 0 && square.s.empty();
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
                moves.push(square.s);
            }
        }

        return moves;
    }
};

