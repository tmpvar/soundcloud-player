(function(proto) {

  function Play(player) {
    this.player = player;

    player.play = function(e) {
      if (e) {
        e.stopImmediatePropagation();
      }

      if (player.sound) {
        if (player.sound.paused) {
          player.sound.resume();
        } else {
          player.sound.play();
        }
        player.paused = false;
        player.el.trigger('play');
      }
      return false;
    };

    player.pause = function(e) {
      if (e) {
        e.stopImmediatePropagation();
      }
      player.paused = true;
      if (player.sound) {
        player.sound.pause();
        player.el.trigger('pause');
      }
      return false;
    };

    this.render();
    this.bind();
  }

  Play.prototype = {
    render : function() {
      this.el = $('<div></div>');
      this.el.addClass('controls');
      this.el.addClass('unselectable');
      this.el.append('<img class="unselectable play" src="img/play_balanced.png"/>');
      this.el.append('<img class="unselectable pause" src="img/pause.png" />');
      $('img', this.el).hide();
      this.player.el.append(this.el);
      this.el.hide();
    },
    bind : function() {
      var that = this, paused = false, player = that.player;
      player.el.bind('loaded', function() {
        $('.play', that.el).show();
        that.el.fadeIn(player.fadeInSpeed);
      });

      player.el.bind('loading', function() {
        that.player.paused = false;
        $('.pause', that.el).hide();
        $('.play', that.el).hide();
        that.el.fadeIn(player.fadeInSpeed);
      });

      player.el.bind('finished', function() {
        $('.pause', that.el).hide();
        $('.play', that.el).show();
      });

      $('.pause', this.el).bind('click', this.player.pause);

      player.el.bind('pause', function() {
        $('.play', that.el).show();
        $('.pause', that.el).hide();
      });

      player.el.bind('play', function() {
        $('.play', that.el).hide();
        $('.pause', that.el).show();
      });

      $('.play', this.el).bind('click', this.player.play);
    }
  };

  proto.init.push(function(player) {
    new Play(player);
  });

})(Player.prototype);