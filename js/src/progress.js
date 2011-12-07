;(function(proto) {

  function Progress(player) {
    this.player = player;
    this.render();
    this.bind();
    player.layers.push(this);
    this.theme = player.theme.progress;

    player.progress = function(p) {
      if (typeof p !== 'undefined') {
        p = parseInt(p, 10);
        player.sound.setPosition(p);
        return p;
      }
      return player.sound.position;
    }
  }

  Progress.prototype = {
    percentPlayed : 0,
    percentBuffered : 0,
    render: function() {
      this.el = $('<canvas></canvas>');
      this.el.addClass('layer');
      this.el.addClass('progress');
      this.el.addClass('unselectable');

      this.el.attr('width', this.player.width);
      this.el.attr('height', this.player.height);

      this.ctx = this.el[0].getContext('2d');
      this.player.el.append(this.el);
      this.el.hide();
    },
    bind : function() {
      var that = this;
      this.player.el.bind('buffering', function(e, data) {
        that.percentBuffered = (data.value/data.total) * 100;
      });

      this.player.el.bind('loading', function() {
        that.el.stop(false, true)
        that.el.fadeOut();
      });

      this.player.el.bind('soundmanager:ready', function() {
        that.el.fadeIn(700);
      });

      this.player.el.bind('loaded', function() {
        that.el.fadeIn(700);
      });

      this.player.el.bind('playing', function(e, data) {
        that.percentPlayed = (data.value/data.total) * 100;
      });

      var scrub = function(e) {
        var offset = $(that.player.el).offset();

        var centerY = (that.player.center + window.scrollY) + offset.top;
        var centerX = (that.player.center + window.scrollX) + offset.left;

        var diffY = e.clientY - centerY;
        var diffX = e.clientX - centerX;
        var distance = Math.sqrt((diffY*diffY) + (diffX*diffX));

        if (distance > that.theme.buffering.radius &&
            distance < that.theme.background.radius)
        {
          var calculatedRadians = -Math.atan2(diffY, diffX);
          var initialDegrees = (calculatedRadians * (180/Math.PI)) - 90;
          var correctedDegrees = (initialDegrees < 0) ? initialDegrees + 360 : initialDegrees;
          var percent = (360 - correctedDegrees)/360;

          if (that.player.sound) {
            that.player.sound.setPosition(parseInt(that.player.sound.meta.duration*percent, 10));
          }
        }
      };

      this.player.el.bind('mousedown', function(e) {
        scrub(e);
        that.player.el.bind('mousemove', scrub);
      });

      $(document).bind('mouseup', function() {
        that.player.el.unbind('mousemove', scrub);
      });
    },

    tick : function() {
      this.el.attr('width', 0);
      this.el.attr('width', this.player.width);

      var pctx = this.ctx, position = 0;
      if (this.player.sound) {
        position = (this.player.sound.position/this.player.sound.meta.duration)*100;
      }

      if (position >= 99.9) {
        position = 100;
      }

      pctx.beginPath();
      pctx.arc(this.player.center, this.player.center, this.theme.background.radius, 0, Math.PI*2, true);
      pctx.closePath();
      pctx.fillStyle = this.theme.background.color;
      pctx.fill();

      pctx.save();
        if (this.percentBuffered > 0) {
          pctx.save();
            pctx.beginPath();
            pctx.translate(this.player.center, this.player.center);
            pctx.arc(0,0, this.theme.buffering.radius, -Math.PI*.5, ((this.percentBuffered/100) * (Math.PI*2)) -Math.PI*.5, false);
            pctx.lineTo(0, 0);
            pctx.closePath();
            pctx.fillStyle = this.theme.buffering.color;
            pctx.fill();
          pctx.restore();
        }

        if (position > 0) {
          pctx.save();
            pctx.beginPath();
            pctx.translate(this.player.center, this.player.center);
            pctx.arc(0,0, this.theme.playing.radius, -Math.PI*.5, ((position/100) * (Math.PI*2)) -Math.PI*.5, false);
            pctx.lineTo(0, 0);
            pctx.closePath();
            pctx.fillStyle = this.theme.playing.color;
            pctx.fill();
          pctx.restore();

          pctx.save();
            pctx.beginPath();
            pctx.translate(this.player.center, this.player.center);
            pctx.arc(0, 0, this.theme.bufferOverlay.radius, -Math.PI*.5, ((position/100) * (Math.PI*2)) -Math.PI*.5, false);
            pctx.lineTo(0, 0);
            pctx.fillStyle = this.theme.bufferOverlay.color;
            pctx.fill();
            pctx.closePath();
          pctx.restore();
        }

        pctx.beginPath();
        pctx.arc(this.player.center, this.player.center, this.theme.inner.radius, 0, Math.PI*2, true);
        pctx.closePath();
        pctx.fillStyle = this.theme.inner.color;
        pctx.fill();
      pctx.restore();
    }
  }

  proto.init.push(function(player) {
    new Progress(player);
  });

})(Player.prototype);