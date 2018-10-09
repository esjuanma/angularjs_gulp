const iUP = angular
    .module('appName', ['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router']);

((app) => {
    
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        const defineState = component => $stateProvider.state(component, {
            url: '/' + component,
            templateUrl: `components/${component}/template.html`,
            controller: `components/${component}/controller`
        });

        const components = ['home'];
        components.forEach(defineState);
    }]);
})(iUP);
