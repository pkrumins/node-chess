{
    var self = {};
    DNode(self).connect(function (server) {
        server.games(function (games) {
            games.forEach(function (game) {
                var board = new Board(game.board.board);
                board.eachPiece(function (piece) {
                    console.log(piece);
                });
            });
        });
    });
}
