{
    var self = {};
    DNode(self).connect(function (server) {
        server.games(function (games) {
            games.forEach(function (game) {
                game.getBoard(function (b) {
                    var board = new Board(b);
                    board.eachPiece(function (piece) {
                        console.log(piece);
                    });
                });
            });
        });
    });
}
