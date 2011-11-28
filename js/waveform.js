;(function(proto) {

  function Waveform(player) {
    this.player = player;
    this.img = new Image();

    this.render();
    this.bind();

    this.height = this.player.width/6;
    this.slices = this.player.soundcloud.slices;
  }

  Waveform.prototype = {
    slices : 1800,
    dirty  : false,
    render : function() {
      this.el = $('<canvas></canvas>');
      this.el.addClass('layer');
      this.el.addClass('waveform')
      this.el.attr('width', this.player.width);
      this.el.attr('height', this.player.height);

      this.ctx = this.el[0].getContext('2d');
      this.player.el.append(this.el);
    },

    bind : function() {
      var that = this;
      this.player.el.bind('trackinfo', function(e, data) {
        // kick off a new image load
        that.img.onload = function() {
          that.tick();
          that.player.el.trigger('waveform:loaded');
        };

        that.img.src = data.waveform_url + '?client_id=' + that.player.soundcloud.key;
      });
    },

    tick : function() {
      var ctx = this.ctx;
      ctx.translate(this.player.center, this.player.center);

      ctx.fillStyle = "black";
      ctx.globalCompositeOperation = 'destination-in';
      var slicewidth = this.img.width/this.slices;


      ctx.globalCompositeOperation = 'source-over';
      ctx.beginPath();
      ctx.arc(0,0, (this.player.radius*.85), 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fillStyle = "black";
      ctx.fill();

      ctx.globalCompositeOperation = 'destination-out';

      for (var i=0; i<this.slices/2; i++) {
        ctx.save();
        ctx.rotate(i * 360/this.slices *2 * Math.PI/180);
        ctx.translate(0, -this.player.radius/1.15);
        ctx.drawImage(this.img, i*slicewidth, 0, slicewidth, this.height, 0, 0, slicewidth* 1.8, this.height/2);
        ctx.restore();
      }

      ctx.globalCompositeOperation = 'source-out';
      ctx.beginPath();
      ctx.arc(0,0, (this.player.radius*.9), 0, Math.PI*2, true);
      ctx.closePath();
      ctx.fillStyle = "#f6f6f6";
      ctx.fill();
    }
  };

  proto.init.push(function(player) {
    new Waveform(player);
  });

})(Player.prototype);


