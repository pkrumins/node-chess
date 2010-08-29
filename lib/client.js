function Watch  (game, board, color) {
    var self = this;
    self.id = game.id;
    
    var mode = 'rect';
    var topside = color === 'black' ? 'white' : 'black';
    
    $('#toggle-mode').text('['+(mode === 'rect' ? 'overhead' : 'side-on')+']');
    $('#toggle-topside').text('[towards '+topside+']');
    
    var viewer = new Viewer(board, topside, game.players, mode, game.moveMakerF);
    
    self.moved = function (sx, sy, dx, dy, choice) {
        board.move(sx, sy, dx, dy, choice);
    };
    
    self.joined = function (player) { viewer.joined(player) };
    self.parted = function (player) { viewer.parted(player) };
    self.renamed = function (o, n) { viewer.renamed(o, n) };
    
    $(window).resize(function () {
        var v = new Viewer(board, topside, game.players, mode, game.moveMakerF);
        $('#boards div:visible').remove();
        $('#boards').append(v.element);
    });
    
    $('#toggle-mode').click(function() {
        if (mode === 'trap') {
            mode = 'rect';
        } else {
            mode = 'trap';
        }
        $('#toggle-mode').text('['+(mode === 'rect' ? 'overhead' : 'side-on')+']');
        var v = new Viewer(board, topside, game.players, mode, game.moveMakerF);
        $('#boards div:visible').remove();
        $('#boards').append(v.element);
    });
    
    $('#toggle-topside').click(function() {
        if (topside === 'black') {
            topside = 'white';
        } else {
            topside = 'black';
        }
        $('#toggle-topside').text('[towards '+topside+']');
        var v = new Viewer(board, topside, game.players, mode, game.moveMakerF);
        $('#boards div:visible').remove();
        $('#boards').append(v.element);
    });
    
    $('#games').fadeOut(500);
    $('#boards').fadeIn(500).append(viewer.element);
}

function notify(msg) {
    $('#notify').append($("<span>").text(' * '+msg));
    setTimeout( function() {
        $('#notify span').fadeOut(200);
    }, 2500);
}

DNode().connect(function (server) {
    var watching = null;
    
    function registerGame (game) {
        var board = new Board(game.pieces);
        var thumb = new Thumbnail(board);
        if (game.players.white) thumb.addPlayer(game.players.white);
        if (game.players.black) thumb.addPlayer(game.players.black);
        
        thumb.on('watch', function () {
            watching = new Watch(game, board, 'white');
        });
        thumb.on('join', function () {
            var color = thumb.available();
            if (!color) {
                console.log("No spots available to join");
                notify("no spots available to join");
                return;
            }
            
            server.joinGame(game.id, color, function (err, moveMakerF) {
                if (err) {
                    console.log('Error joining game: ' + err);
                    notify("Error joining game: " + err);
                    return;
                }
                game.moveMakerF = moveMakerF;
                game.players[color] = {
                    name : $('input#name').val(),
                    color: color
                };
                watching = new Watch(game, board, color);
            });
        });
        
        $('#games').append(thumb.element);
        return thumb;
    }

    var thumbs = {
        dummy : new Thumbnail(new Board)
    };
    
    $('#games').append(thumbs.dummy.element);
    thumbs.dummy.on('create', function () {
        server.createGame('white', function (err, game, moveMakerF) {
            if (err) {
                console.log(err);
                return;
            }
            var board = new Board(game.pieces);
            game.moveMakerF = moveMakerF;
            watching = new Watch(game, board);
        });
    });
    
    server.subscribe(function (em) {
        em.on('deleted', function (gid) {
            if (gid in thumbs) {
                thumbs[gid].element.remove();
                delete thumbs[gid];
            }
        });
        
        em.on('created', function (game) {
            if (!(game.id in thumbs)) {
                thumbs[game.id] = registerGame(game);
            }
        });
        
        em.on('joined', function (gid, player) {
            if (thumbs[gid]) {
                thumbs[gid].addPlayer(player);
            }
            if (watching && watching.id == gid) {
                watching.joined(player);
            }
        });
        
        em.on('parted', function (gid, player) {
            if (thumbs[gid]) {
                thumbs[gid].removePlayer(player);
            }
            if (watching && watching.id == gid) {
                watching.parted(player);
            }
        });
        
        em.on('rename', function (oldname, newname) {
            Hash(thumbs).forEach(function (thumb, gid) {
                if (watching && watching.id == gid) {
                    watching.renamed(oldname, newname);
                }
                if (thumb.players.white.name == oldname) {
                    var player = thumb.players.white;
                    thumb.removePlayer(player);
                    player.name = newname;
                    thumb.addPlayer(player);
                }
                if (thumb.players.black.name == oldname) {
                    var player = thumb.players.black;
                    thumb.removePlayer(player);
                    player.name = newname;
                    thumb.addPlayer(player);
                }
            });
        });
        
        em.on('moved', function (gid, sx, sy, dx, dy, choice) {
            if (thumbs[gid]) {
                thumbs[gid].move(sx, sy, dx, dy, choice);
            }
            if (watching && watching.id == gid) {
                watching.moved(sx, sy, dx, dy, choice);
            }
        });
    });
    
    function rename (name) {
        server.name(name, function (err) {
            if (err) {
                $('input#name').addClass('angry');
                setTimeout(function () {
                    $('input#name').removeClass('angry');
                }, 2000);
                
                console.log("Can't use the name \"" + name + '": ' + err);
                notify("Can't use the name \"" + name + '": ' + err);
                return;
            }
        });
    }
    
    $(document).ready(function () {
        $('input#name').val('player' + Math.floor(Math.random() * 10000));
        rename($('input#name').val());
    });
    
    $('input#name').change(function (ev) {
        ev.preventDefault();
        rename($('input#name').val());
    });
    
    $('form#nameform').submit(function (ev) {
        ev.preventDefault();
        $('input#name').blur();
    });
    
    server.games(function (games) {
        games.forEach(function (game) {
            thumbs[game.id] = registerGame(game);
        });
    });
});
