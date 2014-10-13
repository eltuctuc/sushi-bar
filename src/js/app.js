'use strict';

var App = angular.module('sushiApp', [
	'ngRoute',
	'App.Controllers',
	'App.Services'
]);

App.config(['$routeProvider', function ($routeProvider) {
	$routeProvider.
		when('/', {templateUrl: 'views/main.html', controller: 'MainCtrl'}).
		otherwise({redirectTo: '/'});
}]);

App.run([
	'$log',
	function ($log) {

		$log.log('App started', angular.version.full);
	}
]);