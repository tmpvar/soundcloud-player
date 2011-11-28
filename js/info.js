;(function(proto) {
  function Info(player) {
    this.player = player;
    this.render();
    this.bind();
  }

  Info.prototype = {
    render : function() {
      this.el = $('<div></div>');
      this.el.addClass('unselectable');
      this.el.addClass('track-info');
      this.player.el.append(this.el);
    },
    bind : function() {
      var that = this;
      this.player.el.bind('loading', function() {
        that.el.fadeOut(player.fadeOutSpeed);
      });

      this.player.el.bind('trackinfo', function(e, data) {
        var
        matches = data.title.match(/((^.*) - )?(.*)/),
        artist = data.user.username,
        title = data.title;

        if (matches[2]) {
          artist = matches[2];
          title = matches[3];
        }

        that.el.html(artist + '<br />' + title);

        that.el.css('width', that.player.radius/1.4);
        that.el.css({
          left          : that.player.center-that.el.width()/2,
          top           : that.player.center-that.player.radius/2.25,
          "font-size"   : that.player.radius/12,
          "line-height" : that.player.radius/135
        });
        that.el.fadeIn(player.fadeInSpeed);
      });

    }
  };

  proto.init.push(function(obj) {
    new Info(obj);
  });

})(Player.prototype);