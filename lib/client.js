{
    var self = {};
    DNode(self).connect(function (server) {
        server.games(function (games) {
            games.forEach(function (game) {
                game.pieces(function (pieces) {
                    var board = new Board(pieces);
                    var thumb = new Thumbnail(board);
                    $('#games').append(thumb.element);
                });
            });
        });
    });
}
