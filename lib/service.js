var Game = require('./game/game');

module.exports = Service;
function Service (client, conn) {
    var self = this;
    
    self.games = function (cb) {
        cb([ new Game ]); // for testing
    };
}
