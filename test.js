(function(global){
    var Unitary = require('./unitary.js');
    for (var key in Unitary) {
        global[key] = Unitary[key];
    }
    var A, AB, B, C, D, SegAB;
    A = new Point(3, 3);
    B = new Point(0, 0);
    C = new Point(4, 5);
    D = new Point(1, 1);
    AB = new Line(A, B);
    SegAB = new Segment(A, B);

    console.log(new Vector.from(A, B));
    console.log(new Vector.from(B, A).add(new Vector.from(D, C)));
    console.log(new Vector(3, 4).add(new Vector(-10, 7)));
    console.log(new Vector(3, 3).product(new Vector(-3, 3)) === 0);
    console.log(new Vector(1, 3).product(new Vector(7, 10)) === 37);
    console.log(distance(AB, C) === 0.7071067811865475);
    console.log(distance(A, C) === 2.23606797749979);
    console.log(distance(B, C) === 6.4031242374328485);
    console.log(SegAB.has(A) === true);
    console.log(SegAB.has(B) === true);
    console.log(SegAB.has(C) === false);
    console.log(SegAB.has(D) === true);
    console.log(A.toString() === '(3, 3)');
    console.log(A.move(1, 1).toString() === '(4, 4)');
    console.log(A.move(-1, -1).toString() === '(2, 2)');
    console.log(A.moveX(1).toString() === '(4, 3)');
    console.log(A.moveX(-1).toString() === '(2, 3)');
    console.log(A.moveY(1).toString() === '(3, 4)');
    console.log(A.moveY(-1).toString() === '(3, 2)');
    console.log(A.moveTo(9, 9).toString() === '(9, 9)');
    console.log(new Line(new Point(0, 0), new Point(0, 10)).getIntersection(new Line(new Point(10,0), new Point(10,10))) === false);
    console.log(new Line(new Point(0, 0), new Point(10, 0)).getIntersection(new Line(new Point(0,10), new Point(10,10))) === false);
    console.log(equals(new Line(new Point(0, 0), new Point(0, 10)).getIntersection(new Line(new Point(5,10), new Point(10,10))), new Point(0, 10)));
    console.log(new Line(new Point(0, 0), new Point(10, 10)).getIntersection(new Line(new Point(0, 0), new Point(10,10))) === false);
    console.log(equals(new Line(new Point(0, 0), new Point(10, 10)).getIntersection(new Line(new Point(0, 20), new Point(1,19))), new Point(10, 10)));
})((this || 0).self || global);
