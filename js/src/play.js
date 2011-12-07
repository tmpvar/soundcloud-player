(function(proto) {

  function Play(player) {
    this.player = player;

    player.play = function(e) {
      console.log('here');
      if (e) {
        e.stopImmediatePropagation();
      }

      if (player.sound) {
        if (player.paused) {
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

      if (player.sound) {
        player.paused = true;
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
      $('img', this.el).css('opacity', 0.7).hide();
      this.player.el.append(this.el);
      this.el.hide();
    },
    position: function() {
      var
      center = this.player.center,
      radius = this.player.radius,
      ratio = .20;
    },
    bind : function() {
      var that = this, paused = false, player = that.player;
      player.el.bind('loaded', function() {
        that.position();
        $('.play', that.el).show();
        that.el.fadeIn(player.fadeInSpeed);
      });

      player.el.bind('loading', function() {
        paused = false;
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

      $(this.el).mouseover(function() {
       $('img', that.el).animate({
          opacity: 1
        }, 200);
      }).mouseout(function() {
        $('img', that.el).animate({
          opacity: 0.7
        }, 200);
      })
    }
  };

  proto.init.push(function(player) {
    new Play(player);
  });

})(Player.prototype);