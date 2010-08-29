DNode().connect(function (server) {
    /*
    server.subscribe(function () {
        // ...
    });
    */
    
    var thumbs = {};
    
    $('form#nameform').submit(function (ev) {
        ev.preventDefault();
        
        var name = this.elements.name.value;
        
        server.name(name, function (err) {
            if (err) {
                console.log("Can't use the name \"" + name + '": ' + err);
                return;
            }
            
            console.log('name ok');
        });
    });
    
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
            
            function watch () {
                var viewer = new Viewer(board, 'black', game.players);
                $(window).resize(function () {
                    var v = new Viewer(board, 'black', game.players);
                    $('#boards div:visible').remove();
                    $('#boards').append(v.element);
                });
                
                $('#games').fadeOut(500);
                $('#boards').fadeIn(500).append(viewer.element);
            }
            
            thumb.on('watch', function () {
                watch();
            });
            
            thumb.on('join', function () {
                var color = thumb.available();
                if (!color) {
                    console.log("No spots available to join");
                    return;
                }
                
                server.joinGame(game.id, color, function (err) {
                    if (err) {
                        console.log('Error joining game: ' + err);
                        return;
                    }
                    
                    // ...
                    watch();
                });
            });
            
            thumbs[game.id] = thumb;
            $('#games').append(thumb.element);
        });
    });
});
