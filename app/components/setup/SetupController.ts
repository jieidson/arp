declare var vis: any;

class SetupController {
  worker: Worker;
  messages: string[];
  options: WorkerOptions;

  constructor(
      private $scope: ng.IScope,
      SharedWorkerOptions: typeof WorkerOptions) {
    this.options = new SharedWorkerOptions();
  }

  startWorker(): void {
    this.messages = [];
    this.worker = new Worker('scripts/worker.js');
    this.worker.addEventListener('message', this.onWorkerMessage.bind(this));

    this.worker.postMessage(this.options);
  }

  stopWorker(): void {
    if (!angular.isObject(this.worker)) {
      return;
    }

    this.worker.terminate();
    delete this.worker;
  }

  private onWorkerMessage(evt: MessageEvent): void {
    var message = evt.data;

    console.log('Worker message:', message);

    var container = document.getElementById('arena-container');
    var network = new vis.Network(container, message, {});

    //this.messages.push(evt.data);
    this.$scope.$digest();
  }
}

angular
  .module('crimesim.setup')
  .controller('SetupController', SetupController);
