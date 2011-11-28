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
    var current = this.sliceCount;
    while(current--) {
      var slice = new Slice();
      slice.direction = -(this.speed + (Math.random() * this.speed *2));
      slice.height = slice.max
      this.slices.push(slice);
    }
  }

  Loading.prototype = {
    sliceCount: 100,
    currentSlice : 0,
    speed : 2,
    nextSlice : 50,
    stop : false,
    render : function() {
      this.el = $('<canvas></canvas>');

      this.el.addClass('layer');
      this.el.addClass('loading')
      this.el.attr('width', this.player.width);
      this.el.attr('height', this.player.height);

      this.ctx = this.el[0].getContext('2d');
      this.player.el.append(this.el);

      var that = this;


    },
    sliceStep :function() {
      this.currentSlice++;
      if (this.currentSlice >= this.sliceCount) {
        this.currentSlice = 0;
      }
      this.slices[this.currentSlice].direction =  -(this.speed + (Math.random() * this.speed*2));
      this.slices[this.currentSlice].height = this.slices[this.currentSlice].max;
    },
    bind : function() {
      var that = this;
      this.player.el.bind('loading', function() {
        this.stepper = setInterval(function() {
          that.sliceStep();
        }, this.nextSlice);
        that.el.fadeIn();
        this.stop = false;
      });

      this.player.el.bind('loaded', function() {
        clearInterval(that.stepper);
        that.el.fadeOut(700);
      });
    },
    tick : function() {
      this.el.attr('width', 0);
      this.el.attr('width', this.player.width);
      var ctx = this.ctx;
      if (this.el.is(':visible')) {
        ctx.save();
          ctx.beginPath();
          ctx.translate(this.player.center, this.player.center);
          ctx.arc(0,0, this.player.radius/2, -Math.PI*.5, (Math.PI*2), false);
          ctx.lineTo(0, 0);
          ctx.closePath();
          ctx.fillStyle = "#C3000D";
          ctx.fill();
        ctx.restore();


        var current = this.sliceCount, slice, height;

        var done = false
        while(current--) {
          slice = this.slices[current];
          //if (current === this.currentSlice) {
          slice.height+=slice.direction;

          height = (this.player.width-this.player.radius)/2+slice.height;
          if (slice.height >= slice.max) {
            console.log('reverse');
            slice.direction = -this.speed;
            slice.height+=slice.direction;
          }

          if (slice.height < 0) {
            slice.height = 0;
          }
          ctx.save()
            ctx.beginPath();
            ctx.translate(this.player.center, this.player.center);
            ctx.rotate(((current*((360/this.sliceCount)/360) * (Math.PI*2)) -Math.PI*.5));
            ctx.lineTo(0, (this.player.radius/2)+slice.height);
            ctx.arc(0,0, height, -Math.PI*.5, ((((360/this.sliceCount)/360) * Math.PI*2) -Math.PI*.5) + .1, false);
            ctx.lineTo(0, 0);
            ctx.closePath();
            ctx.fillStyle = 'black';
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