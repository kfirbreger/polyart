var Art = (function(window, document, undefined) {
    // Handling color
    var a = {},
    Color = function() {
        var mins = [0.2,0.2,0.2],
            maxs = [0.8,0.8,0.8],
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
            if (r > maxs[0] && g > maxs[1] && b > maxs[2]) {
                disallow = false;
            } else if (r > maxs[0] && g > maxs[1] && b < mins[2]) {
                disallow = false;
            } else if (r > maxs[0] && g < mins[1] && b > maxs[2]) {
                disallow = false;
            } else if (r < mins[0] && g > maxs[1] && b > maxs[2]) {
                disallow = false;
            } else if (r > maxs[0] && g < mins[1] && b < mins[2]) {
                disallow = false;
            } else if (r < mins[0] && g < mins[1] && b > maxs[2]) {
                disallow = false;
            } else if (r < mins[0] && g < mins[1] && b > maxs[2]) {
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
        o.setColorMin = function(minimums) {
            mins = minimums;
        };
        o.setColorMax = function(maximums) {
            maxs = maximums;
        };
        o.setWeight = function(wei) {
            // @TODO add checks and set non rgb weights
            color_rgb_pref.weight = wei;
        }
        o.setRgbColorPref = function(c) {
            color_rgb_pref = c
        }
        o.setRgbColorPrefCur = function(cur) {
            color_rgb_pref.cur = cur;
        }
        o.getRgbPrefColor = function() {
            return color_rgb_pref[color_rgb_pref[color_rgb_pref.cur]];
        }
        return o; 
    },
    Worksheet = function() {
        var w = {
            sizes: {
                'iPhone': [320, 480],
                'iPhone4': [640, 960],
                'iPad': [768, 1024],
                'fs': [0, 0],
            },
            canvas: false,
            save_mime: "image/octet-stream",
            color: new Color(),
            gr: 1.61803399,
            
            init: function(canvas_id) {
                this.canvas = document.getElementById(canvas_id);
                this.sizes.fs = [$(document).width(), $(document).height()];
                // Custom preparation if needed
                this.prepare();
            },
            clearCanvas: function(view_id) {
                var layer;
                paper.projects[view_id].activate();
                paper.views[view_id].activate();
                paper.project.activeLayer.remove(); 
                layer = new Layer(); 
            },
            canvasSize: function() {
                var x,y;
                x = this.canvas.width;
                y = this.canvas.height;
                return [x,y];
            },
            save: function() {
                var img;
                img = this.canvas.toDataURL("image/png");
                document.location.href = img.replace("image/png", save_mime);
            }
        }
        return w;
    },
    dots, polys;
    // Creating an object per worksheet and adding its specific functions
    //----------------------------------------------------------------------
    // Creating dots
    dots = new Worksheet();
    // Injecting
    (function () {
        this.dot_size = 6;
        this.grid = [];
        this.grid_size = 30;
        this.prepare = function() {
            this.makeGrid();
        };
        this.createDot = function(point, size, color) {
            circle = new Path.Circle(point, size);
            circle.fillColor = color;
        };
        this.makeGrid = function() {
            var max_x, max_y, i, j;
            max_x = this.canvasSize();
            max_y = max_x[1];
            max_x = max_x[0];
            for (i = this.grid_size;i < max_x; i += this.grid_size) {
                for (j = this.grid_size;j < max_y; j += this.grid_size) {
                    this.grid.push([i,j]);
                }
            }
        };
        this.draw = function(view_id) {
            var i, c, p;
            this.clearCanvas(view_id);
            for (i = 0;i < this.grid.length; i++) {
                p = new Path.Circle(new Point(this.grid[i][0], this.grid[i][1]), this.dot_size);
                c = this.color.createColor('Rgb');
                p.fillColor = c;
            }
            paper.view.draw();
        };
    }).apply(dots);
    polys = new Worksheet();
    (function () {
        this.x = 0;
        this.y = 0;
        this.offset = 50;
        this.sides = 6;
        this.num = 2000;

        this.createLocation = function() {
            var px, py, p;
            px = Math.round(Math.random() * (x + this.offset * 2) - this.offset);
            py = Math.round(Math.random() * (y + this.offset * 2) - this.offset);
            p = new Point(px, py);
            return p;
        };
        this.addPolygon = function() {
            var poly, point, size, c;
            point = this.createLocation();
            size = Math.random();
            //size = Math.abs(9 * Math.pow(size, 4) - 12 * Math.pow(size, 3) + 3 * Math.pow(size, 2));
            size = Math.round(6 + (size * this.gr * 30));
            c = this.color.createColor();
            poly = new Path.RegularPolygon(point, sides, size);
            poly.fillColor = c;
        };
        this.setSize = function() {
            var c = $(this.canvas);
            x = c.width();
            y = c.height();
        };
        this.updateFromPolyForm = function() {
            num = parseInt($('#num').val(), 10);
            sides = parseInt($('#sides').val(), 10);
        };    
        this.prepare = function() {
            this.setSize();
            this.updateFromPolyForm();
        };
        // Draw the polygons
        this.draw = function(view_id) {
            var i;
            this.clearCanvas(view_id);
            for (i = 0;i < num; i++) {
                this.addPolygon();
            }
            paper.view.draw();
        };
        this.updateValue = function(field, val) {
            var c;
            if (field == 'num') {
                num = val;
            } else if (field == 'sides') {
                sides = val;
            } else if (field =='colorpref') {
                this.color.setRgbColorPrefCur(val);
                $('#colorprefshow').css('background-color', this.color.getRgbPrefColor);
            }
        };
        this.getCanvasSize = function(t) {
               return this.sizes[t];
        };        
    }).apply(polys);

    // Exposing
    a.dots = dots;
    a.polys = polys;
    return a;
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
    Art.polys.init('pappoly');
    Art.dots.init('papdots');
    
    // Draw
    Art.polys.draw(0);
    Art.dots.draw(1);
    $('#pappoly').click(function(event) {
        Art.polys.draw(0);
    });
    $('#papdots').click(function(event) {
       Art.dots.draw(1);
    });
    $("#polysave").click(function() {
        Art.polys.save();
    });
    $('input[type=range]').change(function(e) {
        Art.polys.updateValue(e.srcElement.id, e.srcElement.valueAsNumber);
        Art.polys.draw(0);
    });
    $('input[name=sizedef]').change(function(e) {
        var size = Art.polys.getCanvasSize(e.srcElement.value),
            pappoly = document.getElementById('pappoly');
        pappoly.width = size[0];
        pappoly.height = size[1];
        Art.polys.prepare();
        Art.polys.draw(0);
    });
});

function showModal() {
  //add modal background
  $('<div />').addClass('lightbox_bg').appendTo('body').show();
  //add modal window
  $('<div />').text('I am your modal example').addClass('modal').appendTo('body');
}
