'use strict';

App.Controllers = angular.module('App.Controllers', []);

/**
 * MainCtrl
 */
App.Controllers.controller('MainCtrl', [
	'$scope', '$log', 'Booking', 'CONST','myDate',

	function ($scope, $log, Booking, CONST, myDate) {
		$log.log('Main started');

		/**
		 * Reinitialisiert die Gruppenwerte für die Eingabe
		 * @returns {{name: string, length: number, color: null}}
		 */
		var resetInputGroup = function () {
			return {
				name: '',
				length: null,
				color: null
			};
		};

		/**
		 * Maximale Anzahl an Plätzen
		 */
		$scope.seatLength = CONST('PLACELENGTH');

		/**
		 * Startet den BookingService
		 */
		Booking.init($scope.seatLength);

		/**
		 * lädt die reservierbaren Plätze
		 */
		$scope.seats = Booking.getPlaces();

		/**
		 * lädt die aktuellen Gruppen
		 */
		$scope.groups = Booking.getGroups();
		$scope.inputGroup = resetInputGroup();

		/**
		 * übergibt dem BookingService eine neue Gruppe
		 */
		$scope.addGroup = function ($event) {
			$log.log('Button clicked');

			if($scope.inputGroup.name === '') {
				$scope.inputGroup.name = 'von ' + myDate.getTime() + ' Uhr';
			}

			if (Booking.addGroup($scope.inputGroup)) {
				$scope.addAlert(CONST('ALERTSUCCESS'), 'Gruppe wurde platziert!');
			} else {
				$scope.addAlert(CONST('ALERTDANGER'), 'Es wurde kein Platz gefunden!');
			}

			$scope.inputGroup = resetInputGroup();
			angular.element('#inputGroupLength').trigger('focus');
		};

		/**
		 * überibt dem BookingService die zu löschende Gruppe
		 */
		$scope.removeGroup = function ($event, group) {
			$log.log('removeGroup', group);
			if (Booking.removeGroup(group)) {
			}
		};

		/**
		 * Hinweisliste
		 */
		$scope.alerts = [];

		/**
		 * fügt der Hinweisliste eine Eintrag hinzu
		 */
		$scope.addAlert = function (type, msg) {
			$scope.alerts.push({type: type, msg: msg});
		};

		/**
		 * Löscht aus der Hinweisliste einen Eintrag
		 */
		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};
	}
]);