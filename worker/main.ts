this.importScripts('worker-vendor.js');

Rand.init();

this.addEventListener('message', function (evt: MessageEvent) {
  var options: WorkerOptions = evt.data;

  console.log('OPTIONS:', options);
  main(options);
});

function main(options: WorkerOptions): void {
  var arena = Arena.randomGrid(options.arenaWidth, options.arenaHeight);

  postMessage(arena.toVis());

  var a = new Agent('a', Rand.pick(arena.nodes));

  var tick = function () {
    a.tick();
    postMessage(arena.toVis());
    setTimeout(tick, 1000);
  };

  tick();
}
