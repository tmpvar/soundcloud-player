;(function(proto) {

  function Progress(player) {
    this.player = player;
    this.render();
    this.bind();
    player.layers.push(this);
  }

  Progress.prototype = {
    percentPlayed : 0,
    percentBuffered : 0,
    render: function() {
      this.el = $('<canvas></canvas>');
      this.el.addClass('layer');
      this.el.addClass('progress')
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
        that.el.fadeOut();
      });

      this.player.el.bind('soundmanager:ready', function() {
        that.el.fadeIn(700);
      });

      this.player.el.bind('playing', function(e, data) {
        that.percentPlayed = (data.value/data.total) * 100;
      });

      var scrub = function(e) {
        var calculatedRadians = -Math.atan2(e.clientY - (that.player.center - window.scrollY), e.clientX - (that.player.center - window.scrollX));
        var initialDegrees = (calculatedRadians * (180/Math.PI)) - 90;
        var correctedDegrees = (initialDegrees < 0) ? initialDegrees + 360 : initialDegrees;
        var percent = (360 - correctedDegrees)/360;

        if (that.player.sound) {
          that.player.sound.setPosition(parseInt(that.player.sound.meta.duration*percent, 10));
        }
      };

      this.player.el.bind('mousedown', function(e) {
        scrub(e);
        that.player.el.bind('mousemove', scrub);
      });

      this.player.el.bind('mouseup', function() {
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
      pctx.arc(this.player.center, this.player.center, (this.player.radius*.90), 0, Math.PI*2, true);
      pctx.closePath();
      pctx.fillStyle = "black";
      pctx.fill();

      pctx.save();
        if (this.percentBuffered > 0) {
          pctx.save();
            pctx.beginPath();
            pctx.translate(this.player.center, this.player.center);
            pctx.arc(0,0, this.player.radius/1.7, -Math.PI*.5, ((this.percentBuffered/100) * (Math.PI*2)) -Math.PI*.5, false);
            pctx.lineTo(0, 0);
            pctx.closePath();
            pctx.fillStyle = "#b0b0b0";
            pctx.fill();
          pctx.restore();
        }

        if (position > 0) {
          pctx.save();
            pctx.beginPath();
            pctx.translate(this.player.center, this.player.center);
            pctx.arc(0,0, this.player.radius/1.12, -Math.PI*.5, ((position/100) * (Math.PI*2)) -Math.PI*.5, false);
            pctx.lineTo(0, 0);
            pctx.closePath();
            pctx.fillStyle = "#11db11";
            pctx.fill();
          pctx.restore();

          pctx.save();
            pctx.beginPath();
            pctx.translate(this.player.center, this.player.center);
            pctx.arc(0, 0, this.player.radius/1.7, -Math.PI*.5, ((position/100) * (Math.PI*2)) -Math.PI*.5, false);
            pctx.lineTo(0, 0);
            pctx.fillStyle = "rgba(1, 1, 1, 0.5)";
            pctx.fill();
            pctx.closePath();
          pctx.restore();
        }

        pctx.beginPath();
        pctx.arc(this.player.center, this.player.center, (this.player.radius/1.80), 0, Math.PI*2, true);
        pctx.closePath();
        pctx.fillStyle = "black";
        pctx.fill();
      pctx.restore();
    }
  }

  proto.init.push(function(player) {
    new Progress(player);
  });

})(Player.prototype);