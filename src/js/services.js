'use strict';

/* Services */
App.Services = angular.module('App.Services', []);

/*
 * Service CONST
 */
App.Services.service('CONST', [
	'$log',
	function ($log) {
		var constant = [];

		constant['PLACELENGTH'] = 30;
		constant['ALERTSUCCESS'] = 'alert-success';
		constant['ALERTDANGER'] = 'alert-danger';
		constant['DEFAULTCOLOR'] = '#ffffff';

		return function (c) {
			if (constant[c]) {
				return constant[c];
			}
			return false;
		};
	}
]);

/*
 * Service Booking
 */
App.Services.service('Booking', [
	'$log', 'CONST', 'uuid4',
	function ($log, CONST, uuid4) {
		$log.log('BookingService started');

		return {
			places: [],
			groups: [],

			/*
			 * Erzeugt die Sitzplätze
			 */
			init: function (places) {

				for (var i = 0; i < places; i++) {
					//var flag = (10 > Math.random()*100) ? true : false;
					var flag = false;
					this.places.push(
						{name: 'Platz ' + (i + 1), flag: flag, color: CONST('DEFAULTCOLOR')}
					);
				}
			},

			/*
			 * Fügt Gruppe hinzu und reserviert die Plätze
			 */
			addGroup: function (group) {

				$log.log('addGroup', group);

				var newColor = this.randomColor();

				var newGroup = {
					name: group.name,
					length: group.length,
					color: newColor
				};

				return this.findPlace(newGroup);
			},

			/*
			 * löscht eine Gruppe und gibt die Plätze wieder frei
			 */
			removeGroup: function (group) {
				for (var r = 0; r < group.group.length; r++) {
					var pos = group.start + r;

					if (pos >= this.places.length) {
						pos -= this.places.length;
					}

					this.places[pos].flag = false;
					this.places[pos].color = CONST('DEFAULTCOLOR');
				}

				for (var g = 0; g < this.groups.length; g++) {
					if (group.uuid === this.groups[g].uuid) {
						this.groups.splice(g, 1);
					}
				}

				return true;
			},

			/**
			 * gibt alle Gruppen zurück
			 */
			getGroups: function () {
				return this.groups;
			},

			/**
			 * gibt alle Plätze zurück
			 */
			getPlaces: function () {
				return this.places;
			},

			/**
			 * findet freie Plätze
			 */
			findPlace: function (newGroup) {
				var founds = [],
					start = 0,
					end = 0,
					extra = 0,
					space = 0;

				/**
				 * durchläuft die Platzliste
				 */
				for (var i = 0; i < this.places.length; i++) {
					start = this.findStart(i);
					end = this.findEnd(start + 1);

					$log.log('Loop', start, end);

					if (end - start < this.places.length) {

						/**
						 * sucht am Anfang weiter
						 */
						if (end >= this.places.length - 1) {
							extra = this.findExtra();

							if (extra >= this.places.length - 1) {
								break;
							}
						}
					}

					space = (end - start) + extra;

					/**
					 * fügt eine neue Gruppe der Gefunden-Liste zu
					 */
					if (space >= newGroup.length) {
						founds.push({
							group: newGroup,
							start: start,
							end: end,
							space: space - newGroup.length
						});
					}

					i = end;
				}


				if (founds.length) {
					var best = this.findBest(founds);

					if (best) {

						/**
						 * reserviert Plätze für die Gruppe
						 */
						for (var r = 0; r < newGroup.length; r++) {
							var pos = best.start + r;

							if (pos >= this.places.length) {
								pos -= this.places.length;
							}

							this.places[pos].flag = true;
							this.places[pos].color = newGroup.color.hex;
						}

						this.groups.push(best);
						return true;
					}
					return false;
				}
				return false;

			},

			/**
			 * fundet neue Lücke in der Platzliste
			 */
			findStart: function (s) {
				//$log.log('findStart', s);

				for (var i = s; i < this.places.length; i++) {
					if (this.places[i].flag === false) {
						$log.log('findStart', s, i);
						return i;
					}
				}

				$log.log('findStart false', s, i);
				return i;
			},

			/**
			 * findet das Ende der Lücke
			 */
			findEnd: function (e) {
				//$log.log('findEnd', e);

				for (var i = e; i < this.places.length; i++) {
					if (this.places[i].flag === true) {
						$log.log('findEnd', e, i);
						return i;
					}
				}

				$log.log('findEnd false', e, i);
				return i;
			},

			/**
			 * findet das Ende der Lücke am Anfang der List
			 */
			findExtra: function () {

				for (var i = 0; i < this.places.length; i++) {
					if (this.places[i].flag === true) {
						return i;
					}
				}

				return i;
			},

			/**
			 * findet die optimale Lücke
			 */
			findBest: function (founds) {

				var space = this.places.length,
					best = null;

				for (var f = 0; f < founds.length; f++) {
					if (space > founds[f].space) {
						space = founds[f].space;
						best = founds[f];
					}
				}

				if (best) {

					best.uuid = uuid4.generate();
					return best;
				}

				return false;
			},

			/**
			 * generiert eine zufällige Farbe
			 */
			randomColor: function () {
				var r = Math.round((Math.random() * 102) + 102);
				var g = Math.round((Math.random() * 102) + 102);
				var b = Math.round((Math.random() * 102) + 102);
				var b = 225;

				var color = {
					r: r,
					g: g,
					b: b,
					hex: '#' + r.toString(16) + g.toString(16) + b.toString(16)
				};

				return color;
			}
		};
	}]);

/*
 * Service uuid4
 */
App.Services.service('uuid4', function () {
	/**! http://stackoverflow.com/a/2117523/377392 */
	var fmt = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
	this.generate = function () {
		return fmt.replace(/[xy]/g, function (c) {
			var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		});
	};
});