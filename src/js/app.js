const iUP = angular
    .module('appName', ['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router']);

((app) => {
    
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        const defineState = component => $stateProvider.state(component, {
            url: '/' + component.toLowerCase(),
            templateUrl: `components/${component.toLowerCase()}/template.html`,
            controller: component
        });

        const components = ['Home'];
        components.forEach(defineState);
    }]);
})(iUP);
