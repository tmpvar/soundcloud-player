;(function(proto) {

  function Waveform(player) {
    this.player = player;
    this.img = new Image();

    this.render();
    this.bind();

    this.theme = this.player.theme.waveform;

    player.layers.push(this);
  }

  Waveform.prototype = {
    dirty  : false,
    render : function() {
      this.el = $('<canvas></canvas>');
      this.el.addClass('layer');
      this.el.addClass('waveform')
      this.el.addClass('unselectable')
      this.el.attr('width', this.player.width);
      this.el.attr('height', this.player.height);

      this.ctx = this.el[0].getContext('2d');
      this.player.el.append(this.el);
      this.el.hide();
    },

    bind : function() {
      var that = this;

      this.player.el.bind('soundmanager:ready', function() {
        that.el.show();
      });

      this.player.el.bind('trackinfo', function(e, data) {
        // kick off a new image load
        that.img.onload = function() {
          that.dirty = true;
          if (that.el) {
            var el = that.el;
            el.css('z-index', parseInt(el.css('z-index')) + 1);
            that.render();
            that.tick();
            that.el.fadeIn(that.player.theme.loading.fade.show);

            el.fadeOut(that.player.theme.loading.fade.hide, function() {
              that.player.el.trigger('waveform:loaded');
              el.remove();
            });
          } else {
            that.tick();
            that.el.fadeIn(that.player.theme.loading.fade.show);
            that.player.el.trigger('waveform:loaded');
          }
        };

        that.img.src = data.waveform_url + '?client_id=' + that.player.soundcloud.key;
      });
    },

    tick : function() {
      if (!this.dirty) {
        return;
      }
      this.el.attr('width', 0);
      this.el.attr('width', this.player.width);
      this.el.attr('height', this.player.height);
      var ctx = this.ctx, slices = this.theme.slices;
      ctx.save();
        ctx.translate(this.player.center, this.player.center);
        var slicewidth = this.img.width/this.theme.slices;

        ctx.globalCompositeOperation = this.theme.compositeOperations.replace;
        ctx.beginPath();
        ctx.arc(0,0, (this.player.radius/1.05), 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = this.theme.replace;
        ctx.fill();

        ctx.globalCompositeOperation = this.theme.compositeOperations.slice;

        for (var i=0; i<slices; i++) {
          ctx.save();
          ctx.rotate(i * 360/slices * Math.PI/180);
          ctx.translate(0, -this.theme.offset);
          ctx.drawImage(this.img, i*slicewidth, 0, slicewidth, this.img.height/2, 0, 0, this.theme.outerWidth, this.theme.height);
          ctx.restore();
        }

        ctx.globalCompositeOperation = this.theme.compositeOperations.background;
        ctx.beginPath();
        ctx.arc(0,0, (this.player.radius), 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fillStyle = this.theme.background;
        ctx.fill();
      ctx.restore();
      this.dirty = false;
    }
  };

  proto.init.push(function(player) {
    new Waveform(player);
  });

})(Player.prototype);


