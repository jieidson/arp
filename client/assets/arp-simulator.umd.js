(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('rxjs')) :
    typeof define === 'function' && define.amd ? define('arp-simulator', ['exports', 'rxjs'], factory) :
    (factory((global.arp = global.arp || {}, global.arp.simulator = {}),global.rxjs));
}(this, (function (exports,rxjs) { 'use strict';

    var Messenger = /** @class */ (function () {
        function Messenger() {
            this.commandSubject = new rxjs.Subject();
            this.commands$ = this.commandSubject.asObservable();
        }
        Messenger.prototype.onMessage = function (evt) {
            this.commandSubject.next(evt.data);
        };
        return Messenger;
    }());

    var Simulator = /** @class */ (function () {
        function Simulator(messenger) {
            this.messenger = messenger;
        }
        Simulator.prototype.start = function () {
            this.messenger.commands$.subscribe(function (command) {
                switch (command.type) {
                    case 'run':
                        console.log('RUN');
                        break;
                    default:
                        console.error('unknown command type:', command.type);
                }
            });
        };
        return Simulator;
    }());

    function main() {
        console.info('simulator web worker started');
        var messenger = new Messenger();
        addEventListener('message', function (evt) { return messenger.onMessage(evt); });
        var simulator = new Simulator(messenger);
        simulator.start();
    }
    main();

    /**
     * Generated bundle index. Do not edit.
     */

    exports.main = main;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJwLXNpbXVsYXRvci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL2FycC1zaW11bGF0b3IvbWVzc2VuZ2VyLnRzIiwibmc6Ly9hcnAtc2ltdWxhdG9yL3NpbXVsYXRvci50cyIsIm5nOi8vYXJwLXNpbXVsYXRvci9tYWluLnRzIiwibmc6Ly9hcnAtc2ltdWxhdG9yL2FycC1zaW11bGF0b3IudHMiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnXG5cbmltcG9ydCB7IENvbW1hbmQgfSBmcm9tICdAYXJwL3NoYXJlZCdcblxuZXhwb3J0IGNsYXNzIE1lc3NlbmdlciB7XG5cbiAgcHJpdmF0ZSBjb21tYW5kU3ViamVjdCA9IG5ldyBTdWJqZWN0PENvbW1hbmQ+KClcblxuICBjb21tYW5kcyQ6IE9ic2VydmFibGU8Q29tbWFuZD4gPSB0aGlzLmNvbW1hbmRTdWJqZWN0LmFzT2JzZXJ2YWJsZSgpXG5cbiAgb25NZXNzYWdlKGV2dDogTWVzc2FnZUV2ZW50KTogdm9pZCB7XG4gICAgdGhpcy5jb21tYW5kU3ViamVjdC5uZXh0KGV2dC5kYXRhKVxuICB9XG5cbn1cbiIsImltcG9ydCB7IE1lc3NlbmdlciB9IGZyb20gJy4vbWVzc2VuZ2VyJ1xuXG5leHBvcnQgY2xhc3MgU2ltdWxhdG9yIHtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlYWRvbmx5IG1lc3NlbmdlcjogTWVzc2VuZ2VyLFxuICApIHt9XG5cbiAgc3RhcnQoKTogdm9pZCB7XG4gICAgdGhpcy5tZXNzZW5nZXIuY29tbWFuZHMkLnN1YnNjcmliZShjb21tYW5kID0+IHtcbiAgICAgIHN3aXRjaCAoY29tbWFuZC50eXBlKSB7XG4gICAgICAgIGNhc2UgJ3J1bic6XG4gICAgICAgICAgY29uc29sZS5sb2coJ1JVTicpXG4gICAgICAgICAgYnJlYWtcblxuICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoJ3Vua25vd24gY29tbWFuZCB0eXBlOicsIGNvbW1hbmQudHlwZSlcbiAgICAgIH1cbiAgICB9KVxuICB9XG5cbn1cbiIsImltcG9ydCB7IE1lc3NlbmdlciB9IGZyb20gJy4vbWVzc2VuZ2VyJ1xuaW1wb3J0IHsgU2ltdWxhdG9yIH0gZnJvbSAnLi9zaW11bGF0b3InXG5cbmV4cG9ydCBmdW5jdGlvbiBtYWluKCkge1xuICBjb25zb2xlLmluZm8oJ3NpbXVsYXRvciB3ZWIgd29ya2VyIHN0YXJ0ZWQnKVxuXG4gIGNvbnN0IG1lc3NlbmdlciA9IG5ldyBNZXNzZW5nZXIoKVxuICBhZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZXZ0ID0+IG1lc3Nlbmdlci5vbk1lc3NhZ2UoZXZ0KSlcblxuICBjb25zdCBzaW11bGF0b3IgPSBuZXcgU2ltdWxhdG9yKFxuICAgIG1lc3NlbmdlcixcbiAgKVxuXG4gIHNpbXVsYXRvci5zdGFydCgpXG59XG5cbm1haW4oKVxuIiwiLyoqXG4gKiBHZW5lcmF0ZWQgYnVuZGxlIGluZGV4LiBEbyBub3QgZWRpdC5cbiAqL1xuXG5leHBvcnQgKiBmcm9tICcuL21haW4nO1xuIl0sIm5hbWVzIjpbIlN1YmplY3QiXSwibWFwcGluZ3MiOiI7Ozs7OztJQUlBO1FBQUE7WUFFVSxtQkFBYyxHQUFHLElBQUlBLFlBQU8sRUFBVyxDQUFBO1lBRS9DLGNBQVMsR0FBd0IsSUFBSSxDQUFDLGNBQWMsQ0FBQyxZQUFZLEVBQUUsQ0FBQTtTQU1wRTtRQUpDLDZCQUFTLEdBQVQsVUFBVSxHQUFpQjtZQUN6QixJQUFJLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7U0FDbkM7UUFFSCxnQkFBQztJQUFELENBQUMsSUFBQTs7SUNaRDtRQUVFLG1CQUNtQixTQUFvQjtZQUFwQixjQUFTLEdBQVQsU0FBUyxDQUFXO1NBQ25DO1FBRUoseUJBQUssR0FBTDtZQUNFLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLFNBQVMsQ0FBQyxVQUFBLE9BQU87Z0JBQ3hDLFFBQVEsT0FBTyxDQUFDLElBQUk7b0JBQ2xCLEtBQUssS0FBSzt3QkFDUixPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO3dCQUNsQixNQUFLO29CQUVQO3dCQUNFLE9BQU8sQ0FBQyxLQUFLLENBQUMsdUJBQXVCLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFBO2lCQUN2RDthQUNGLENBQUMsQ0FBQTtTQUNIO1FBRUgsZ0JBQUM7SUFBRCxDQUFDLElBQUE7OztRQ2pCQyxPQUFPLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUE7UUFFNUMsSUFBTSxTQUFTLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQTtRQUNqQyxnQkFBZ0IsQ0FBQyxTQUFTLEVBQUUsVUFBQSxHQUFHLElBQUksT0FBQSxTQUFTLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFBLENBQUMsQ0FBQTtRQUU1RCxJQUFNLFNBQVMsR0FBRyxJQUFJLFNBQVMsQ0FDN0IsU0FBUyxDQUNWLENBQUE7UUFFRCxTQUFTLENBQUMsS0FBSyxFQUFFLENBQUE7SUFDbkIsQ0FBQztJQUVELElBQUksRUFBRSxDQUFBOztJQ2hCTjs7T0FFRzs7Ozs7Ozs7Ozs7OyJ9