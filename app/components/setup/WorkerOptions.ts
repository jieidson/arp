class WorkerOptions {

  arenaWidth: number = 10;
  arenaHeight: number = 10;

}

angular
  .module('crimesim.setup')
  .constant('SharedWorkerOptions', WorkerOptions);
