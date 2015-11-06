class SiteTitleService {
  constructor(
      private $rootScope: ng.IRootScopeService,
      private $translate: angular.translate.ITranslateService) {}

  setTitleKey(key: string): void {
    this.setTitle(this.$translate.instant(key));
  }

  setTitle(title: string): void {
    var t = this.$translate.instant(title),
    pageTitle = this.$translate.instant('SITE_TITLE');

    this.$rootScope['siteTitle'] = `${t} - ${pageTitle}`;
  }

  listen(): void {
    this.$rootScope
      .$on('$stateChangeSuccess', this.onStateChangeSuccess.bind(this));
  }

  private onStateChangeSuccess(evt: Event, toState: angular.ui.IState): void {
    if ('title' in toState.data) {
      this.setTitle(toState.data.title);
    }
  }
}

angular
  .module('arp.utils')
  .service('SiteTitleService', SiteTitleService)
  .run(function (SiteTitleService: SiteTitleService) {
    SiteTitleService.listen();
  });
