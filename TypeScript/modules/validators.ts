
// INTERNAL modules
module Validation {
	
	// export KEYWORD
	export interface StringValidator {
		acceptable(s : string) : boolean; }
		
	// details are not exported
	var letters_regexp = /^[A-Za-z]+$/;
	var number_regexp = /^[0-9]+$/;
	
	export class LettersOnlyValidator implements StringValidator {
		acceptable (s : string) { return letters_regexp.test(s); } }
		
	export class ZipCodeValidator implements StringValidator {
		acceptable (s : string) { return s.length === 5 && number_regexp.test(s); } }
	
}

var strings = [ 'Hello', '98052', '101' ];
var validators : { [s : string] : Validation.StringValidator; } = {
	'ZIP code' : new Validation.ZipCodeValidator(),
	'Letters only' : new Validation.LettersOnlyValidator()
}
strings.forEach(s => {
	for (var name in validators)
		console.log('"' + s + '" ' + (validators[name].acceptable(s) ? ' matches ' : ' does not match ') + name);
});