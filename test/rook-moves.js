var Board = require('../lib/game/board');
var MoveGenerator = require('../lib/game/movegenerator');

var b = new Board;
b.move(0,0,3,3);

function newState() {
    return {
        moves : []
    };
}

module.exports = {
    'all-rook-moves' : function (assert) {
        moves = MoveGenerator(b, newState(), b.at(3,3), true);
        assert.equal(moves.length, 11);

        var ok = 0;
        moves.forEach(function (move) {
            if (move.x == 3 && move.y == 2) ok++;
            if (move.x == 3 && move.y == 4) ok++;
            if (move.x == 3 && move.y == 5) ok++;
            if (move.x == 3 && move.y == 6) ok++;
            if (move.x == 2 && move.y == 3) ok++;
            if (move.x == 1 && move.y == 3) ok++;
            if (move.x == 0 && move.y == 3) ok++;
            if (move.x == 4 && move.y == 3) ok++;
            if (move.x == 5 && move.y == 3) ok++;
            if (move.x == 6 && move.y == 3) ok++;
            if (move.x == 7 && move.y == 3) ok++;
        });

        assert.equal(ok, 11);

    },
    'no-rook-moves' : function (assert) {
        var nomoves = MoveGenerator(b, newState(), b.at(7,0), true);
        assert.equal(nomoves.length, 0);
    }
};

