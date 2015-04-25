    Function.prototype.method = function (name, func) {
        this.prototype[name] = func;
        return this;
    }
    
---

    if (typeof Object.beget !== 'function') {
        Object.beget = function (o) {
            var F = function () { };
            F.prototype = o;
            return new F();
        };
    }
    
    var another_stooge = Object.create(stooge);
    
---