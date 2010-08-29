function Viewer (board, topside, players, mode) {
    var self = this; 
    if (topside === undefined) topside = 'black';
    if (topside == 'w') topside = 'white';
    if (topside == 'b') topside = 'black';
    
    var area = {
        width : $(window).width(),
        height : $(window).height() - 50 - 50
    };
    
    self.element = $('<div>')
        .addClass('board')
        .width(area.width)
        .height(area.height)
    ;
    
    var im = Raphael(self.element[0], area.width, area.height);
    
    im.rect(0, 0, area.width, area.height)
        .attr({ fill : '#CCC' });

    //transformers! robots in disguise!
    function transform (x, y) {
        return transform[mode](x, y);
    }
    
    transform.piece = function (x, y) {
        if (mode == 'rect') {
            return transform(x, y + (topside == 'black' ? 1 : 0));
        }
        else {
            // These numbers were just hard-coded & fiddled with fyi--no real
            // reason for them except to make things look right.
            var pos = transform(x, y + (topside === 'black' ? 0.4 : -0.0));
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
    
    function highlightOnOff(sq) {
        if (sq.attr('stroke') == 'green')
            sq.attr({ stroke : 'none' });
        else
            sq.attr({ stroke : 'green', 'stroke-width' : 2 });
    }

    function highlightOnOffFull(sq,x,y) {
        highlightOnOff(sq);
        // TODO: game state!!
        var moves = MoveGenerator(board, {moves:[]}, board.at(x,y), true);
        moves.forEach(function (move) {
            highlightOnOff(cells[move.x][move.y]);
        });
    }

    //No idea what the right approach is here--Figure I'll stub it up
    //And someone else can integrates
    //It would help if I knew better how Piece and Board worked.
    //Man I suck. XD
    function attack(attacker,attackee) {
        //Assume that I have these somehow:
        //var attacker.x, attacker.y;
        //var attackee.x, attackee.y;

        //chose attack and remnant sprite
        if (attacker.type === 'b') {
            var attack = 'voip';
            var remnants = 'ash';
        } else if (attacker.type === 'k' || attacker.type === 'q') {
            var attack = 'stab';
            var remnants = 'puddle';
        } else if (attacker.type === 'kn') {
            var attack = 'splat';
            var remnants = 'puddle';
        } else {
            var attack = 'bang';
            var remnants = 'puddle';
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
                highlightOnOffFull(this,x,y);
            });
        });
    });

    var sprites = range(8).map(function (x) {
        return range(8).map(function (y) { return null });
    });
    
    board.on('move', function (sx, sy, dx, dy) {
        var dst = sprites[dx][dy];
        var src = sprites[sx][sy];
        var t = transform.piece(dx, dy);
        src.animate({ x : t.x, y : t.y }, 500);
        if (dst) {
            setTimeout(function () {
                dst.remove(); // <-- more violently
            }, 500);
        }
        sprites[dx][dy] = src;
        sprites[sx][sy] = null;

        var piece = board.pieceAt(dx,dy);
        if (piece && piece.color == 'w' && piece.code == 'p' && sy == 6 && dy == 7) {
            // white pawn promotion
            PromotionDialog(im, area, 'w', function (choice) {
                var sprite = im.image(
                    svgFile('w', choice, topside.slice(0,1) == 'w' ? 'front' : 'back')
                );
                sprites[dx][dy].remove();
                sprites[dx][dy] = sprite;
            });
        }
        if (piece && piece.color == 'b' && piece.code == 'p' && sy == 1 && dy == 0) {
            // black pawn promotion
            PromotionDialog(im, area, 'b', function (choice) {
                var sprite = im.image(
                    svgFile('b', choice, topside.slice(0,1) == 'b' ? 'front' : 'back')
                );
                sprites[dx][dy].remove();
                sprites[dx][dy] = sprite;
            });
        }
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
                        xx = x + (topside === 'black' ? -0.1 : 0.15);
                    } else {
                        xx = x + (topside === 'black' ? 0.15 : -0.1);
                    }
                }
                var pos = transform.piece(xx, y);
                var file = svgFile(p.color, p.code,
                    topside.slice(0,1) === p.color ? 'front' : 'back');
                if ( mode === 'rect' ) {
                    var sprite = im.image(file, pos.x+2, pos.y+2, size-2, size-2);
                } else {
                    var sprite = im.image(file, pos.x-12, pos.y+2, size-2, size-2);
                }
                sprite.click(function () {
                    highlightOnOffFull(cells[x][y],x,y);
                });
                sprites[x][y] = sprite;
            }
        });
    });

    PromotionDialog(im, area, 'w', function (choice) {
        console.log('Choice: ' + choice);
    });
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
