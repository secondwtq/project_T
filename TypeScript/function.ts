// named and anonymous function
//function add(x, y) { return x + y; }
//var my_add = function (x, y) { return x + y; };

// with type
function add(x : number, y : number) : number { return x + y; }
var my_add = function(x : number, y : number) : number { return x + y; };
// function type @ C++
// type inference @ C++11
// parameter name here is just for readability
// captured variables (upvalues, anyway) is not part of type
var add_func : (x : number, y : number) => number = function (x, y) { return x + y; };
// optional & default parameters
// in TypeScript, every parameter is assumed to be required @ Python
function build_name(first_name : string, last_name? : string) {
	if (last_name) return first_name + " " + last_name;
	else return first_name;
}
function build_name_def(first_name : string, last_name = "Smith") {
	if (last_name) return first_name + " " + last_name;
	else return first_name;
}
var result1 = build_name('Bob');
var result2 = build_name('Bob', 'Adams');
//var result3 = build_name('Bob', 'Adams', 'Sr.'); an error, too many arg.
// rest parameters
function build_name_rest(first_name : string, ... rest_of_name : string[]) {
	return first_name + " " + rest_of_name.join(' '); }
// lambdas & 'this'
var deck = {
	suits: ['hearts', 'spades', 'clubs', 'diamonds'],
	cards: Array(52),
	create_card_picker: function () {
		return () => {
			var picked_card = Math.floor(Math.random() * 52);
			var picked_suit = Math.floor(picked_card / 13);
			return {
				// 'this' boilerplate avoided with lambda
				suit: this.suits[picked_suit],
				card: picked_card % 13
			}
		}
	}
}
// overloads @ C++/Java
// not as perfect as you want
var suits = ['hearts', 'spades', 'clubs', 'diamonds'];
function pick_card(x : { suit : string; card : number; }[]) : number;
function pick_card(x : number) : { suit : string; card : number; };
function pick_card(x) : any { // not part of overload list
	if (typeof x == 'object') {
		return Math.floor(Math.random() * x.length);
	} else if (typeof x == "number") {
		return { suit : suits[Math.floor(x / 13)], card : x % 13 };
	}
}