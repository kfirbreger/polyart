var Dots = (function(window, document, undefined) {
    var gr = 1.61803399,
        size_x,
        size_y,
        canvas,
        grid = [],
        grid_size = 20,
    createDot = function(point, size, color) {
        circle = new Path.Circle(point, size);
        circle.fillColor = color;
    },
    makeGrid = function() {
        
    }
})(this, this.document);
// Drawer object
var Drawer = (function(window, document, undefined) {
    var gr = 1.61803399,
        save_mime = "image/octet-stream",
        // @TODO use jQuery to get canvas size and calculate range
        x = 500,
        y = 800,
        offset = 50,
        max_c = 0.8,
        min_c = 0.2,
        alpha_constant = 0.8,
        logger = {},
        poly_count,
        d = {},
    // Private functions
    createLocation = function() {
        var px, py, p;
        px = Math.round(Math.random() * (x + offset * 2) - offset);
        py = Math.round(Math.random() * (y + offset * 2) - offset);
        p = new Point(px, py);
        return p;
    },
    colorDisapprove = function(r, g, b) {
        var disallow = true;
        if (r > max_c && g > max_c && b > max_c) {
            disallow = false;
        } else if (r > max_c && g > max_c && b < min_c) {
            disallow = false;
        } else if (r > max_c && g < min_c && b > max_c) {
            disallow = false;
        } else if (r < min_c && g > max_c && b > max_c) {
            disallow = false;
        } else if (r > max_c && g < min_c && b < min_c) {
            disallow = false;
        } else if (r < min_c && g < min_c && b > max_c) {
            disallow = false;
        } else if (r < min_c && g < min_c && b > max_c) {
            disallow = false;
        }
        
        return disallow;
    },
    createColor = function() {
        // @TODO use object data 
        var r = 0, g = 0, b = 0, a, c;
        while (colorDisapprove(r, g, b)) {
            r = Math.random();
            g = Math.random();
            b = Math.random();
        }
        a = Math.random()* Math.random();
        c = new RgbColor(r, g, b, a);
    
        return c;
    },
    addPolygon = function() {
        var poly, point, size, color;
        point = createLocation();
        size = Math.random();
        //size = Math.abs(9 * Math.pow(size, 4) - 12 * Math.pow(size, 3) + 3 * Math.pow(size, 2));
        size = Math.round(6 + (size * gr * 30));
        if (logger[size]) {
            logger[size]++;
        } else {
            logger[size] = 1;
        }
        color = createColor();
        poly = new Path.RegularPolygon(point, poly_count, size);
        poly.fillColor = color;
    },
    setSize = function(cx, cy) {
        x = cx;
        y = cy;
    };
    
    // Publuc functions
    //------------------
    // Read canvas size
    d.canvasSize = function() {
        var c = $('canvas');
        setSize(c.width(), c.height());
    };
    // Draw the polygons
    d.draw = function(repeats) {
        var i;
        for (i = 0;i < repeats; i++) {
            addPolygon();
        }
        // console.log(logger);
    };
    d.updatePolyForm = function(sides) {
        poly_count = sides;
    };
    // Save the tapestry as an image
    d.save = function() {
        var canvas, img;
        canvas = document.getElementById("pappoly");
        img = canvas.toDataURL("image/png");
        //img = canvas.toDataURL(save_mime);
        document.location.href = img.replace("image/png", save_mime);
    }
    return d;
})(this, this.document);

// Installing paper on the global scope
paper.install(window);

var Controller = (function(window, document, undefined) {
    var track,
        c = {},
        sides = {
            min: 3,
            max: 12,
            step: 1,
            pixels: 0
        },
        num = {
            min: 1,
            max: 10000,
            step: 100,
            pixels: 0
        },
        mtrack = {
            prev: 0,
            cur: 0,
            delta: 0
        },
        pos,
        item,
        leftFromPx = function(lft) {
            var str, len;
            len = lft.length;
            str = lft.substring(0, len - 2);
            // Creating an integer
            return parseInt(str, 10);
        }
        tracking = false;
    // Public functions
    c.init = function() {
        max_pos = $('.slider').width();
        sides.pixels = max_pos / ((sides.max - sides.min) / sides.step);
        num.pixels = max_pos / ((num.max - num.min) / num.step);
        $('.position').mousedown(function(event) {
            tracking = this;
            mtrack.prev = event.pageX;
            $(tracking).mousemove(function(e) {
                console.log(e);
                mtrack.cur = e.pageX;
                mtrack.delta = mtrack.cur - mtrack.prev;
                mtrack.prev = mtrack.cur;
                if (mtrack.delta) {
                    pos = leftFromPx($(tracking).css('left'));
                    console.log(pos);
                    console.log(mtrack.delta);
                    pos += mtrack.delta;
                    console.log(pos);
                    $(tracking).css('left', pos);
                }
            });
        });
        $('body').mouseup(function(event) {
            tracking = false;
            $('.position').unbind('mousemove');
        });
    };
    
    c.snapshot = function() {
        var stats = {};
        
        return stats;
    }
    return c;
})(this, this.document);

$(function() {
    var canvas;
    function draw() {
        var num = 2000,
            sides = 6;
        Drawer.updatePolyForm(sides);
        Drawer.draw(num);
        view.draw();
    }
    function redraw() {
        var layer;
        project.activeLayer.remove(); 
        layer = new Layer(); 
        draw();
    }

    Controller.init();
    // Get a reference to the canvas object
    canvas = document.getElementById('pappoly');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    Drawer.canvasSize();

    // Draw
    draw();
    $('#pappoly').click(function(event) {
        redraw();
    });    
    $("#save").click(function() {
        Drawer.save();
    });
});

function showModal() {
  //add modal background
  $('<div />').addClass('lightbox_bg').appendTo('body').show();
  //add modal window
  $('<div />').text('I am your modal example').addClass('modal').appendTo('body');
}
