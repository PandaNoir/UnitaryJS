function Canvas(id) {
    var canvas = document.getElementById(id);
    this.canvas = canvas.getContext('2d');
    this.canvasHeight = canvas.height;
    this.canvasWidth = canvas.width;
    this.id = id;
    this.objects = [];
    this.mode = 'graph';
    this.origin = new Unitary.Point(0, 0);
};
Canvas.fn = Canvas.prototype;
Canvas.fn.add = function(obj) {
    this.objects.push(obj);
};
Canvas.fn.X = function(x) {
    var res = x + this.origin.x;
    // if (this.mode === 'normal') {
    //     return res;
    // }
    return Math.round(res);
};
Canvas.fn.Y = function(y) {
    var res = this.canvasHeight - (y + this.origin.y);
    if (this.mode === 'normal') {
        res = y + this.origin.y;
    }
    return Math.round(res);
};
Canvas.fn.draw = function() {
    for (var i = 0, _i = this.objects.length; i < _i; i = 0|i+1) {
        var obj = this.objects[i];
        this.canvas.strokeStyle = '#000';
        this.canvas.fillStyle = '#000';
        if (obj.fillColor !== null) {
            var beforeFillColor = this.canvas.fillStyle;
            this.canvas.fillStyle = obj.fillColor;
        }
        if (obj.strokeColor !== null) {
            var beforeStrokeColor = this.canvas.strokeStyle;
            this.canvas.strokeStyle = obj.strokeColor;
        }
        var name = obj.name();
        Canvas.drawFunction[name].call(this, obj);
        if (obj.fillColor !== null) {this.canvas.fillStyle = beforeFillColor;}
        if (obj.strokeColor !== null) {this.canvas.strokeStyle = beforeStrokeColor;}
    }
};
Canvas.drawFunction = {
    Segment: function(obj) {
        this.canvas.beginPath();
        this.canvas.moveTo(this.X(obj.points[0].x), this.Y(obj.points[0].y));
        this.canvas.lineTo(this.X(obj.points[1].x), this.Y(obj.points[1].y));
        this.canvas.closePath();
        this.canvas.stroke();
    },
    Line: function(obj) {
        this.canvas.beginPath();
        if (obj.b === 0) {
            this.canvas.moveTo(this.X(-obj.c), 0);
            this.canvas.lineTo(this.X(-obj.c), this.canvasHeight);
        } else {
            this.canvas.moveTo(0, this.Y(-(obj.c / obj.b)));
            this.canvas.lineTo(this.canvasWidth, this.Y(-(obj.a * this.canvasWidth + obj.c) / obj.b));
        }
        this.canvas.closePath();
        this.canvas.stroke();
    },
    Circle: function(obj) {
        var O = obj.Origin,
        r = obj.r;
        this.canvas.beginPath();
        this.canvas.arc(this.X(O.x), this.Y(O.y), r, 0, 2 * Math.PI, false);
        this.canvas.closePath();
        this.canvas.stroke();
        if (obj.fillColor !== null) this.canvas.fill();
    },
    Polygon: PolygonDrawFunction,
    Quadrilateral: PolygonDrawFunction,
    Triangle: PolygonDrawFunction,
    Rect: function(obj) {
        var x = this.X(obj.points[0].x);
        var y = this.Y(obj.points[0].y);
        var w = obj.points[1].x - obj.points[0].x;
        var h = - (obj.points[1].y - obj.points[0].y); // 左下を原点として扱っているからマイナスしないと計算があわない
        this.canvas.strokeRect(x, y, w, h); // 上でX()、Y()している
        if (obj.fillColor !== null) this.canvas.fill();
    },
    Text: function(obj) {
        this.canvas.textAlign = obj.align;
        this.canvas.textBaseline = obj.baseline;
        var x = obj.P.x;
        var y = obj.P.y;
        if (obj.font !== null) {
            var defaultFont = this.canvas.font;
            this.canvas.font = obj.font;
        }
        if (obj.maxWidth === null) {
            if (obj.strokesOutline) {
                this.canvas.strokeText(obj.text, this.X(x), this.Y(y));
            }
            this.canvas.fillText(obj.text, this.X(x), this.Y(y));
        } else {
            if (obj.strokesOutline) {
                this.canvas.strokeText(obj.text, this.X(x), this.Y(y), obj.maxWidth);
            }
            this.canvas.fillText(obj.text, this.X(x), this.Y(y), obj.maxWidth);
        }
        if(obj.font !== null) {
            this.canvas.font = defaultFont;
        }
    },
    Point: function(obj) {
        this.canvas.fillRect(this.X(obj.x), this.Y(obj.y), 1, 1);
    },
    Image: function(obj) {
        if (obj.dx !== null && obj.sx !== null) {
            this.canvas.drawImage(obj.src, obj.sx, obj.sy, obj.sw, obj.sh, this.X(obj.dx), this.Y(obj.dy), obj.dw, obj.dh);
        } else if (obj.dx !== null && obj.sx === null && obj.dw !== null) {
            this.canvas.drawImage(obj.src, this.X(obj.dx), this.Y(obj.dy), obj.dw, obj.dh);
        } else if (obj.dx !== null && obj.dw === null) {
            // obj.sx !== null ならば必ず obj.dw !== nullとなるから、
            // 対偶をとり obj.dw === nullならばobj.sx === null
            var image = new Image();
            image.src = obj.src;
            image.onload = function() {
                this.canvas.drawImage(image, this.X(obj.dx), this.Y(obj.dy));
            }.bind(this);
        } else if (obj.dx === null) {
            this.canvas.drawImage(obj.src);
        }
    },
    Graph: function(obj) {
        this.canvas.beginPath();
        var start = obj.start , end = obj.end;
        if (start === null) {
            start = -this.origin.x;
        }
        if (end === null) {
            end = this.canvasWidth - this.origin.x;
        }
        var points = [];
        for (var i = start; i <= end; i = 0|i+1) {
            points[points.length] = new Unitary.Point(i, obj.f(i / obj.scale) * obj.scale);
        }
        this.canvas.moveTo(this.X(points[0].x), this.Y(points[0].y));
        for (var i = 0, _i = points.length; i < _i; i = 0|i+1) {
            this.canvas.lineTo(this.X(points[i].x), this.Y(points[i].y));
        }
        this.canvas.moveTo(this.X(points[0].x), this.Y(points[0].y));
        this.canvas.closePath();
        this.canvas.stroke();
    }
}
Canvas.fn.toDataURL = function() {
    return document.getElementById(this.id).toDataURL();
};
function PolygonDrawFunction(obj) {
    this.canvas.beginPath();
    this.canvas.moveTo(this.X(obj.points[0].x), this.Y(obj.points[0].y));
    for (var i = 0, _i = obj.points.length; i < _i; i = 0|i+1) {
        this.canvas.lineTo(this.X(obj.points[i].x), this.Y(obj.points[i].y));
    }
    this.canvas.lineTo(this.X(obj.points[0].x), this.Y(obj.points[0].y));
    this.canvas.closePath();
    this.canvas.stroke();
    if (obj.fillColor !== null) this.canvas.fill();
};
if (!Function.prototype.bind) {
    Function.prototype.bind = function (oThis) {
        if (typeof this !== "function") {
            // closest thing possible to the ECMAScript 5
            // internal IsCallable function
            throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
        }

    var aArgs = Array.prototype.slice.call(arguments, 1), 
        fToBind = this, 
        fNOP = function () {},
        fBound = function () {
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
