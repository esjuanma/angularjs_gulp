const iUP = angular
    .module('iUP', ['ngMaterial', 'ngAnimate', 'ngMessages', 'ngAria', 'ui.router']);

((app) => {
    
    app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');

        const defineState = component => $stateProvider.state(component, {
            url: '/' + component.toLowerCase(),
            templateUrl: `components/${component.toLowerCase()}/template.html`,
            controller: component
        });

        const components = ['Home', 'About', 'Pozos', 'Last'];
        components.forEach(defineState);
    }]);

})(iUP);

console.log('Test')