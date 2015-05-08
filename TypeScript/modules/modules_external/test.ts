// external modules are used for node.js & require.js
// otherwise you are highly recommended to use internal modules only
//
// top level 'import' or 'export' keywords indicates external module
// 	(while internal only has reference and 'module' keywords)
// external modules are to be compiled with 'tsc --module commonjs/amd'
//	(and tsc would generate appropriate modules code based on your selection)

// you'll need 'import' and 'require' with explicit
//	file path for external modules
import validator_ = require('./validator');
import validator = require('./validator_impl');

// and you cannot concatenate TypeScript files into a single
// JavaScript file using '--out', with external modules

var strings = [ 'Hello', '98052', '101' ];
var validators : { [s : string] : validator_.StringValidator; } = {
	'ZIP code' : new validator.ZipCodeValidator(),
	'Letters only' : new validator.LettersOnlyValidator()
}
strings.forEach(s => {
	for (var name in validators)
		console.log('"' + s + '" ' + (validators[name].acceptable(s) ? ' matches ' : ' does not match ') + name);
});