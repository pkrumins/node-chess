module.exports = MoveChecker;
function MoveChecker(board,sx,sy,dx,dy) {
    if (sx < 0 || sy < 0 || sx > 7 || sy > 7 ||
        dx < 0 || dy < 0 || dx > 7 || dy > 7)
    {
        return false;
    }
    var srcPiece = board.pieceAt(sx,sy);
    if (srcPiece.piece == null) return false; // empty square
    var dstPiece = board.pieceAt(dx,dy);
    if (srcPiece.color == dstPiece.color) return false; // can't capture your own pieces
    var checkers = {
        'r' : RookMove,
        'kn' : KnightMove,
        'b' : BishopMove,
        'q' : QueenMove,
        'k' : KingMove,
        'p' : PawnMove,
    }
    return checkers[srcPiece.piece](board,srcPiece,dstPiece,sx,sy,dx,dy);
};

function RookMove(board,sx,sy,dx,dy) {

}

function KnightMove(board,sx,sy,dx,dy) {

}

function BishopMove(board,sx,sy,dx,dy) {

}

function QueenMove(board,sx,sy,dx,dy) {

}

function KingMove(board,sx,sy,dx,dy) {

}

function PawnMove(board,sx,sy,dx,dy) {

}

// determine if there is a piece between two squares on a given column
function InBetweenCol(board,col,sy,dy) {
    var start = Math.min(sy,dy);
    var end = Math.max(sy,dy);
    for (var i = start+1; i < end; i++) {
        if (!board.empty(col,i)) return false;
    }
    return true;
}

// determine if there is a piece between two squares on a given row
function InBetweenRow(board,row,sx,dx) {
    var start = Math.min(sx,dx);
    var end = Math.max(sx,dx);
    for (var i = start+1; i < end; i++) {
        if (board.empty(i,row)) return false
    }
    return true;
}

