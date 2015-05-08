
// FUNDAMENTAL DATA TYPES

var done : boolean = false;
var height : number = 6; // floating point
var name : string = "bob";

// ARRAY, you can use C-style [ ],
// or Java style Array<T> @ C/C++/Java
var list:number[] = [1, 2, 3];
var list_array:Array<number> = [1, 2, 3];

// ENUM @ C++
enum Foundations { Caster, Liexing, Cea };
var f : Foundations = Foundations.Caster;
// enum with C++ style value
enum Foundations_with_year {
	Liexing = 2011,
	Caster = 2013,
	Cea = 2014, // supported
};
var f_ : Foundations_with_year = Foundations_with_year.Caster;
// extract enum name
var most_fundamental_foundation : string = Foundations_with_year[2013];
alert(most_fundamental_foundation);

// ANY type, used for dynamic type, or 3rd party
var not_sure : any = 4;
not_sure = "foundation"; not_sure = false;
// any typed array
var list_any:any[] = [ f_, 'has foundation', true ];
// VOID, C style (used on functions) @ C/C++
function warn() : void {
	alert("Who is the most fundamental?"); }


// INTERFACES @ Java
// 	(duck typing with type-checking is awesome)

// INLINE interfaces
function print_label(labeled_obj : { label : string }) {
	console.log(labeled_obj.label); }
print_label({ size: 10, label: "Size 10 Object" });
// or
interface LabeledValue {
	label : string; }
// interface has no order limitation
// OPTIONAL properties, could be used to create function args
interface SquareConfig {
	color? : string;
	width? : number;
}
function create_square(config : SquareConfig) : {
		color: string; area: number } {
	var new_square = { color: "white", area: 100 };
	if (config.color) new_square.color = config.color;
	if (config.width) new_square.area - config.width * config.width;
	return new_square;		
}
var my_square = create_square({ color: 'black' });
// FUNCTION TYPE @ C/C++
// call signature interface
interface SearchFunc {
	(source : string, sub_string : string) : boolean; } // the only interface member
var my_search : SearchFunc = 
	// you can have other parameter names
	function (src : string, sub : string) : boolean {
		var result = src.search(sub);
		if (result == -1) return false;
		else return true;
	};
// ARRAY types for interface
interface StringArray {
	// index type, can be number/string
	[index : number] : string; }
// but you cannot add something like 'length'
// explicitly with string index.
// CLASS types
// IMPLEMENTING @ Java, and methods
// interface can be used to define PUBLIC members
interface ClockI {
	current_time : Date;
	set_time (d : Date);
}
class Clock implements ClockI {
	current_time : Date;
	set_time (d : Date) { this.current_time = d; }
	constructor (h : number, m : number) { }
}
// EXTEND interface
interface Shape {
	color: string; }
interface Square extends Shape {
	side_length : number; }
var square = <Square>{ };
square.color = 'blue'; square.side_length = 10;
// extend MULTIPLE interface @ C++/Java
interface PenStroke {
	pen_width : number; }
interface SquareEx extends Shape, PenStroke {
	side_length : number; }
// full sample with various types
// 	frequently used to interact with 3rd-party libs
interface Counter {
	(start : number) : string; // ctor?
	interval : number;
	reset() : void;
}
var c : Counter;
c(10); c.reset(); c.interval = 5.0;
