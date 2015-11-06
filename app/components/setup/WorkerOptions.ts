class WorkerOptions {

  arenaWidth: number = 3;
  arenaHeight: number = 3;

}

angular
  .module('arp.setup')
  .constant('SharedWorkerOptions', WorkerOptions);
