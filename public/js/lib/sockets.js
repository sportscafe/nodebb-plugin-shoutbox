define(function() {
	var Base, Config;
	var Sockets = {
		init: function(base, config, callback) {
			//todo I hate this
			Base = base; Config = config;
			callback();
		},
		onreceive: {
			register: function() {
				if (socket.listeners(Config.sockets.onReceive).length === 0) {
					socket.on(Config.sockets.onReceive, this.handle);
				}
			},
			handle: function(data) {
				var shoutBox = Base.getShoutPanel();
				if (shoutBox.length > 0) {
					Base.addShout(shoutBox, data);
					if (data.fromuid !== app.uid) {
						if (Config.getSetting('notification')) {
							app.alternatingTitle(Config.messages.alert.replace(/%u/g, data.username));
						}
						if (Config.getSetting('sound')) {
							$('#shoutbox-sounds-notification')[0].play();
						}
					}
				}
			}
		},
		ondelete: {
			register: function() {
				if (socket.listeners(Config.sockets.onDelete).length === 0) {
					socket.on(Config.sockets.onDelete, this.handle);
				}
			},
			handle: function(data) {
				$('[data-sid="' + data.id + '"]').remove();
			}
		},
		onedit: {
			register: function() {
				if (socket.listeners(Config.sockets.onEdit).length === 0) {
					socket.on(Config.sockets.onEdit, this.handle);
				}
			},
			handle: function(data) {
				$('[data-sid="' + data.id + '"]').html('<abbr title="edited">' + data.content + '</abbr>');
			}
		},
		onstatuschange: {
			register: function() {
				if (socket.listeners(Config.sockets.getUserStatus).length === 0) {
					socket.on(Config.sockets.getUserStatus, this.handle);
				}
			},
			handle: function(err, data) {
				Base.updateUserStatus(Base.getShoutPanel(), data.uid, data.status);
			}
		}
	};

	return Sockets;
});