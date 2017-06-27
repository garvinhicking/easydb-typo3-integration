/**
 * Module: TYPO3/CMS/Easydb/EasydbAdapter
 */
define(['jquery'], function($) {
	'use strict';

	var easydbAdapter = {

		/**
		 * Reference to the file picker window
		 */
		filePicker: null,

		/**
		 * Value map of events already handled
		 */
		eventsHandled: {},

		openPicker: function(event) {
			event.preventDefault();
			var $arguments = $(event.target).data('arguments');
			easydbAdapter.eventsHandled = {};
			easydbAdapter.filePicker = top.window.open(
				$arguments['targetUrl'],
				'easydb_picker',
				'width=' + $arguments['window']['width'] + ',height=' + $arguments['window']['height'] + ',status=0,menubar=0,resizable=1,location=0,directories=0,scrollbars=1,toolbar=0'
			);
		},

		/**
		 * Close the easydb file picker if we have a reference to it
		 */
		closePicker: function() {
			if (easydbAdapter.filePicker) {
				easydbAdapter.filePicker.close();
			}
		},

		reloadWindow: function(event) {
			if (event.data['easydb']) {
				if (event.data['easydb']['action'] === 'reload' && !easydbAdapter.eventsHandled[event.data['easydb']['action']]) {
					window.location.reload();
					easydbAdapter.closePicker();
					easydbAdapter.eventsHandled['reload'] = true;
					easydbAdapter.eventsHandled['close'] = true;
				}
				if (event.data['easydb']['action'] === 'close' && !easydbAdapter.eventsHandled[event.data['easydb']['action']]) {
					window.location.reload();
					easydbAdapter.eventsHandled['close'] = true;
				}
			}
		},

		/**
		 * Add event listeners
		 */
		addEventListeners: function () {
			top.window.addEventListener('message', this.reloadWindow);
			top.window.addEventListener('beforeunload', this.closePicker);
			window.addEventListener('beforeunload', this.closePicker);
			$(function() {
				$('.button__file-list-easydb').on('click', easydbAdapter.openPicker);
			});
		}
	};

	easydbAdapter.addEventListeners();

	return easydbAdapter;
});
