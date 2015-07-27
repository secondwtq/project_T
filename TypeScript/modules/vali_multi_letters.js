/// <reference path="vali_multi.ts" />
// above is what you use to reference other modules
var Validation;
(function (Validation) {
    var letters_regexp = /^[A-Za-z]+$/;
    var LettersOnlyValidator = (function () {
        function LettersOnlyValidator() {
        }
        LettersOnlyValidator.prototype.acceptable = function (s) {
            return letters_regexp.test(s);
        };
        return LettersOnlyValidator;
    })();
    Validation.LettersOnlyValidator = LettersOnlyValidator;
})(Validation || (Validation = {}));
