DNode().connect(function (server) {
    /*
    server.subscribe(function () {
        // ...
    });
    */
    
    var thumbs = {};
    
    server.watchAll(function (gid, em) {
        em.on('move', function (sx, sy, dx, dy) {
            // console.log('move ' + gid + ': ' + [sx,sy,dx,dy].join(','));
            if (thumbs[gid]) {
                thumbs[gid].move(sx, sy, dx, dy);
            }
        });
        
        em.on('join', function (player) {
            if (thumbs[gid]) {
                thumbs[gid].addPlayer(player);
            }
        });
        
        em.on('part', function (player) {
            if (thumbs[gid]) {
                thumbs[gid].removePlayer(player);
            }
        });
    });
    
    server.games(function (games) {
        games.forEach(function (game) {
            var board = new Board(game.pieces);
            var thumb = new Thumbnail(board);
            if (game.players.white) thumb.addPlayer(game.players.white);
            if (game.players.black) thumb.addPlayer(game.players.black);
            
            thumb.on('watch', function () {
                var viewer = new Viewer(board);
                $(window).resize(function () {
                    var v = new Viewer(board);
                    $('#boards div:visible').remove();
                    $('#boards').append(v.element.hide().fadeIn(500));
                    viewer.element.fadeOut(500, function () {
                        viewer.element.remove();
                    });
                });
                
                $('#games').fadeOut(500);
                $('#boards').fadeIn(500).append(viewer.element);
            });
            
            thumb.on('play', function () {
                console.log('caught play');
            });
            
            thumbs[game.id] = thumb;
            $('#games').append(thumb.element);
        });
    });
});
