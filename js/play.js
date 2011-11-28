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

      var offset = this.player.offset, center = this.player.center;

      $('.play', this.el).css({
        width : offset,
        height : offset
      });

      $('.play', this.el).css({
        left  : center - offset/2,
        top   : center - offset/2
      });

      $('.pause', this.el).css({ width : offset , height: offset});
      $('.pause', this.el).css({
        left  : center - offset/2,
        top   : center - offset/2
      })

    },
    bind : function() {
      var that = this;
      this.player.el.bind('loaded', function() {
        that.el.fadeIn(player.fadeInSpeed);
      });

      /*
                  var play = function() {
              $('#controls .play').hide();
              $('#controls .pause').show();
              if (!played) {
                soundObject.play();
                played = true;
              } else {
                soundObject.resume();
              }
              return false;
            };

            var pause = function () {
              $('#controls .play').show();
              $('#controls .pause').hide();

              if (played) {
                soundObject.pause();
              }
              return false;
            };

            $('#controls .pause').bind('click', pause);
            $('#controls .play').bind('click', play);

            pause();
            */
    }
  };

  proto.init.push(function(player) {
    new Play(player);
  });

})(Player.prototype);