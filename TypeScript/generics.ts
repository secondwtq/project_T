
// Hellor Genericers! @ Java/C#/C++
// does not lose any type information
function identity<T> (arg : T) : T { return arg; }
var output = identity<string>("my_string");
var output_type_inference = identity("my_string");

// constraints
// function logging_ide<T> (arg : T) : T { console.log(arg.length); return arg; }
// error >length< !
function logging_ide_a<T> (arg : T[]) : T[] {
	console.log(arg.length);
	return arg; }
function logging_ide_b<T> (arg : Array<T>) : Array<T> {
	console.log(arg.length);
	return arg; }
// Generic Types
var my_identity : <U>(arg : U) => U = identity;
// Generic Interface & Class
interface GenericIdentityFn {
	<T> (arg : T) : T; }
var my_ide_interface : GenericIdentityFn = identity;
interface GenericIdentityFnSpec <T> {
	<T> (arg : T) : T; }
var my_ide_spec : GenericIdentityFnSpec<number> = identity;
class GenericNumber<T> {
	zero_value : T;
	add : (x : T, y : T) => T;
}
var my_gen_num = new GenericNumber<number>();
my_gen_num.zero_value = 0; my_gen_num.add = function (x, y) { return x + y; };
var str_num = new GenericNumber<string>();
str_num.zero_value = ''; str_num.add = function (x, y) { return x + y; };

// Generic Constriants @ C++ Concepts
interface Lengthwise {
	length : number; }
function logging_ide_cons<T extends Lengthwise>(arg : T) : T {
	console.log(arg.length); return arg; }
logging_ide_cons({ length: 10, value: 3 });
interface Findable<T> { }
function find<T>(n : T, s : Findable<T>) { }
// use of class type
function create<T>(c : { new() : T; }) : T { return new c(); }

class ZooKeeper {
	nametag : string; };
class Animal {
	num_legs : number; }
class Lion extends Animal {
	keeper : ZooKeeper; }

function find_keeper<A extends Animal, K> (a : { new() : A; prototype : { keeper : K } }) : K {
	return a.prototype.keeper; }
find_keeper(Lion).nametag;