// drawer object
var drawer = (function(window, document, undefined) {
    var gr = 1.61803399,
        // @TODO use jQuery to get canvas size and calculate range
        x = 500,
        y = 800,
        offset = 50,
        max_c = 0.8,
        min_c = 0.2,
        alpha_constant = 0.8,
        logger = {},
        poly_count,
        d = {};
    // Private functions
    function createLocation() {
        var px, py, p;
        px = Math.round(Math.random() * (x + offset * 2) - offset);
        py = Math.round(Math.random() * (y + offset * 2) - offset);
        p = new Point(px, py);
        return p;
    }
    
    function colorDisapprove(r, g, b) {
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
    }
    
    function createColor() {
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
    }

    function addPolygon() {
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
    }
    function setSize(cx, cy) {
        x = cx;
        y = cy;
    }
    // Publuc functions
    d.canvasSize = function() {
        var c = $('canvas');
        setSize(c.width(), c.height());
    };
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
    return d;
})(this, this.document);

// Installing paper on the global scope
paper.install(window);

$(function() {
    var canvas;
    function draw() {
        var num = 2000,
            sides = 6;
        drawer.updatePolyForm(sides);
        drawer.draw(num);
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
    drawer.canvasSize();

    // Draw
    draw();
    $('#pappoly').click(function(event) {
        redraw();
    });    
});

