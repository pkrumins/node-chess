{
    var self = {};
    DNode(self).connect(function (server) {
        server.subscribe(function () {
        });
        
        server.games(function (games) {
            games.forEach(function (game) {
                var board = new Board(game.pieces);
                var thumb = new Thumbnail(board);
                $('#games').append(thumb.element);
            });
        });
    });
}
