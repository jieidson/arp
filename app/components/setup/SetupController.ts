declare var vis: any;

class SetupController {
  worker: Worker;
  messages: string[];
  options: WorkerOptions;
  network: any;

  constructor(
      private $scope: ng.IScope,
      SharedWorkerOptions: typeof WorkerOptions) {
    this.options = new SharedWorkerOptions();
  }

  startWorker(): void {
    this.messages = [];
    this.worker = new Worker('scripts/worker.js');
    this.worker.addEventListener('message', this.onWorkerMessage.bind(this));
    this.worker.addEventListener('error', this.onWorkerError.bind(this));

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

    if (!angular.isObject(this.network)) {
      let container = document.getElementById('arena-container');
      this.network = new vis.Network(container, message, {});
    } else {
      this.network.setData(message);
    }

    //this.messages.push(evt.data);
    //this.$scope.$digest();
  }

  private onWorkerError(evt: Event): void {
    console.log('Error:', evt);
  }
}

angular
  .module('crimesim.setup')
  .controller('SetupController', SetupController);
