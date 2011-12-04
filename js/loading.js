;(function(proto) {

  function Slice() {

  }

  Slice.prototype = {
    direction : 0,
    max : 50,
    height : 0
  };

  function Loading(player) {
    this.player = player;
    this.render();
    this.bind();
    this.player.layers.push(this);
    this.slices = [];
    this.theme = this.player.theme.loading;
    this.slice();
  }

  Loading.prototype = {
    stop : false,
    currentSlice : 0,
    totalSlices : 0,
    slice : function() {
      var current = this.theme.slices;
      this.slices = [];
      while(current--) {
        var slice = new Slice();
        slice.direction = -(this.theme.speed + (Math.random() * this.themespeed *2));
        slice.max = this.theme.slice.radius;
        this.slices.push(slice);
      }
    },
    render : function() {
      this.el = $('<canvas></canvas>');

      this.el.addClass('layer');
      this.el.addClass('loading')
      this.el.attr('width', this.player.width);
      this.el.attr('height', this.player.height);

      this.ctx = this.el[0].getContext('2d');
      this.player.el.append(this.el);
    },
    sliceStep :function() {
      if (this.slices.length !== this.theme.slices) {
        this.slice();
      }

      this.currentSlice++;
      if (this.currentSlice >= this.slices.length) {
        this.currentSlice = 0;
      }
      this.slices[this.currentSlice].direction =  -(this.theme.speed/2+ (Math.random() * this.theme.speed));
      this.slices[this.currentSlice].height = this.slices[this.currentSlice].max;
    },
    bind : function() {
      var that = this;
      this.player.el.bind('loading', function() {
        that.el.stop(false, true);
        clearInterval(that.stepper);
        that.stepper = setInterval(function() {
          that.sliceStep();
        }, that.theme.rate);
        that.el.fadeIn(that.theme.fade.show);
        this.stop = false;
      });

      this.player.el.bind('loaded', function() {
        clearInterval(that.stepper);
        that.el.fadeOut(that.theme.fade.hide);
      });
    },
    tick : function() {
      var width = this.player.width;
      var height = this.player.height;
      var centerX = width/2;
      var centerY = height/2;

      this.el.attr('width', 0);
      this.el.attr('width', width);
      this.el.attr('height', height);
      var ctx = this.ctx;
      if (this.el.is(':visible')) {

        ctx.save();
          ctx.beginPath();
          ctx.translate(centerX, centerY);
          ctx.arc(0,0, this.theme.inner.radius, -Math.PI*.5, (Math.PI*2), false);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fillStyle = this.theme.inner.color;
          ctx.fill();
        ctx.restore();

        var current = this.slices.length, slice;
        while(current--) {
          slice = this.slices[current];
          slice.height+=slice.direction;

          if (slice.height >= slice.max) {
            slice.direction = -this.theme.speed;
            slice.height+=slice.direction;
          }

          if (slice.height < 0) {
            slice.height = 0;
          }
          ctx.save()
            ctx.beginPath();
            ctx.translate(centerX, centerY);
            ctx.rotate(((current*((360/this.theme.slices)/360) * (Math.PI*2)) -Math.PI*.5));
            ctx.lineTo(0, slice.height);
            ctx.arc(0,0, slice.height, -Math.PI*.5, ((((360/this.theme.slices)/360) * Math.PI*2) -Math.PI*.5) + .1, false);
            ctx.lineTo(0, this.theme.inner.radius);
            ctx.closePath();
            ctx.fillStyle = this.theme.slice.color;
            ctx.fill();
          ctx.restore();
        }
      }
    }
  };

  proto.init.push(function(player) {
    new Loading(player);
  });
})(Player.prototype)