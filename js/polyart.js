// Handling color
var Color = (function(window, document, undefined) {
    var mins = [0,0,0],
        maxs = [1,1,1],
        color_rgb_pref = {
            0: 'a', 1: 'r', 2: 'g', 3: 'b',
            a: '#fff', r: '#f00', g: '#0f0', b: '#00f',
            cur: 0,weight: 0.25
        },
    // Internal functions
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
    
    createRgbColor = function() {
        // @TODO use object data
        var color = {r: 0, g: 0, b: 0}, a, c;
        // Creating color
        while (colorDisapprove(color)) {
            color.r = Math.random();
            color.g = Math.random();
            color.b = Math.random();
            // color preference
            if (color_rgb_pref.cur > 0) {
                color[color_rgb_pref[color_rgb_pref.cur]] = (color[color_rgb_pref[color_rgb_pref.cur]] + color_rgb_pref.weight) / (1 + color_rgb_pref.weight);
            }
        }
        
        a = Math.random()* Math.random();
        c = new RgbColor(color.r, color.g, color.b, a);
    
        return c;
        
    },
        o = {};
    
    o.createColor = function(colortype) {
        var color = false;
        // If no colortype is given going for rgb
        if (typeof(colortype) === "undefined") {
            colortype = 'Rgb';
        }
        if (colortype == 'Rgb') {
            color = createRgbColor();
        } else if (colortype == 'Hsl') {
            color = createHslColor();
        }
        return color;
    };
    o.setColorMin(minimums) {
        mins = minimums;
    };
    o.setColorMax(maximums) {
        maxs = maximums;
    };
    o.setWeight(wei) {
        // @TODO add checks and set non rgb weights
        color_rgb_pref.weight = wei;
    }
    
    return o; 
})(this, this.document);

var Worksheet = (function(window, document, undefined) {
    var sizes = {
            'iPhone': [320, 480],
            'iPhone4': [640, 960],
            'iPad': [768, 1024],
            'fs': [0, 0],
        },
        canvas,
        gr = 1.61803399,
        w = {};
        
    w.init = function(canvas_id) {
        canvas = document.getElementById(canvas_id);
        sizes.fs = [$(document).width(), $(document).height()];
        // Custom preparation if needed
        prepare();
    };
    w.clearCanvas = function(view_id) {
        var layer;
        paper.projects[view_id].activate();
        paper.views[view_id].activate();
        paper.project.activeLayer.remove(); 
        layer = new Layer(); 
    };
    w.canvasSize = function() {
        var x,y;
        x = canvas.width;
        y = canvas.height;
        return [x,y];
    }
    return w;
})(this, this.document);

var Dots = (function(window, document, undefined) {
    var w = new Worksheet(),
        color = new Color(),
        dot_size,
        grid = [],
        grid_size = 30,
    createDot = function(point, size, color) {
        circle = new Path.Circle(point, size);
        circle.fillColor = color;
    },
    makeGrid = function() {
        var max_x, max_y, i, j;
        [max_x, max_y] = w.canvasSize();
        for (i = grid_size;i < max_x; i += grid_size) {
            for (j = grid_size;j < max_y; j += grid_size) {
                grid.push([i,j]);
            }
        }
    },
    d = {},
    
    d.init = function(canvas_id) {
        w.init(canvas_id);
        makeGrid();
        dot_size = 6
    };
    d.draw = function(view_id) {
        var i, c, p;
        w.clearCanvas();
        for (i = 0;i < grid.length; i++) {
            p = new Path.Circle(new Point(grid[i][0], grid[i][1]), dot_size);
            c = color.createColor('Rgb');
            p.fillColor = c;
        }
        paper.view.draw();
    };
    
    return d;
})(this, this.document);

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
    d.draw = function(proj_id) {
        var i, layer;
        paper.projects[proj_id].activate();
        paper.views[proj_id].activate();
        paper.project.activeLayer.remove(); 
        layer = new Layer(); 
        for (i = 0;i < num; i++) {
            addPolygon();
        }
        paper.view.draw();
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

// Installing paper on the global scope and creating's paper scope.
paper.install(window);
paper = new paper.PaperScope(); 
$(function() {
    var pappoly, papdots;

    // Get a reference to the canvas object
    pappoly = document.getElementById('pappoly');
    papdots = document.getElementById('papdots');
    // Create an empty project and a view for the canvas:
    paper.setup(pappoly);
    paper.setup(papdots);
    Dots.init('papdots');
    Drawer.init();
    
    // Draw
    Drawer.draw(0);
    Dots.draw(1);
    $('#pappoly').click(function(event) {
        Drawer.draw(0);
    });
    $('#papdots').click(function(event) {
       Dots.draw(1); 
    });
    $("#polysave").click(function() {
        Drawer.save();
    });
    $('input[type=range]').change(function(e) {
        Drawer.updateValue(e.srcElement.id, e.srcElement.valueAsNumber);
        Drawer.draw(0);
    });
    $('input[name=sizedef]').change(function(e) {
        var size = Drawer.getCanvasSize(e.srcElement.value),
            pappoly = document.getElementById('pappoly');
        pappoly.width = size[0];
        pappoly.height = size[1];
        Drawer.prepare();
        Drawer.draw(0);
    });
});

function showModal() {
  //add modal background
  $('<div />').addClass('lightbox_bg').appendTo('body').show();
  //add modal window
  $('<div />').text('I am your modal example').addClass('modal').appendTo('body');
}
