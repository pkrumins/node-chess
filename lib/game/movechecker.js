module.exports = MoveChecker;
function MoveChecker(board,sx,sy,dx,dy) {
    if (sx < 0 || sy < 0 || sx > 7 || sy > 7 || // can't move outside the board
        dx < 0 || dy < 0 || dx > 7 || dy > 7)
    {
        return false;
    }
    if (sx == dx && sy == dy) // not a move, src and dst match
        return false;

    var srcPiece = board.pieceAt(sx,sy);
    if (srcPiece == null) return false; // can't move the empty square

    var dstPiece = board.pieceAt(dx,dy);
    if (srcPiece.color == dstPiece.color) return false; // can't move into your own pieces

    return MoveCheckers[srcPiece.code](board,sx,sy,dx,dy);
};

var MoveCheckers = {
    'r' : RookMove,
    'kn' : KnightMove,
    'b' : BishopMove,
    'q' : QueenMove,
    'k' : KingMove,
    'p' : PawnMove,
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
    if (Math.abs(dy-sy) > 2) return false; // pawns can't move more than 2 squares forward
    if (Math.abs(dy-sy) == 2) { // only on the first move can they move 2 squares forward
        var piece = board.pieceAt(sx,sy);
        if (piece.color == 'b') {
            if (sx != 6) return false; // black piece not on 7th row
        }
        else {
            if (sx != 1) return false; // white piece not on 2nd row
        }
        // and they can only move 2 squares forward on the same column
        if (sx != dx) return false;
        // and they can only move 2 squares forward if there is nothing in between the move
        if (InBetweenCol(board,sx,sy,dy)) return false;
        // and if there is nothing on the final square
        if (board.pieceAt(dx,dy).piece) return false;
        // and it's a forward move
        if (!ForwardMove(board,sx,sy,dx,dy)) return false;
        return true;
    }

    // |dy-sy| is 1 here

    // now, they can also move one square forward
    if (sx == dx) {
        if (board.pieceAt(dx,dy).code) return false; // can't move into other pieces
        if (!ForwardMove(board,sx,sy,dx,dy)) return false;
        return true;
    }

    if (Math.abs(dx-sx)>1) return false; // can't move sideways by more than 1 column
    
    // |dx-sx| is also 1 here
    
    if (!ForwardMove(board,sx,sy,dx,dy)) return false;

    // todo: en-passant, king in check, king in mate, bah.

    return true;
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
        if (!board.empty(i,row)) return false;
    }
    return true;
}

// is it a forward move (meaning did row increase)
function ForwardMove(board,sx,sy,dx,dy) {
    var piece = board.pieceAt(sx,sy);
    if (piece.color == 'w') { // white piece
        return dy > sy;
    }
    // black piece
    return dy < sy;
}

