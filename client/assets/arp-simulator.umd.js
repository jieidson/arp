(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('arp-simulator', ['exports'], factory) :
    (factory((global.arp = global.arp || {}, global.arp.simulator = {})));
}(this, (function (exports) { 'use strict';

    console.info('Web worker started');
    addEventListener('message', function (evt) {
        console.log('From main:', evt.data);
        postMessage('hello from web worker');
    });
    var SIMULATOR = true;

    /**
     * Generated bundle index. Do not edit.
     */

    exports.SIMULATOR = SIMULATOR;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJwLXNpbXVsYXRvci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL2FycC1zaW11bGF0b3IvbWFpbi50cyIsIm5nOi8vYXJwLXNpbXVsYXRvci9hcnAtc2ltdWxhdG9yLnRzIl0sInNvdXJjZXNDb250ZW50IjpbImNvbnNvbGUuaW5mbygnV2ViIHdvcmtlciBzdGFydGVkJylcblxuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGV2dCA9PiB7XG4gIGNvbnNvbGUubG9nKCdGcm9tIG1haW46JywgZXZ0LmRhdGEpXG4gIHBvc3RNZXNzYWdlKCdoZWxsbyBmcm9tIHdlYiB3b3JrZXInKVxufSlcblxuZXhwb3J0IGNvbnN0IFNJTVVMQVRPUiA9IHRydWVcbiIsIi8qKlxuICogR2VuZXJhdGVkIGJ1bmRsZSBpbmRleC4gRG8gbm90IGVkaXQuXG4gKi9cblxuZXhwb3J0ICogZnJvbSAnLi9tYWluJztcbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7SUFBQSxPQUFPLENBQUMsSUFBSSxDQUFDLG9CQUFvQixDQUFDLENBQUE7SUFFbEMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLFVBQUEsR0FBRztRQUM3QixPQUFPLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7UUFDbkMsV0FBVyxDQUFDLHVCQUF1QixDQUFDLENBQUE7SUFDdEMsQ0FBQyxDQUFDLENBQUE7QUFFRixRQUFhLFNBQVMsR0FBRyxJQUFJOztJQ1A3Qjs7T0FFRzs7Ozs7Ozs7Ozs7OyJ9