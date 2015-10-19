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


  //var a = new Agent('a', 0, 0);
  //postMessage(a);

  //var tick = function () {
  //  a.tick();
  //  postMessage(a);
  //  setTimeout(tick, 1000);
  //};

  //setTimeout(tick, 1000);
}
