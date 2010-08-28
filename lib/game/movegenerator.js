module.exports = MoveGenerator;
function MoveGenerator(board,sx,sy) {
    var piece = board.pieceAt(sx,sy);
    if (!piece) return [];

    var generator = {
        'r' : RookMoves,
        'kn' : KnightMoves,
        'b' : BishopMoves,
        'q' : QueenMoves,
        'k' : KingMoves,
        'p' : PawnMoves
    };

    generator[piece.pieceName]();

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

    }
};

