
// CLASSES

// ECMAScript 6 class-based OOP
class Greeter {
	greeting : string;
	constructor(message : string) {
		this.greeting = message; }
	greet() { return "Hello, " + this.greeting; }
}
var greeter = new Greeter("world");
// INHERITANCE @ C++/Java
class Animal {
	name : string;
	constructor(the_name : string) { this.name = the_name }
	move(meters : number = 0) { alert(this.name + " moved " + meters + "m."); }
}
class Snake extends Animal {
	constructor(name : string) { super(name); }
	move(meters = 5) { // method overriding
		alert('Slithering...');
		super.move(meters);
	}
}
class Horse extends Animal {
	constructor(name : string) { super(name); }
	move(meters = 45) {
		alert('Galloping ...');
		super.move(meters);
	}
}
var sam = new Snake('Sammy the Python');
var tom : Animal = new Horse('Tommy the Palomino');
sam.move();
tom.move(34);
// PUBLIC/PRIVATE @ Java/C#
// in TypeScript, member is public by default
class Animal_with_private {
	private name : string;
	constructor(the_name : string) { this.name = the_name; }
	move (meters : number) {
		alert(this.name + ' moved ' + meters + 'm.'); }
}
// TypeScript is a structural type system
// comparison of two types is based on member compatible
// but for private members, only members from EXACTLY THE SAME
// declaration is compatible
// PARAMETER properties
class Animal_with_parameter_prop {
	constructor(private name : string) { }
	move(meters : number) { alert(this.name + ' moved ' + meters + 'm.'); }
}
// ACCESSORS @ C#
// needs ECMAScript 5 support
var passcode = 'secret passcode';
class Employee {
	private _full_name : string;
	get full_name() : string { return this._full_name; }
	set full_name(new_name : string) {
		if (passcode && passcode == 'secret passcode')
			this._full_name = new_name;
		else alert("Error: Unauthorized update of employee!");
	}
}
// STATIC properties @ C++/Java
class Grid {
	static origin = { x: 0, y: 0 };
	calculate_distance_from_origin(point : { x : number; y : number }) {
		var dx = point.x - Grid.origin.x;
		var dy = point.y - Grid.origin.y;
		return Math.sqrt(dx * dx + dy * dy) / this.scale;
	}
	constructor (public scale : number) { }
}
// using class as interface
class Point { x : number; y : number; }
interface Point3d extends Point { z : number; }
var point3d : Point3d = { x : 1, y : 2, z : 3 };
// ctor function
// in TypeScript, declaring a class indicates that
// you create an instance of the class as the class itself
// and you create an ctor function for 'new' op. as in JS:
var Greeter_j = (function () { // this is the ctor function
	function Greeter_j(message) { this.greeting = message; }
	Greeter_j.prototype.greet = function () {
		return 'Hello, ' + this.greeting; };
	return Greeter_j;
})();
// a class is sepreated as 'instance side' and 'static side'
class Greeter_ctor {
    static standardGreeting = "Hello, there";
    greeting: string;
    greet() {
        if (this.greeting) return "Hello, " + this.greeting;
        else return Greeter_ctor.standardGreeting;
    }
}
var greeter1: Greeter_ctor;
greeter1 = new Greeter_ctor();
alert(greeter1.greet());
var greeterMaker: typeof Greeter_ctor = Greeter_ctor;
greeterMaker.standardGreeting = "Hey there!";
var greeter2:Greeter_ctor = new greeterMaker();
alert(greeter2.greet());
// a little difficult to understand ...