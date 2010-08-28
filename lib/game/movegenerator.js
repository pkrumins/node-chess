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

    function MovesInDirection(direction) {
        var validMoves = [];

        for (pos = square[direction]; pos; pos = pos[direction]) {
            if (pos.empty()) {
                validMoves.push(pos);
            }
            else {
                if (pos.piece.color != piece.color) {
                    validMoves.push(pos);
                    break;
                }
            }
        }

        return validMoves;
    }

    function RookMoves() {
        var validMoves = [];

        validMoves.concat(MovesInDirection('e'));
        validMoves.concat(MovesInDirection('w'));
        validMoves.concat(MovesInDirection('s'));
        validMoves.concat(MovesInDirection('n'));

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
        var case_7 = square.w && sqaure.w.w && square.w.w.n;
        var case_8 = square.w && sqaure.w.w && square.w.w.s;

        var validMoves = [];

        if (case_1) validMoves.push(square.e.n.n);
        if (case_2) validMoves.push(square.e.s.s);
        if (case_3) validMoves.push(square.w.n.n);
        if (case_4) validMoves.push(square.w.s.s);
        if (case_5) validMoves.push(square.e.e.n);
        if (case_6) validMoves.push(square.e.e.s);
        if (case_7) validMoves.push(square.w.w.n);
        if (case_8) validMoves.push(square.w.w.s);

        return validMoves;
    }

    function BishopMoves() {
        var validMoves = [];

        validMoves.concat(MovesInDirection('ne'));
        validMoves.concat(MovesInDirection('nw'));
        validMoves.concat(MovesInDirection('se'));
        validMoves.concat(MovesInDirection('sw'));

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

    function KingInChess(/*???*/) {
        return false; // todo
    }

    function KingMoveValid(direction) {
        var pos = square[direction];
        if (pos) {
            if (pos.empty()) {
                if (!KingInChess(pos)) {
                    return true;
                }
            }
            else {
                if (pos.piece.color != piece.color) {
                    if (!KingInChess(pos)) {
                        return true;
                    }
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
            var lastMove = state.moves.slice(-1);
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
            var lastMove = state.moves.slice(-1);
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

