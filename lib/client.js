{
    var self = {};
    DNode(self).connect(function (server) {
        /*
        server.subscribe(function () {
            // ...
        });
        */
        
        var thumbs = {};
        
        server.watchAll(function (gid, em) {
            em.on('move', function (sx, sy, dx, dy) {
                // console.log('move ' + gid + ': ' + [sx,sy,dx,dy].join(','));
                thumbs[gid].move(sx, sy, dx, dy);
            });
            
            em.on('join', function (name) {
                thumbs[gid].addPlayer(player);
            });
        });
        
        server.games(function (games) {
            games.forEach(function (game) {
                var board = new Board(game.pieces);
                var thumb = new Thumbnail(board);
                if (game.players.white) thumb.addPlayer(game.players.white);
                if (game.players.black) thumb.addPlayer(game.players.black);
                thumbs[game.id] = thumb;
                $('#games').append(thumb.element);
            });
        });
    });
}
