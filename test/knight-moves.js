var Board = require('../lib/game/board');
var MoveGenerator = require('../lib/game/movegenerator');

var b = new Board;
b.move(1,0,4,4);

function newState() {
    return {
        moves : []
    };
}

module.exports = {
    'all-knight-moves' : function (assert) {
        moves = MoveGenerator(b, newState(), b.at(4,4), true);
        assert.equal(moves.length, 8);

        var ok = 0;
        moves.forEach(function (move) {
            if (move.x == 3 && move.y == 6) ok++;
            if (move.x == 5 && move.y == 6) ok++;
            if (move.x == 2 && move.y == 5) ok++;
            if (move.x == 6 && move.y == 5) ok++;
            if (move.x == 2 && move.y == 3) ok++;
            if (move.x == 6 && move.y == 3) ok++;
            if (move.x == 3 && move.y == 2) ok++;
            if (move.x == 5 && move.y == 2) ok++;
        });

        assert.equal(ok, 8);
    },
    'some-knight-moves' : function (assert) {
        var b2 = new Board;
        var moves = MoveGenerator(b2, newState(), b2.at(1,0), true);
        assert.equal(moves.length, 2);
    },
    'no-knight-moves' : function (assert) {
        var b3 = new Board;
        b3.move(1,0,4,2);
        b3.move(0,1,2,3);       
        b3.move(1,1,3,4);       
        b3.move(3,1,5,4);       
        b3.move(4,1,6,3);       
    }
};

