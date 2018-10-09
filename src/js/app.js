var appName = angular.module('appName', ['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router']);

(function(app) {
    const components = ['home', 'contact', 'about'];
    
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        components.forEach(component => {
            $stateProvider
                .state(component, {
                    url: '/' + component,
                    templateUrl: `components/${component}/template.html`,
                    controller: `components/${component}/controller`
                })
        });
    }]);
})(iUp);
