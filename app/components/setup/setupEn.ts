function setupEn($translateProvider: angular.translate.ITranslateProvider) {
  $translateProvider.translations('en', {
    SETUP: {
      TITLE: 'Setup'
    }
  });
}

angular
  .module('crimesim.setup')
  .config(setupEn);
