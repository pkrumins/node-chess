module.exports = MoveChecker;
function MoveChecker(board, sx,sy,dx,dy) {
    if (board.at(sx,sy) == ' ') return false;
    var checkers = {
        'r' : RookMove,
        'kn' : KnightMove,
        'b' : BishopMove,
        'q' : QueenMove,
        'k' : KingMove,
        'p' : PawnMove
    }
    return checkers[board.pieceAt(sx,dy)](board, sx,sy,dx,dy);
};

function RookMove(board, sx,sy,dx,dy) {

}

function KnightMove(board, sx,sy,dx,dy) {

}

function BishopMove(board, sx,sy,dx,dy) {

}

function QueenMove(board, sx,sy,dx,dy) {

}

function KingMove(board, sx,sy,dx,dy) {

}

function PawnMove(board, sx,sy,dx,dy) {

}

