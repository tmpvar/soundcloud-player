(function(proto) {

  function Play(player) {
    this.player = player;
    this.render();
    this.bind();
  }

  Play.prototype = {
    render : function() {
      this.el = $('<div></div>');
      this.el.addClass('controls');
      this.el.append('<img class="unselectable play" src="img/play_balanced.png"/>');
      this.el.append('<img class="unselectable pause" src="img/pause.png" />');
      $('img', this.el).hide();
      this.player.el.append(this.el);
      this.el.hide();
    },
    position: function() {
      var
      center = this.player.center,
      radius = this.player.radius,
      ratio = .20;

      $('.play', this.el).css({
        width : radius*ratio,
        height : radius*ratio
      });

      $('.play', this.el).css({
        left  : center - $('.play', this.el).width()/2,
        top   : center - $('.play', this.el).height()/2
      });


      $('.pause', this.el).css({ width : radius*ratio, height: radius*ratio});
      $('.pause', this.el).css({
        left  : center - $('.pause', this.el).width()/2,
        top   : center - $('.pause', this.el).height()/2
      })
    },
    bind : function() {
      var that = this, paused = false;
      this.player.el.bind('loaded', function() {
        that.position();
        $('.play', that.el).show();
        that.el.fadeIn(player.fadeInSpeed);
      });

      this.player.el.bind('loading', function() {
        paused = false;
        $('.pause', that.el).hide();
        $('.play', that.el).hide();
        that.el.fadeIn(player.fadeInSpeed);
      });

      this.player.el.bind('finished', function() {
        $('.pause', that.el).hide();
        $('.play', that.el).show();
      });

      $('.pause', this.el).bind('mousedown', function (e) {
        e.stopImmediatePropagation();
        if (that.player.sound) {
          paused = true;
          $('.play', that.el).show();
          $('.pause', that.el).hide();
          that.player.sound.pause();
          that.player.el.trigger('pause');
        }
        return false;
      });

      $('.play', this.el).bind('mousedown', function(e) {
        e.stopImmediatePropagation();
        if (that.player.sound) {
          $('.play', that.el).hide();
          $('.pause', that.el).show();
          if (paused) {
            that.player.sound.resume();
          } else {
            that.player.sound.play();
          }
          paused = false;

          that.player.el.trigger('play');
        }
        return false;
      });
    }
  };

  proto.init.push(function(player) {
    new Play(player);
  });

})(Player.prototype);