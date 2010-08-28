{
    var self = {};
    DNode(self).connect(function (server) {
        server.games(function (games) {
            games.forEach(function (game) {
                game.getBoard(function (b) {
                    var board = new Board(b);
                    var thumb = new Thumbnail(board);
                    $('#games').append(thumb.element);
                });
            });
        });
    });
}
