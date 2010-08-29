var Board = require('../lib/game/board');
var MoveGenerator = require('../lib/game/movegenerator');

var b = new Board;
b.move(2,0,4,4);

function newState() {
    return {
        moves : []
    };
}

module.exports = {
    'all-bishop-moves' : function (assert) {
        moves = MoveGenerator(b, newState(), b.at(4,4), true);
        assert.equal(moves.length, 8);

        var ok = 0;
        moves.forEach(function (move) {
            if (move.x == 3 && move.y == 5) ok++;
            if (move.x == 2 && move.y == 6) ok++;
            if (move.x == 5 && move.y == 5) ok++;
            if (move.x == 6 && move.y == 6) ok++;
            if (move.x == 3 && move.y == 3) ok++;
            if (move.x == 2 && move.y == 2) ok++;
            if (move.x == 5 && move.y == 3) ok++;
            if (move.x == 6 && move.y == 2) ok++;
        });

        assert.equal(ok, 8);
    },
    'no-bishop-moves' : function (assert) {
        var nomoves = MoveGenerator(b, newState(), b.at(5,0), true);
        assert.equal(nomoves.length, 0);
    }
};

