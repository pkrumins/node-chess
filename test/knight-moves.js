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
        var moves = MoveGenerator(b3, newState(), b3.at(4,2), true);
        assert.equal(moves.length, 0);
    },
    'white-knight-one-move-from-starting' : function (assert) {
        var b4 = new Board;
        b4.move(1,0,2,2);
        var moves = MoveGenerator(b4, newState(), b4.at(2,2), true);
        assert.equal(moves.length, 5);

        var ok = 0;
        moves.forEach(function (move) {
            if (move.pos == 'B1') ok++;
            if (move.pos == 'A4') ok++;
            if (move.pos == 'B5') ok++;
            if (move.pos == 'D5') ok++;
            if (move.pos == 'E4') ok++;
        });
        assert.equal(ok,5);
    },
    'black-knight-check-white-king' : function (assert) {
        var b5 = new Board;
        b5.move(1,7,3,2);
        var moves = MoveGenerator(b5, newState(), b5.at(2,1), true);
        assert.equal(moves.length, 1);

        var ok = 0;
        moves.forEach(function (move) {
            if (move.pos == 'D3') ok++;
        });
        assert.equal(ok,1);

        var moves = MoveGenerator(b5, newState(), b5.at(4,1), true);
        assert.equal(moves.length, 1);

        var ok = 0;
        moves.forEach(function (move) {
            if (move.pos == 'D3') ok++;
        });
        assert.equal(ok,1);

        var moves = MoveGenerator(b5, newState(), b5.at(3,1), true);
        assert.equal(moves.length, 0);
    }
};

