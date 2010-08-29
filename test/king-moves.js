var Board = require('../lib/game/board');
var MoveGenerator = require('../lib/game/movegenerator');


function newState() {
    return {
        moves : []
    };
}

module.exports = {
    'all-king-moves' : function (assert) {
        var b = new Board;
        b.move(4,0,4,3);
        moves = MoveGenerator(b, newState(), b.at(4,3), true);
        assert.equal(moves.length, 8);

        var ok = 0;
        moves.forEach(function (move) {
            if (move.x == 3 && move.y == 2) ok++;
            if (move.x == 3 && move.y == 3) ok++;
            if (move.x == 3 && move.y == 4) ok++;
            if (move.x == 4 && move.y == 4) ok++;
            if (move.x == 5 && move.y == 4) ok++;
            if (move.x == 5 && move.y == 3) ok++;
            if (move.x == 5 && move.y == 2) ok++;
            if (move.x == 4 && move.y == 2) ok++;
        });

        assert.equal(ok, 8);
    },
    'no-king-moves' : function (assert) {
        var b = new Board;
        var nomoves = MoveGenerator(b, newState(), b.at(4,0), true);
        assert.equal(nomoves.length, 0);
    },
    'restricted-king-moves' : function (assert) {
        var b = new Board;
        b.move(4,0,4,4);
        moves = MoveGenerator(b, newState(), b.at(4,4), true);
        assert.equal(moves.length, 5);
    },
    'white-castling-short-no-attack' : function (assert) {
        var b = new Board;
        b.move(5,0,5,2);
        b.move(6,0,6,2);
        moves = MoveGenerator(b, newState(), b.at(4,0), true);
        assert.equal(moves.length,2);
        var ok = 0;
        moves.forEach(function (move) {
            if (move.pos == 'F1') ok++;
            if (move.pos == 'G1') ok++;
        });
        assert.equal(ok,2);
    },
    'white-castling-long-no-attack' : function (assert) {
        var b = new Board;
        b.move(1,0,1,2);
        b.move(2,0,2,2);
        b.move(3,0,3,2);
        moves = MoveGenerator(b, newState(), b.at(4,0), true);
        assert.equal(moves.length,2);
        var ok = 0;
        moves.forEach(function (move) {
            if (move.pos == 'D1') ok++;
            if (move.pos == 'C1') ok++;
        });
        assert.equal(ok,2);
    },
    'black-castling-short-no-attack' : function (assert) {
        var b = new Board;
        b.move(5,7,5,5);
        b.move(6,7,6,5);
        moves = MoveGenerator(b, newState(), b.at(4,7), true);
        assert.equal(moves.length,2);
        var ok = 0;
        moves.forEach(function (move) {
            if (move.pos == 'F8') ok++;
            if (move.pos == 'G8') ok++;
        });
        assert.equal(ok,2);
    },
    'black-castling-long-no-attack' : function (assert) {
        var b = new Board;
        b.move(1,7,1,5);
        b.move(2,7,2,5);
        b.move(3,7,3,5);
        moves = MoveGenerator(b, newState(), b.at(4,7), true);
        assert.equal(moves.length,2);
        var ok = 0;
        moves.forEach(function (move) {
            if (move.pos == 'D8') ok++;
            if (move.pos == 'C8') ok++;
        });
        assert.equal(ok,2);
    },

};

