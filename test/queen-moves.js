var Board = require('../lib/game/board');
var MoveGenerator = require('../lib/game/movegenerator');

var b = new Board;
b.move(3,0,4,4);

function newState() {
    return {
        moves : []
    };
}

module.exports = {
    'all-queen-moves' : function (assert) {
        moves = MoveGenerator(b, newState(), b.at(4,4), true);
        assert.equal(moves.length, 19);

        var ok = 0;
        moves.forEach(function (move) {
            // queen has all the bishop moves
            if (move.x == 3 && move.y == 5) ok++;
            if (move.x == 2 && move.y == 6) ok++;
            if (move.x == 5 && move.y == 5) ok++;
            if (move.x == 6 && move.y == 6) ok++;
            if (move.x == 3 && move.y == 3) ok++;
            if (move.x == 2 && move.y == 2) ok++;
            if (move.x == 5 && move.y == 3) ok++;
            if (move.x == 6 && move.y == 2) ok++;

            // and all the rook moves
            if (move.x == 0 && move.y == 4) ok++;
            if (move.x == 1 && move.y == 4) ok++;
            if (move.x == 2 && move.y == 4) ok++;
            if (move.x == 3 && move.y == 4) ok++;
            if (move.x == 5 && move.y == 4) ok++;
            if (move.x == 6 && move.y == 4) ok++;
            if (move.x == 7 && move.y == 4) ok++;
            if (move.x == 4 && move.y == 6) ok++;
            if (move.x == 4 && move.y == 5) ok++;
            if (move.x == 4 && move.y == 3) ok++;
            if (move.x == 4 && move.y == 2) ok++;
        });

        assert.equal(ok, 19);

    },
    'no-queen-moves' : function (assert) {
        b.move(4,4,3,0);
        var nomoves = MoveGenerator(b, newState(), b.at(3,0), true);
        assert.equal(nomoves.length, 0);
    }
};

