/*jshint jquery: false, browser: false, debug: false */
/*global $:false, paper:false, Layer:false, RgbColor: false, Path: false, Point: false */
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
        createHslColor = function() {
            return false;
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
        };
        o.setRgbColorPref = function(c) {
            color_rgb_pref = c;
        };
        o.setRgbColorPrefCur = function(cur) {
            color_rgb_pref.cur = cur;
        };
        o.getRgbPrefColor = function() {
            return color_rgb_pref[color_rgb_pref[color_rgb_pref.cur]];
        };
        return o; 
    },
    Worksheet = function() {
        var w = {
            canvas: false,
            save_mime: "image/octet-stream",
            color: new Color(),
            gr: 1.61803399,
            
            init: function(canvas_id) {
                this.canvas = document.getElementById(canvas_id);
                this.fs = [$(document).width(), $(document).height()];
                // Custom preparation if needed
                this.prepare();
            },
            clearCanvas: function(view_id) {
                var layer;
                paper.projects[view_id].activate();
                if (paper.views) {
                    paper.views[view_id].activate();
                }
                paper.project.activeLayer.remove(); 
                layer = new Layer(); 
            },
            canvasSize: function() {
                var x, y;
                x = this.canvas.width;
                y = this.canvas.height;
                return [x,y];
            },
            save: function() {
                var img;
                img = this.canvas.toDataURL("image/png");
                document.location.href = img.replace("image/png", this.save_mime);
            }
        };
        return w;
    },
    dots, polys, circledots, circlerays, circlespread;
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
            var circle = new Path.Circle(point, size);
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
            px = Math.round(Math.random() * (this.x + this.offset * 2) - this.offset);
            py = Math.round(Math.random() * (this.y + this.offset * 2) - this.offset);
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
            poly = new Path.RegularPolygon(point, this.sides, size);
            poly.fillColor = c;
        };
        this.updateSize = function(view_id, size) {
            paper.projects[view_id].view.viewSize = new paper.Size(size[0], size[1]);
            this.x = size[0];
            this.y = size[1];
        };
        this.setSize = function() {
            var c = $(this.canvas);
            this.x = c.width();
            this.y = c.height();
        };
        this.updateFromPolyForm = function() {
            this.num = parseInt($('#num').val(), 10);
            this.sides = parseInt($('#sides').val(), 10);
        }; 
        this.prepare = function() {
            this.setSize();
            this.updateFromPolyForm();
        };
        // Draw the polygons
        this.draw = function(view_id) {
            var i;
            this.clearCanvas(view_id);
            for (i = 0;i < this.num; i++) {
                this.addPolygon();
            }
            paper.projects[view_id].view.draw();
        };
        this.updateValue = function(field, val) {
            if (field == 'num') {
                this.num = val;
            } else if (field == 'sides') {
                this.sides = val;
            } else if (field =='colorpref') {
                this.color.setRgbColorPrefCur(val);
                $('#colorprefshow').css('background-color', this.color.getRgbPrefColor);
            }
        };
        this.getCanvasSize = function(t) {
               return this.sizes[t];
        };        
    }).apply(polys);
    circledots = new Worksheet();
    (function() {
        this.center_x = 0;
        this.center_y = 0;
        this.radius = 0;
        this.dot_size = 0;
        this.dot_count = 0;
        this.superimpose = true;  // Wether to allow dots to overlap or not
        this.dots = [];
        this.superimpose_max_tries = 1000;  // To make sure the code does not deadlock, this is a limit on the attepmts to find a location
        
        this.prepare = function() {
            var center;
            // Calculating the center point for the canvas
            center = this.canvasSize();
            this.center_x = center[0] / 2;
            this.center_y = center[1] / 2;
            // Setting defaults for radius, and dots
            this.radius = Math.round(this.center_x * 0.8);
            this.dot_size = 6;
            this.dot_count = 42*5;
            
        };
        this.createLocation = function () {
            var theta, dist, x, y;
            // Creating a random location
            theta = 2 * Math.PI * Math.random();
            dist = Math.random() + Math.random();
            if (dist > 1) {
                dist = 2 - dist;
            }
            // Changing from normalized distance to actual
            dist = dist * this.radius;
            // Conveting angle / distanct to x,y on the canvas
            x = Math.round(dist * Math.cos(theta) + this.center_x);
            y = Math.round(dist * Math.sin(theta) + this.center_y);
            // Returng an x,y array
            return [x, y];
        };
        this.testCollision = function(loc) {
            // Tests if loc collides with another circle
            var i, dot_distance = this.dot_size * 2;
            for (i = 0;i < this.dots.length;i++) {
                if (Math.abs(loc[0] - this.dots[i][0]) < dot_distance && Math.abs(loc[1] - this.dots[i][1]) < dot_distance) {
                    return true;
                }
            }
            return false;
        };
        this.addDotInCircle = function () {
            var loc, p, c, i = 0;
            loc = this.createLocation();
            while (this.testCollision(loc) && this.superimpose && i++ < this.superimpose_max_tries) {
                loc = this.createLocation();
            }
            // At the moment if no location is found, the dot is not set. This could be turned into a setting
            if (i < this.superimpose_max_tries) {
                this.dots.push(loc);
                // Placing the dot
                p = new Path.Circle(new Point(loc[0], loc[1]), this.dot_size);
                c = new RgbColor(0.1, 0.1, 0.1, 0.9);  // this.color.createColor('Rgb');
                p.fillColor = c;
            }
        };
        this.draw = function(view_id) {
            var i;
            this.dots = []; // Emptying the dots array
            this.clearCanvas(view_id);
            for (i = 0;i < this.dot_count; i++) {
                this.addDotInCircle();
            }
            paper.projects[view_id].view.draw();
        }; 
        
    }).apply(circledots);
    circlerays = new Worksheet();
    (function() {
        this.center_x = 0;
        this.center_y = 0;
        this.line_length = 0;
        this.line_count = 0;
        this.line_length = 0;
        this.line_thickness = 0;
        this.color_spread = 0;  // This will be added later to allow for some color shifting in the line
        this.superimpose = true;  // Wether to allow dots to overlap or not
        this.lines = [];
        this.superimpose_max_tries = 1000;  // To make sure the code does not deadlock, this is a limit on the attepmts to find a location
        this.range_from_center = {min: 0, max: 0};
        
        this.prepare = function() {
            var center;
            // Calculating the center point for the canvas
            center = this.canvasSize();
            this.center_x = center[0] / 2;
            this.center_y = center[1] / 2;
            this.line_count = 150;
            this.line_length = 180;
            this.line_thickness = 2;
            this.range_from_center.min = 10;
            this.range_from_center.max = 80;
        };
        this.draw = function(view_id) {
            var i;
            this.lines = []; // Emptying the dots array
            this.clearCanvas(view_id);
            for (i = 0;i < this.line_count; i++) {
                this.addLine();
            }
            paper.projects[view_id].view.draw();
        };
        this.addLine = function() {
            var loc, p, i = 0;
            loc = this.createLocation();
            // while (this.testCollision(loc) && this.superimpose && i++ < this.superimpose_max_tries) {
//                 loc = this.createLocation();
//             }
            // At the moment if no location is found, the dot is not set. This could be turned into a setting
            if (i < this.superimpose_max_tries) {
                this.lines.push(loc);
                // Placing the dot
                p = new Path.Line(loc);
            }
        };
        this.createLocation = function () {
            var theta, dist, x, y, loc = {strokeColor: 'black', strokeWidth: this.line_thickness};
            // Creating a random location
            theta = 2 * Math.PI * Math.random();
            dist = Math.round((this.range_from_center.max - this.range_from_center.min) * Math.random() + this.range_from_center.min);
            
            // Conveting angle / distanct to x,y on the canvas
            x = Math.round(dist * Math.cos(theta) + this.center_x);
            y = Math.round(dist * Math.sin(theta) + this.center_y);
            loc.from = [x,y];
            x = Math.round(this.line_length * Math.cos(theta) + x);
            y = Math.round(this.line_length * Math.sin(theta) + y);
            loc.to = [x,y];
            // Returng an x,y array
            return loc;
        };
    }).apply(circlerays);
    circlespread = new Worksheet();
    (function() {
        this.center_x = 0;
        this.center_y = 0;
        this.base_form_corners = 0;
        this.base_form_size = 200;
        this.first_level_size = 0;
        this.first_level_width = 0;
        this.size_scale = 0;
        this.width_scale = 0;
        this.stop_size = 1;
        
        this.prepare = function() {
            var center = this.canvasSize();
            this.center_x = center[0] / 2;
            this.center_y = center[1] / 2;
            this.base_form_corners = 3;
            this.first_level_size = 250;
            this.first_level_width = 10;
            this.size_scale = 0.8;
            this.width_scale = 0.8;
        };
        this.draw = function(view_id) {
            var size = this.first_level_size,
                wdt = this.first_level_width,
                form_size = this.base_form_size;
            this.clearCanvas(view_id);
            while (size > this.stop_size) {
                this.drawLevel(size, wdt, form_size);
                size *= this.size_scale;
                wdt *= this.width_scale;
                form_size *= this.size_scale;
            }
            paper.projects[view_id].view.draw();
        };
        this.drawLevel = function(size, wdt, form_size) {
            // Draws a level Starting by figuring out the center of the circles,
            // Then drawing them
            var angle_step = Math.PI * 2 / this.base_form_corners,
                theta = 0,
                i, x, y, p;
            for (i = 0; i < this.base_form_corners; i++) {
                theta = angle_step * i;
                x = Math.round(form_size * Math.cos(theta) + this.center_x);
                y = Math.round(form_size * Math.sin(theta) + this.center_y);
                p = new Path.Circle(new Point(x, y), size);
            }
            
        };
    }).apply(circlespread);

    // Exposing
    a.dots = dots;
    a.polys = polys;
    a.circledots = circledots;
    a.circlerays = circlerays;
    a.circlespread = circlespread;
    return a;
})(this, this.document);


// Installing paper on the global scope and creating's paper scope.
paper.install(window);
//paper = new paper.PaperScope(); 
$(function() {
    var pappoly, papdots, papcircledots;
    // Get a reference to the canvas object
    pappoly = document.getElementById('pappoly');
    papdots = document.getElementById('papdots');
    papcircledots = document.getElementById('papcircledots');
    papcirclerays = document.getElementById('papcirclerays');
    // Create an empty project and a view for the canvas:
    paper.setup(pappoly);
    paper.setup(papdots);
    paper.setup(papcircledots);
    paper.setup(papcirclerays);
    Art.polys.init('pappoly');
    Art.dots.init('papdots');
    Art.circledots.init('papcircledots');
    Art.circlerays.init('papcirclerays')
    // Draw
    Art.polys.draw(0);
    Art.dots.draw(1);
    Art.circledots.draw(2);
    Art.circlerays.draw(3);
    $('#pappoly').click(function(event) {
        Art.polys.draw(0);
    });
    $('#papdots').click(function(event) {
       Art.dots.draw(1);
    });
    $('#papcircledots').click(function(event) {
        Art.circledots.draw(2);
    });
    $('#papcirclerays').click(function(event) {
        Art.circlerays.draw(3);
    });
    $("#polysave").click(function() {
        Art.polys.save();
    });
    $('input[type=range]').change(function(e) {
        Art.polys.updateValue(e.srcElement.id, e.srcElement.valueAsNumber);
        Art.polys.draw(0);
    });
    $('#poly_fullscreen').click(function(e) {
        var size = [document.width, document.height];
        Art.polys.updateSize(0, size);
        Art.polys.draw(0);
        canvas = document.getElementById("pappoly");
        canvas.style["border"] = "0";
        canvas.style["position"] = "absolute";
        canvas.style['top'] = '0';
        canvas.style['left'] = '0';
        document.getElementById('container').style['margin-top'] = size[1];
        
    });
    
    // controls
    $('#sides').change(function () {
        $('#sides-label').html($(this).val());
    });
});

function showModal() {
  //add modal background
  $('<div />').addClass('lightbox_bg').appendTo('body').show();
  //add modal window
  $('<div />').text('I am your modal example').addClass('modal').appendTo('body');
}
