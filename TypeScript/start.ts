// JavaScript syntax
// work with JavaScript code, popular JavaScript libs
// clean simple compiled JavaScript code, browser, node.js, ES3-comp.
//
// npm install -g typescript / tsc helloworld.ts

// static checking, symbol-based navigation, 
// statement completion, code refactoring
//
// but types are optional, type inference

class Point {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x; this.y = y; }

    dist() {
    	return Math.sqrt(this.x * this.x + this.y * this.y); }
}

var p = new Point(3, 4);
var dist = p.dist();

alert("Hypotenuse is: " + dist);