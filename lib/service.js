var Game = require('./game/game');

module.exports = Service;
function Service (client, conn) {
    var self = this;
    
    self.games = function (cb) {
        var gs = [
            new Game, new Game, new Game
        ].map(function (g) {
            return {
                pieces : function (cb) { cb(g.board.pieces) }
            };
        });
        cb(gs); // for testing
    };
}
