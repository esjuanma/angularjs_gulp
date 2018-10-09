(function(app) {
	app.controller('AboutController', ['$scope', function($scope) {

		Object.assign($scope, {
			company: {
				name: 'Hexacta',
				address: 'BsAs'
			}
		});

	}]);
})(appName);
