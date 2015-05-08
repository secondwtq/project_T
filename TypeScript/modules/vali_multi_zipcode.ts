/// <reference path="vali_multi.ts" />

module Validation {
	var number_regexp = /^[0-9]+$/;
	export class ZipCodeValidator implements StringValidator {
		acceptable(s : string) { return s.length === 5 && number_regexp.test(s); }
	}
}