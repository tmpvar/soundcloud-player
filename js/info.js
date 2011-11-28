;(function(proto) {
  function Info(player) {
    this.player = player;
    this.render();
    this.bind();
  }

  Info.prototype = {
    render : function() {
      this.el = $('div');
      this.el.addClass('unselectable');
      this.el.addClass('track-info');
      this.player.el.append(this.el);
    },
    bind : function() {
      var that = this;
      this.player.el.bind('loading', function() {
        that.el.fadeOut(player.fadeOutSpeed);
      });

      player.el.bind('loading:info', function() {
        that.el.fadeIn(player.fadeInSpeed);
      });
    }
  };

  proto.init.push(function(obj) {
    new Info(obj);
  });

})(Player.prototype);