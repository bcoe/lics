function Background() {
	var _this = this;

	this.messages = {};
	this.createContextMenuItem();
	this.successMessage = 'Collected profile information \\o/';
	this.failureMessage = 'Failed to upload profile information';

	chrome.extension.onRequest.addListener(function(request, sender, callback) {
		if (typeof(_this.messages[sender.tab.id]) == 'undefined') _this.messages[sender.tab.id] = [];

		if (request.people.length) {
			_this.sendProfiles(request.people, sender.tab);
		}

		if (_this.messages[sender.tab.id].length > 0) {
			callback(_this.messages[sender.tab.id].pop());
		} else {
			callback(false);
		}
	});
}

Background.prototype.createContextMenuItem = function() {
	var _this = this;

	chrome.contextMenus.create({
		type: 'normal',
		title: 'Pinch Profiles',
		contexts: ['all'],
		onclick: function(info, tab) {
			if (_this.messages[tab.id]) _this.messages[tab.id].push({});
		}
	});
};

Background.prototype.sendProfiles = function(people, tab) {
	var _this = this;
	if (typeof(_this.messages[tab.id]) == 'undefined') _this.messages[tab.id] = [];

	$.ajax({
		type: 'get',
		url: 'http://localhost:8888/',
		data: {
			people: people
		},
		success: function(response) {
			if (response.success) {
				_this.messages[tab.id].push( _this.successMessage );
			} else {
				_this.messages[tab.id].push( _this.failureMessage );
			}
		},
		error: function() {
			_this.messages[tab.id].push( _this.failureMessage );
		}
	});
};

document.addEventListener('DOMContentLoaded', function () {
	console.log('creating background script')
	new Background();
}, false);
