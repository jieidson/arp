class WorkerOptions {

  arenaWidth: number = 3;
  arenaHeight: number = 3;

}

angular
  .module('crimesim.setup')
  .constant('SharedWorkerOptions', WorkerOptions);
