interface Config {
  debug: boolean;
  version: string;

  git: {
    short: string;
    long: string;
    branch: string;
  };
}

angular
  .module('arp.app', [
    'angular-locker',
    'ngMaterial',
    'ngSanitize',
    'pascalprecht.translate',
    'ui.router',

    'arp.config',
    'arp.setup',
    'arp.templates'
  ])

  .config(function (
        $compileProvider: ng.ICompileProvider,
        $logProvider: ng.ILogProvider,
        CONFIG: Config) {
    $compileProvider.debugInfoEnabled(CONFIG.debug);
    $logProvider.debugEnabled(CONFIG.debug);
  })

  //.config(function ($locationProvider: ng.ILocationProvider) {
  //  $locationProvider.html5Mode(true);
  //})

  .config(function ($translateProvider: angular.translate.ITranslateProvider) {
    $translateProvider
      .useSanitizeValueStrategy('sanitize')
      .determinePreferredLanguage()
      .fallbackLanguage('en')
      .translations('en', {
        SITE_TITLE: 'ARP Model Simulator'
      });
  })

  .config(function (lockerProvider: any) {
    lockerProvider.defaults({
      driver: 'local',
      namespace: 'arp'
    });
  })

  // Set up our angular-material theme
  .config(function ($mdThemingProvider: angular.material.IThemingProvider) {
    $mdThemingProvider.theme('default');
  })

  .config(function ($urlRouterProvider: angular.ui.IUrlRouterProvider) {
    $urlRouterProvider
      .otherwise('/');
  })

  .config(function () {
    L.Icon.Default.imagePath = 'images/leaflet/images';
  })

  .run(function ($log: ng.ILogService, CONFIG: Config) {
    var buildType: string;
    if (CONFIG.debug) {
      buildType = 'DEBUG';
    } else {
      buildType = 'RELEASE';
    }
    $log.info(`ARP Model Simulator ${CONFIG.version} (${buildType}). Commit: ${CONFIG.git.short} Branch: ${CONFIG.git.branch}`);
  })
;
