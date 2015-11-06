function formError() {
  return {
    restrict: 'E',
    require: '^form',
    //replace: true,
    transclude: true,
    scope: {
      name: '@'
    },
    templateUrl: 'utils/formErrorDirective.html',
    link: function (scope: ng.IScope,
        element: ng.IAugmentedJQuery,
        attrs: ng.IAttributes,
        form: ng.IFormController) {
      scope['form'] = form;
    }
  };
};

angular
  .module('arp.utils')
  .directive('formError', formError);
