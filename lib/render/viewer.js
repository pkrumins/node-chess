var GameState = require('game').GameState;

function Viewer (board, topside, players, mode, moveMakerF) {
    var self = this; 
    if (topside === undefined) topside = 'black';
    if (topside == 'w') topside = 'white';
    if (topside == 'b') topside = 'black';

    //image preload. Would look better with a map or foreach or something
    var preload = Hash.map({
        ash: "ash.svg",
        ashTexture: "ash_texture.png",
        bang: "bang.svg",
        puddle: "puddle.svg",
        splat: "splat.svg",
        stab: "stab.svg",
        voip: "voip.svg"
    }, function (str) {
        var image = new Image();
        image.src = "/images/violence/"+str;
        return image;
    });


    var watching = !moveMakerF;
    if (watching) {
        moveMakerF = function () {};
    }
    
    var gameState = new GameState;

    var blockAllInput = false; // true when the pawn promotion dialog is displayed, for example
    
    var area = {
        width : $(window).width(),
        height : $(window).height() - 50 - 50
    };
    
    self.element = $('<div>')
        .addClass('board')
        .width(area.width)
        .height(area.height)
    ;
    
    function showPlayers () {
        var black = $('<span>')
            .addClass(players.black ? 'black' : 'empty')
            .text((players.black && players.black.name) || 'empty')
        ;
        var white = $('<span>')
            .addClass(players.white ? 'white' : 'empty')
            .text((players.white && players.white.name) || 'empty')
        ;
        var vs = $('<span>').addClass('vs').text('vs');
        $('#vs').empty().append(white, vs, black);
    }
    showPlayers();
    
    self.joined = function (player) {
        players[player.color] = player;
        showPlayers();
    };
    
    self.parted = function (player) {
        players[player.color] = null;
        showPlayers();
    };
    
    self.renamed = function (oldname, newname) {
        if (players.white && players.white.name == oldname) {
            players.white.name = newname;
        }
        if (players.black && players.black.name == oldname) {
            players.black.name = newname;
        }
        showPlayers();
    };
    
    var im = Raphael(self.element[0], area.width, area.height);
    
    //transformers! robots in disguise!
    function transform (x, y) {
        return transform[mode](x, y);
    }
    
    transform.piece = function (x, y) {
        if (mode == 'rect') {
            return transform(
                x + (topside == 'black' ? 0 : 1),
                y + (topside == 'black' ? 1 : 0)
            );
        }
        else {
            // These numbers were just hard-coded & fiddled with fyi--no real
            // reason for them except to make things look right.
            var pos = transform(x, y + (topside === 'black' ? 0.4 : 0.4));
            pos.y = transform(x, y + (topside === 'black' ? 1.8 : -0.9)).y;
            return pos;
        }
    };
    
    transform.trap = function (x, y) {
        var cx = 4, cy = 4;
        
        var wBottom = 1;
        var wTop = 0.8;
        var height = 0.6;

        var ynew = ((topside === 'black' ? y : 8-y )-cy) * height + cy;
        var xnew = ((topside === 'black' ? x : 8-x)-cx) * ( 0.5*(wTop + wBottom) - 0.25*(wBottom-wTop)*((topside === 'black' ? y : 8-y )-cy) ) + cx;

        return {
            x: xnew*area.height/8 + (area.width-area.height)/2,
            y: (8-ynew) * area.height/8
        };
    }
    
    transform.rect = function (x, y) {
        var dim = Math.min(area.width, area.height);
        return {
            x : (topside === 'black' ? x : 8 - x) * dim / 8 + (area.width - dim) / 2,
            y : (topside == 'white' ? y : 8 - y) * dim / 8
        };
    };

    function highlightOff(sq) {
        sq.attr({ stroke : 'none' });
    }

    function highlightOn(sq) {
        sq.attr({ stroke : 'green', 'stroke-width' : 2 });
    }

    function highlightOnOff(sq) {
        if (sq.attr('stroke') == 'green')
            highlightOff(sq);
        else
            highlightOn(sq);
    }

    function highlightOffFull() {
        range(8).forEach(function (x) {
            range(8).forEach(function (y) {
                highlightOff(cells[x][y]);
            });
        });
    }

    function highlightOnOffFull(sq,x,y) {
        highlightOnOff(sq);
        var moves = MoveGenerator(board, gameState, board.at(x,y), true);
        moves.forEach(function (move) {
            highlightOnOff(cells[move.x][move.y]);
        });
    }

    var srcMove = null;
    function cellClick(cell,x,y) {
        if (blockAllInput) return;
        if (srcMove) {
            var piece = board.pieceAt(srcMove.x, srcMove.y);
            if (srcMove.x == x && srcMove.y == y) { // cancel selected move
                highlightOffFull(cell,x,y);
                srcMove = null;
                return;
            }

            var possibleMoves = MoveGenerator(board,gameState,board.at(srcMove.x,srcMove.y),true);
            var canMove = possibleMoves.some(function (move) { return move.x == x && move.y == y });

            if (!canMove) return;

            var makeMove = true;

            highlightOffFull();

            if (piece.color == 'w' && piece.code == 'p' && srcMove.y == 6 && y == 7) {
                // white pawn promotion
                blockAllInput = true;
                PromotionDialog(im, area, 'w', function (choice) {
                    blockAllInput = false;
                    moveMakerF(srcMove.x, srcMove.y, x, y, choice);
                    gameState.newMove(piece, srcMove.x, srcMove.y, x, y, choice);
                    srcMove = null;
                });
            }
            if (piece.color == 'b' && piece.code == 'p' && srcMove.y == 1 && y == 0) {
                // black pawn promotion
                blockAllInput = true;
                PromotionDialog(im, area, 'b', function (choice) {
                    blockAllInput = false;
                    moveMakerF(srcMove.x, srcMove.y, x, y, choice);
                    gameState.newMove(piece, srcMove.x, srcMove.y, x, y, choice);
                    srcMove = null;
                });
            }

            if (blockAllInput) return; // blockAllInput only true if promotion dialog was shown

            if (piece.color == 'w' && piece.code == 'k' && srcMove.x == 4 && srcMove.y == 0) {
                if (x == 6 && y == 0) { // white short castling!
                    moveMakerF(srcMove.x, srcMove.y, x, y); // move king
                    moveMakerF(7,0,5,0); // move rook
                    gameState.newMove(piece, srcMove.x, srcMove.y, x, y);
                    srcMove = null;
                    makeMove = false;
                }
                else if (x == 2 && y == 0) { // white long castling
                    moveMakerF(srcMove.x, srcMove.y, x, y); // move king
                    moveMakerF(0,0,3,0); // move rook
                    gameState.newMove(piece, srcMove.x, srcMove.y, x, y);
                    srcMove = null;
                    makeMove = false;
                }
            }
            if (piece.color == 'b' && piece.code == 'k' && srcMove.x == 4 && srcMove.y == 7) {
                if (x == 6 && y == 7) { // black short castling
                    moveMakerF(srcMove.x, srcMove.y, x, y); // move king
                    moveMakerF(7,7,5,7); // move rook
                    gameState.newMove(piece, srcMove.x, srcMove.y, x, y);
                    srcMove = null;
                    makeMove = false;
                }
                else if (x == 2 && y == 7) { // black long castling
                    moveMakerF(srcMove.x, srcMove.y, x, y); // move king
                    moveMakerF(0,7,3,7); // move rook
                    gameState.newMove(piece, srcMove.x, srcMove.y, x, y);
                    srcMove = null;
                    makeMove = false;
                }
            }

            if (piece.code == 'k') {
                if (piece.color == 'w')
                    gameState.whiteKingMoved = true;
                else
                    gameState.blackKingMoved = true;
            }
            if (piece.code == 'r') {
                if (srcMove.x == 0 && srcMove.y == 0)
                    gameState.rookA1Moved = true;
                else if (srcMove.x == 7 && srcMove.y == 0)
                    gameState.rookH1Moved = true;
                else if (srcMove.x == 0 && srcMove.y == 7)
                    gameState.rookA8Moved = true;
                else if (srcMove.x == 7 && srcMove.y == 7)
                    gameState.rookH8Moved = true;
            }

            if (makeMove) {
                moveMakerF(srcMove.x, srcMove.y, x, y);
                gameState.newMove(piece, srcMove.x, srcMove.y, x, y);
                srcMove = null;
            }
        }
        else {
            if (board.pieceAt(x,y)) {
                highlightOnOffFull(cell,x,y);
                srcMove = { x : x, y : y };
            }
        }
    }

    var cells = [];
    for (var i = 0; i < 8; i++)
        cells[i] = [];

    range(8).reverse().forEach(function (y) {
        range(8).forEach(function (x) {
            cells[x][y] = Path(im).polygon([
                transform(x, y),
                transform(x, y + 1),
                transform(x + 1, y + 1),
                transform(x + 1, y)
            ]).attr({
                fill : (x + y) % 2 == 0 ? 'rgb(150,100,100)' : 'white',
                stroke : 'none'
            }).click(function () {
                cellClick(this,x,y);
            });
        });
    });

    var sprites = range(8).map(function (x) {
        return range(8).map(function (y) { return null });
    });
    
    board.on('move', function (sx, sy, dx, dy, choice) {
        var dst = sprites[dx][dy];
        var src = sprites[sx][sy];
        var dim = Math.min(area.width, area.height)/8;
        //For some reason, using transform.piece shifts pieces to the right. Idk why.
        if (mode === 'trap' && topside === 'white') {        
            var t = transform.piece(dx + 1, dy);
        } else {
            var t = transform.piece(dx , dy);
        }

        if (dst) {
            //violent animation
            var violence = {
                'b': ['voip', 'ash'],
                'k': ['stab', 'puddle'],
                'q': ['stab', 'puddle'],
                'kn': ['splat', 'puddle'],
                'p': ['bang', 'puddle'],
                'r': ['bang', 'puddle']
            };

            violence = violence[board.pieceAt(dx,dy).code];

            var blam = im.image('/images/violence/'+violence[0]+'.svg', t.x, t.y, dim, dim);
            setTimeout(function () {
                dst.remove(); 
                blam.remove();
                var puddle = im.image('/images/violence/'+violence[1]+'.svg', t.x, t.y, dim, dim);
                setTimeout(function () {
                    src.animate({ x : t.x, y : t.y }, 500);
                    puddle.remove();
                }, 500);
            }, 800);
        } else {
            //non-violent animation
            src.animate({ x : t.x, y : t.y }, 500);
        }
        if (choice) {
            var piece = board.pieceAt(dx,dy);
            var dim = Math.min(area.width, area.height);
            var size = dim / 8;
            var pos = transform.piece(dx, dy);
            var sprite = newSprite(
                im,
                mode,
                svgFile(piece.color, choice, topside.slice(0,1) == 'b' ? 'front' : 'back'),
                pos.x,
                pos.y,
                size-2,
                size-2
            );
            if (sprites[dx][dy]) sprites[dx][dy].remove();
            sprites[sx][sy].remove();
            sprites[dx][dy] = sprite;
        }
        else {
            sprites[dx][dy] = src;
        }
        sprites[sx][sy] = null;
        sprites[dx][dy].click(function () {
            cellClick(cells[dx][dy],dx,dy);
        });
    });

    board.on('enpassant', function (x,y) {
        sprites[x][y].remove();
    });
    
    var yterator = ( topside === 'black' ? range(8).reverse() : range(8) );    
    yterator.forEach(function (y) {
        range(8).forEach(function (x) {
            var p = board.pieceAt(x, y);
            if (p) {
                var dim = Math.min(area.width, area.height);
                var size = dim / 8;

                //Offsets for particular, awkward pieces
                var xx = x;
                if ( p.code === 'kn' ) {
                    if ( p.color === 'w' ) {
                        xx = x + (topside === 'black' ? 0 : 0.1);
                    } else {
                        xx = x + (topside === 'black' ? 0.1 : 0);
                    }
                } else if (p.code === 'r') {
                    if ( p.color === 'w' ) {
                        xx = x - 0.1;
                    } else {
                        xx = x + 0.1;
                    }
                }
                xx = (topside === 'white') && (mode === 'trap') ? xx + 1 : xx;
                var yy = (topside === 'white') && (mode === 'trap') ? y + 0.1 : y;
                var pos = transform.piece(xx, yy);
                var file = svgFile(p.color, p.code,
                    topside.slice(0,1) === p.color ? 'front' : 'back');
                var sprite = newSprite(im, mode, file, pos.x, pos.y, size-2, size-2);
                sprite.click(function () {
                    cellClick(cells[x][y],x,y);
                });
                sprites[x][y] = sprite;
            }
        });
    });

    //Prints the end-game dialog so I can mess with.
    //EndGameDialog(im, area, 'white', function() {console.log("click!");});
}

function newSprite(im, mode, file, x, y, w, h) {
    if ( mode === 'rect' ) {
        return im.image(file, x+2, y+2, w, h);
    } else {
        return im.image(file, x-12, y+2, w, h);
    }
}

function range (i,j,skip) {
    if (j === undefined) {
        j = i; i = 0;
    }
    if (skip === undefined) skip = 1;
    
    var acc = [];
    for (; i < j; i += skip) { acc.push(i) }
    return acc;
}

function svgFile (color, code, face) {
    return '/images/' + color + '/' + code + '/' + face + '.svg';
}

function PromotionDialog (im, area, color, cb) {
    var width = area.width/2;
    var height = area.height/4;
    var x = (area.width - width)/2;
    var y = (area.height - height)/2;

    var rect = im.rect(x, y, width, height, 10)
        .attr({
            fill : '#ccc',
            'fill-opacity' : 0.5
        });

    var titleText = im.text(x+20, y+35, "Pawn Promotion")
        .attr({
            fill : 'rgb(58,95,205)',
            stroke : 'black',
            'stroke-width' : 1,
            'font-size' : height/5,
            'font-weight' : 'bold',
            'text-anchor' : 'start'
        });

    var pWidth, pHeight;
    pWidth = pHeight = height/2;

    function mkImg(color, code, face, pos) {
        return im.image(svgFile(color, code, face),
            x+20 + (pos*(pWidth+10)), y+20+(height-pHeight)/2, pWidth, pHeight);
    }

    var queen = mkImg(color, 'q', 'front', 0);
    var rook = mkImg(color, 'r', 'front', 1);
    var knight = mkImg(color, 'kn', 'front', 2);
    var bishop = mkImg(color, 'b', 'front', 3);

    function choice(c) {
        [rect, titleText, queen, rook, knight, bishop]
            .forEach(function (x) { x.remove() });
        cb(c);
    }

    queen.click(function () { choice('q') });
    rook.click(function () { choice('r') });
    knight.click(function () { choice('kn') });
    bishop.click(function () { choice('b') });
}


//Straight up ripped off from promotion dialog
function EndGameDialog (im, area, color, cb) {
    var width = area.width/3;
    var height = area.height/4;
    var x = (area.width - width)/2;
    var y = (area.height - height)/2;

    var rect = im.rect(x, y, width, height, 10)
        .attr({
            fill : '#ccc',
            'fill-opacity' : 0.5
        });

    var mainText = im.text(x+20, y+50, (color==="black" ? "BLACK" : "WHITE")+" WINS!")
        .attr({
            fill : 'rgb(58,95,205)',
            stroke : 'black',
            'stroke-width' : 1,
            'font-size' : height/3,
            'font-weight' : 'bold',
            'text-anchor' : 'start'
        });

    var subText = im.text(x+20, y+50+height/3, "Click to play another game!")
        .attr({
            fill : 'rgb(58,95,205)',
            stroke : 'black',
            'stroke-width' : 1,
            'font-size' : height/5,
            'font-weight' : 'bold',
            'text-anchor' : 'start'
        });

    [rect, mainText, subText].forEach( function(y) { 
        y.click(function() {
            [rect, mainText, subText].forEach(function (x) {x.remove()});
            cb();
        });
    });
}

function Path (im) {
    var self = {};
    var path = [];
    
    self.move = function (x, y) {
        path.push(['M',x,y].join(' '));
        return self;
    };
    
    self.line = function (x, y) {
        path.push(['L',x,y].join(' '));
        return self;
    };
    
    self.__defineGetter__('close', function () {
        path.push('z');
        return self.end;
    });
    
    self.__defineGetter__('end', function () {
        return im.path(path.join(' '));
    });
    
    self.polygon = function (points) {
        var p0 = points.shift();
        self.move(p0.x, p0.y);
        points.forEach(function (p) {
            self.line(p.x, p.y);
        });
        return self.close;
    };
    
    return self;
}
