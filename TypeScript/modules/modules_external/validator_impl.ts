import validator = require('./validator');
var letters_regexp = /^[A-Za-z]+$/;
var number_regexp = /^[0-9]+$/;
export class LettersOnlyValidator implements validator.StringValidator {
	acceptable(s : string) {
		return letters_regexp.test(s); }
}
export class ZipCodeValidator implements validator.StringValidator {
	acceptable(s : string) { return s.length === 5 && number_regexp.test(s); }
}