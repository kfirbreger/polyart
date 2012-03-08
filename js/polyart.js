var Dots = (function(window, document, paper, undefined) {
    var gr = 1.61803399,
        size_x,
        size_y,
        max_c = 0.6,
        min_c = 0.4,
        canvas,
        dot_size,
        grid = [],
        grid_size = 20,
    createDot = function(point, size, color) {
        circle = new Path.Circle(point, size);
        circle.fillColor = color;
    },
    makeGrid = function() {
        var max_x, max_y, i, j;
        max_x = canvas.width;
        max_y = canvas.height;
        for (i = grid_size;i < max_x; i += grid_size) {
            for (j = grid_size;j < max_y; j += grid_size) {
                grid.push([i,j]);
            }
        }
    },
    d = {},
    
    colorDisapprove = function(color) {
        var r = color.r,
            g = color.g,
            b = color.b,
            disallow = true;
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
        var color = {r: 0, g: 0, b: 0}, a, c;
        // Creating color
        while (colorDisapprove(color)) {
            color.r = Math.random();
            color.g = Math.random();
            color.b = Math.random();
        }
        a = Math.random();
        c = new RgbColor(color.r, color.g, color.b, a);
    
        return c;
    };
    
    d.init = function(canvas_id) {
        canvas = document.getElementById(canvas_id);
        paper.setup(canvas);
        makeGrid();
        dot_size = 6
    };
    d.draw = function() {
        var i, c, p;
        for (i = 0;i < grid.length; i++) {
            p = new Path.Circle(new Point(grid[i][0], grid[i][1]), dot_size);
            c = createColor();
            p.fillColor = c;
        }
        view.draw();
    };
    
    return d;
})(this, this.document, paper);

// Drawer object
var Drawer = (function(window, document, undefined) {
    var gr = 1.61803399,
        save_mime = "image/octet-stream",
        // @TODO use jQuery to get canvas size and calculate range
        x,
        y,
        offset = 50,
        max_c = 0.8,
        min_c = 0.2,
        alpha_constant = 0.8,
        logger = {},
        sides,
        num,
        sizes = {
            'iPhone': [320, 480],
            'iPhone4': [640, 960],
            'iPad': [768, 1024],
            'fs': [100, 100],
        }
        colorpref = {
            0: 'a',
            1: 'r',
            2: 'g',
            3: 'b',
            a: '#fff',
            r: '#f00',
            g: '#0f0',
            b: '#00f',
            cur: 0,
            weight: 0.25
        },
        d = {},
    // Private functions
    createLocation = function() {
        var px, py, p;
        px = Math.round(Math.random() * (x + offset * 2) - offset);
        py = Math.round(Math.random() * (y + offset * 2) - offset);
        p = new Point(px, py);
        return p;
    },
    colorDisapprove = function(color) {
        var r = color.r,
            g = color.g,
            b = color.b,
            disallow = true;
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
        var color = {r: 0, g: 0, b: 0}, a, c;
        // Creating color
        while (colorDisapprove(color)) {
            color.r = Math.random();
            color.g = Math.random();
            color.b = Math.random();
            // color preference
            if (colorpref.cur > 0) {
                color[colorpref[colorpref.cur]] = (color[colorpref[colorpref.cur]] + colorpref.weight) / (1 + colorpref.weight);
            }
        }
        
        a = Math.random()* Math.random();
        c = new RgbColor(color.r, color.g, color.b, a);
    
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
        poly = new Path.RegularPolygon(point, sides, size);
        poly.fillColor = color;
    },
    setSize = function() {
        var c = $('#pappoly');
        x = c.width();
        y = c.height();
    };
    
    // Publuc functions
    //------------------
    updateFromPolyForm = function() {
        num = parseInt($('#num').val(), 10);
        sides = parseInt($('#sides').val(), 10);
    };
    
    d.init = function() {
        this.prepare();
        sizes.fs = [$(document).width(), $(document).height()];
    };
    d.prepare = function() {
        setSize();
        updateFromPolyForm();
    }
    // Draw the polygons
    d.draw = function() {
        var i;
        for (i = 0;i < num; i++) {
            addPolygon();
        }
    };
    d.updateValue = function(field, val) {
        var c;
        if (field == 'num') {
            num = val;
        } else if (field == 'sides') {
            sides = val;
        } else if (field =='colorpref') {
            colorpref.cur = val;
            $('#colorprefshow').css('background-color', colorpref[colorpref[val]]);
        }
    }
    d.getCanvasSize = function(t) {
        return sizes[t];
    }
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

$(function() {
    var pappoly;
    function draw() {
        Drawer.draw();
        view.draw();
    }
    function redraw() {
        var layer;
        project.activeLayer.remove(); 
        layer = new Layer(); 
        draw();
    }

    // Get a reference to the canvas object
    pappoly = document.getElementById('pappoly');
    // Create an empty project and a view for the canvas:
    paper.setup(pappoly);
    Drawer.init();

    // Draw
    draw();
    
    //Dots.init('papdots');
    //Dots.draw();
    $('#pappoly').click(function(event) {
        redraw();
    });    
    $("#polysave").click(function() {
        Drawer.save();
    });
    $('input[type=range]').change(function(e) {
        Drawer.updateValue(e.srcElement.id, e.srcElement.valueAsNumber);
        redraw();
    });
    $('input[name=sizedef]').change(function(e) {
        var size = Drawer.getCanvasSize(e.srcElement.value),
            pappoly = document.getElementById('pappoly');
        console.log(size);
        pappoly.width = size[0];
        pappoly.height = size[1];
        paper.setup(pappoly);
        Drawer.prepare();
        redraw();
    });
});

function showModal() {
  //add modal background
  $('<div />').addClass('lightbox_bg').appendTo('body').show();
  //add modal window
  $('<div />').text('I am your modal example').addClass('modal').appendTo('body');
}
