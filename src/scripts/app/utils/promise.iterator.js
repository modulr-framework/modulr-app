Modulr.define('modulr.app:utils/promise.iterator', [
    'require'

], function(require){

    // the same utility as:
    // https://github.com/mitzerh/node-cli-helpers#helperpromiseiteratorobjecttarget-functionnext-functiondone

    return function(target, next, done) {
        var list = [];
        var type = null;

        if (Array.isArray(target)) {
            type = 'array';
            list = target;
        } else if (typeof target === 'object') {
            type = 'object';
            (function(){
                for (var id in target) {
                    list.push({
                        id: id,
                        data: target[id]
                    });
                }
            })();
        } else {
            console.log('promiseIterator(error): target is not iterable');
            return done();
        }

        // requires next function
        if (typeof next !== 'function') {
            console.log('promiseIterator(error): missing next()');
            return done();
        }

        var iter = 0;
        var len = list.length;

        trigger();

        function trigger() {
            if (iter < len) {
                var item = (type === 'object') ? list[iter].data : list[iter];
                // pass to next function
                next(item, (type === 'object') ? list[iter].id : iter, function() {
                    iter++;
                    trigger();
                }, function() { // done (break loop if you need to)
                    fin();
                });
            } else {
                fin();
            }
        }

        function fin() {
            if (typeof done === 'function') {
                done();
            }
        }
    };


});
