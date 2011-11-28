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
    },
    bind : function() {
      var that = this;
      this.player.el.bind('buffering', function(e, data) {
        console.log(arguments)
        that.percentBuffered = (data.value/data.total) * 100;
      });

      this.player.el.bind('playing', function(e, data) {
        that.percentPlayed = (data.value/data.total) * 100;
      });
    },

    tick : function() {
      this.el.attr('width', 0);
      this.el.attr('width', this.player.width);

      var pctx = this.ctx;

      if (this.percentPlayed === 99.9) {
        this.percentPlayed = 100;
      }

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

        if (this.percentPlayed > 0) {
          pctx.save();
            pctx.beginPath();
            pctx.translate(this.player.center, this.player.center);
            pctx.arc(0,0, this.player.radius/1.0982, -Math.PI*.5, ((this.percentPlayed/100) * (Math.PI*2)) -Math.PI*.5, false);
            pctx.lineTo(0, 0);
            pctx.closePath();
            pctx.fillStyle = "#C3000D";
            pctx.fill();
          pctx.restore();

          pctx.save();
            pctx.beginPath();
            pctx.translate(this.player.center, this.player.center);
            pctx.arc(0, 0, this.player.radius/1.7, -Math.PI*.5, ((this.percentPlayed/100) * (Math.PI*2)) -Math.PI*.5, false);
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