/// <reference path="vali_multi.ts" />

// above is what you use to reference other modules

module Validation {
	var letters_regexp = /^[A-Za-z]+$/;
	export class LettersOnlyValidator implements StringValidator {
		acceptable(s : string) {
			return letters_regexp.test(s); }
	}
}