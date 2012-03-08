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
        var max_x, max_y;
        max_X = canvas.width;
        
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
        sides,
        num,
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
        poly = new Path.RegularPolygon(point, sides, size);
        poly.fillColor = color;
    },
    setSize = function() {
        var c = $('canvas');
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
        setSize();
        updateFromPolyForm();
    };
    // Draw the polygons
    d.draw = function() {
        var i;
        for (i = 0;i < num; i++) {
            addPolygon();
        }
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

$(function() {
    var canvas;
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
    canvas = document.getElementById('pappoly');
    // Create an empty project and a view for the canvas:
    paper.setup(canvas);
    Drawer.init();

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
