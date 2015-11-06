function setupRoutes($stateProvider: angular.ui.IStateProvider) {
  $stateProvider
    .state('setup', {
      url: '/',
      controller: 'SetupController',
      controllerAs: 'setupCtrl',
      templateUrl: 'setup/setup.html',
      data: {
        title: 'SETUP.TITLE'
      }
    });
}

angular
  .module('arp.setup')
  .config(setupRoutes);
