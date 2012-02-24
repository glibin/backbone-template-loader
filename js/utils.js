if ( !Function.prototype.bind ) {
    Function.prototype.bind = function( obj ) {
        var args = [].slice.call(arguments, 1),
            self = this,
            nop = function () {},
            bound = function () {
                return self.apply( this instanceof nop ? this : ( obj || {} ),
                    args.concat( [].slice.call(arguments) ) );
            };
        nop.prototype = self.prototype;
        bound.prototype = new nop();
        return bound;
    };
}
