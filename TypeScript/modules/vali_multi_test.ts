/// <reference path="vali_multi.ts" />
/// <reference path="vali_multi_letters.ts" />
/// <reference path="vali_multi_zipcode.ts" />

var strings = [ 'Hello', '98052', '101' ];
var validators : { [s : string] : Validation.StringValidator; } = {
	'ZIP code' : new Validation.ZipCodeValidator(),
	'Letters only' : new Validation.LettersOnlyValidator()
}
strings.forEach(s => {
	for (var name in validators)
		console.log('"' + s + '" ' + (validators[name].acceptable(s) ? ' matches ' : ' does not match ') + name);
});