var Board = require('../lib/game/board');
var b = new Board;

module.exports = {
    'linked-squares-row-0-e' : function (assert) {
        assert.equal(b.at(0,0).piece.color, 'w');
        assert.equal(b.at(0,0).piece.code, 'r');

        assert.equal(b.at(0,0).e.piece.color, 'w');
        assert.equal(b.at(0,0).e.piece.code, 'kn');

        assert.equal(b.at(0,0).e.e.piece.color, 'w');
        assert.equal(b.at(0,0).e.e.piece.code, 'b');

        assert.equal(b.at(0,0).e.e.e.piece.color, 'w');
        assert.equal(b.at(0,0).e.e.e.piece.code, 'q');

        assert.equal(b.at(0,0).e.e.e.e.piece.color, 'w');
        assert.equal(b.at(0,0).e.e.e.e.piece.code, 'k');

        assert.equal(b.at(0,0).e.e.e.e.e.piece.color, 'w');
        assert.equal(b.at(0,0).e.e.e.e.e.piece.code, 'b');

        assert.equal(b.at(0,0).e.e.e.e.e.e.piece.color, 'w');
        assert.equal(b.at(0,0).e.e.e.e.e.e.piece.code, 'kn');

        assert.equal(b.at(0,0).e.e.e.e.e.e.e.piece.color, 'w');
        assert.equal(b.at(0,0).e.e.e.e.e.e.e.piece.code, 'r');
    },
    'linked-squares-row-0-w' : function (assert) {
        assert.equal(b.at(7,0).piece.color, 'w');
        assert.equal(b.at(7,0).piece.code, 'r');

        assert.equal(b.at(7,0).w.piece.color, 'w');
        assert.equal(b.at(7,0).w.piece.code, 'kn');

        assert.equal(b.at(7,0).w.w.piece.color, 'w');
        assert.equal(b.at(7,0).w.w.piece.code, 'b');

        assert.equal(b.at(7,0).w.w.w.piece.color, 'w');
        assert.equal(b.at(7,0).w.w.w.piece.code, 'k');

        assert.equal(b.at(7,0).w.w.w.w.piece.color, 'w');
        assert.equal(b.at(7,0).w.w.w.w.piece.code, 'q');

        assert.equal(b.at(7,0).w.w.w.w.w.piece.color, 'w');
        assert.equal(b.at(7,0).w.w.w.w.w.piece.code, 'b');

        assert.equal(b.at(7,0).w.w.w.w.w.w.piece.color, 'w');
        assert.equal(b.at(7,0).w.w.w.w.w.w.piece.code, 'kn');

        assert.equal(b.at(7,0).w.w.w.w.w.w.w.piece.color, 'w');
        assert.equal(b.at(7,0).w.w.w.w.w.w.w.piece.code, 'r');
    },
    'linked-squares-row-0-n' : function (assert) {
        assert.equal(b.at(0,0).n.piece.color, 'w');
        assert.equal(b.at(0,0).n.piece.code, 'p');

        assert.equal(b.at(1,0).n.piece.color, 'w');
        assert.equal(b.at(1,0).n.piece.code, 'p');

        assert.equal(b.at(2,0).n.piece.color, 'w');
        assert.equal(b.at(2,0).n.piece.code, 'p');

        assert.equal(b.at(3,0).n.piece.color, 'w');
        assert.equal(b.at(3,0).n.piece.code, 'p');

        assert.equal(b.at(4,0).n.piece.color, 'w');
        assert.equal(b.at(4,0).n.piece.code, 'p');

        assert.equal(b.at(5,0).n.piece.color, 'w');
        assert.equal(b.at(5,0).n.piece.code, 'p');

        assert.equal(b.at(6,0).n.piece.color, 'w');
        assert.equal(b.at(6,0).n.piece.code, 'p');

        assert.equal(b.at(7,0).n.piece.color, 'w');
        assert.equal(b.at(7,0).n.piece.code, 'p');
    },
    'linked-squares-row-7-e' : function (assert) {
        assert.equal(b.at(0,7).piece.color, 'b');
        assert.equal(b.at(0,7).piece.code, 'r');

        assert.equal(b.at(0,7).e.piece.color, 'b');
        assert.equal(b.at(0,7).e.piece.code, 'kn');

        assert.equal(b.at(0,7).e.e.piece.color, 'b');
        assert.equal(b.at(0,7).e.e.piece.code, 'b');

        assert.equal(b.at(0,7).e.e.e.piece.color, 'b');
        assert.equal(b.at(0,7).e.e.e.piece.code, 'q');

        assert.equal(b.at(0,7).e.e.e.e.piece.color, 'b');
        assert.equal(b.at(0,7).e.e.e.e.piece.code, 'k');

        assert.equal(b.at(0,7).e.e.e.e.e.piece.color, 'b');
        assert.equal(b.at(0,7).e.e.e.e.e.piece.code, 'b');

        assert.equal(b.at(0,7).e.e.e.e.e.e.piece.color, 'b');
        assert.equal(b.at(0,7).e.e.e.e.e.e.piece.code, 'kn');

        assert.equal(b.at(0,7).e.e.e.e.e.e.e.piece.color, 'b');
        assert.equal(b.at(0,7).e.e.e.e.e.e.e.piece.code, 'r');
    },
    'linked-squares-row-7-w' : function (assert) {
        assert.equal(b.at(7,7).piece.color, 'b');
        assert.equal(b.at(7,7).piece.code, 'r');

        assert.equal(b.at(7,7).w.piece.color, 'b');
        assert.equal(b.at(7,7).w.piece.code, 'kn');

        assert.equal(b.at(7,7).w.w.piece.color, 'b');
        assert.equal(b.at(7,7).w.w.piece.code, 'b');

        assert.equal(b.at(7,7).w.w.w.piece.color, 'b');
        assert.equal(b.at(7,7).w.w.w.piece.code, 'k');

        assert.equal(b.at(7,7).w.w.w.w.piece.color, 'b');
        assert.equal(b.at(7,7).w.w.w.w.piece.code, 'q');

        assert.equal(b.at(7,7).w.w.w.w.w.piece.color, 'b');
        assert.equal(b.at(7,7).w.w.w.w.w.piece.code, 'b');

        assert.equal(b.at(7,7).w.w.w.w.w.w.piece.color, 'b');
        assert.equal(b.at(7,7).w.w.w.w.w.w.piece.code, 'kn');

        assert.equal(b.at(7,7).w.w.w.w.w.w.w.piece.color, 'b');
        assert.equal(b.at(7,7).w.w.w.w.w.w.w.piece.code, 'r');
    },
    'linked-squares-row-7-s' : function (assert) {
        assert.equal(b.at(0,7).s.piece.color, 'b');
        assert.equal(b.at(0,7).s.piece.code, 'p');

        assert.equal(b.at(1,7).s.piece.color, 'b');
        assert.equal(b.at(1,7).s.piece.code, 'p');

        assert.equal(b.at(2,7).s.piece.color, 'b');
        assert.equal(b.at(2,7).s.piece.code, 'p');

        assert.equal(b.at(3,7).s.piece.color, 'b');
        assert.equal(b.at(3,7).s.piece.code, 'p');

        assert.equal(b.at(4,7).s.piece.color, 'b');
        assert.equal(b.at(4,7).s.piece.code, 'p');

        assert.equal(b.at(5,7).s.piece.color, 'b');
        assert.equal(b.at(5,7).s.piece.code, 'p');

        assert.equal(b.at(6,7).s.piece.color, 'b');
        assert.equal(b.at(6,7).s.piece.code, 'p');

        assert.equal(b.at(7,7).s.piece.color, 'b');
        assert.equal(b.at(7,7).s.piece.code, 'p');
    },
    'linked-borders' : function (assert) {
        assert.equal(b.at(0,0).w, undefined);
        assert.equal(b.at(0,0).s, undefined);
        assert.equal(b.at(0,0).sw, undefined);
        assert.equal(b.at(0,0).sn, undefined);
        assert.equal(b.at(1,0).s, undefined);
        assert.equal(b.at(2,0).s, undefined);
        assert.equal(b.at(3,0).s, undefined);
        assert.equal(b.at(4,0).s, undefined);
        assert.equal(b.at(5,0).s, undefined);
        assert.equal(b.at(6,0).s, undefined);
        assert.equal(b.at(7,0).s, undefined);

        assert.equal(b.at(0,7).w, undefined);
        assert.equal(b.at(0,7).n, undefined);
        assert.equal(b.at(0,7).ne, undefined);
        assert.equal(b.at(0,7).nw, undefined);
        assert.equal(b.at(1,7).n, undefined);
        assert.equal(b.at(2,7).n, undefined);
        assert.equal(b.at(3,7).n, undefined);
        assert.equal(b.at(4,7).n, undefined);
        assert.equal(b.at(5,7).n, undefined);
        assert.equal(b.at(6,7).n, undefined);
        assert.equal(b.at(7,7).n, undefined);

        assert.equal(b.at(0,1).w, undefined);
        assert.equal(b.at(0,2).w, undefined);
        assert.equal(b.at(0,3).w, undefined);
        assert.equal(b.at(0,4).w, undefined);
        assert.equal(b.at(0,5).w, undefined);
        assert.equal(b.at(0,6).w, undefined);
        assert.equal(b.at(0,7).w, undefined);

        assert.equal(b.at(7,1).e, undefined);
        assert.equal(b.at(7,2).e, undefined);
        assert.equal(b.at(7,3).e, undefined);
        assert.equal(b.at(7,4).e, undefined);
        assert.equal(b.at(7,5).e, undefined);
        assert.equal(b.at(7,6).e, undefined);
        assert.equal(b.at(7,7).e, undefined);
    },
    'random-square1' : function (assert) {
        assert.equal(b.at(3,3).e.piece, null);
        assert.equal(b.at(3,3).w.piece, null);
        assert.equal(b.at(3,3).n.piece, null);
        assert.equal(b.at(3,3).s.piece, null);
        assert.equal(b.at(3,3).nw.piece, null);
        assert.equal(b.at(3,3).ne.piece, null);
        assert.equal(b.at(3,3).se.piece, null);
        assert.equal(b.at(3,3).sw.piece, null);
    },
    'random-square2' : function (assert) {
        assert.equal(b.at(4,5).e.piece, null);
        assert.equal(b.at(4,5).w.piece, null);
        assert.equal(b.at(4,5).n.piece.code, 'p');
        assert.equal(b.at(4,5).n.piece.color, 'b');
        assert.equal(b.at(4,5).s.piece, null);
        assert.equal(b.at(4,5).nw.piece.code, 'p');
        assert.equal(b.at(4,5).nw.piece.color, 'b');
        assert.equal(b.at(4,5).ne.piece.code, 'p');
        assert.equal(b.at(4,5).ne.piece.color, 'b');
        assert.equal(b.at(4,5).se.piece, null);
        assert.equal(b.at(4,5).sw.piece, null);
    }
};
