;(function(proto) {

  function Volume(player) {
    this.player = player;
    this.render();
    this.bind();
  }

  Volume.prototype = {
    render : function() {
      this.el = $('<div></div>');
      this.el.addClass('volume');
      this.el.addClass('unselectable');

    },
    bind : function() {

    }
  };

  /*<div id="volume" class="unselectable">
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
      <div class="bar"></div>
    </div>
  */
/*
  $('#volume').fadeIn();
  $('#volume .bar').css('opacity', 0.9);

  $('#volume').css({
    left  : center-$('#volume').width()/2,
    top   : center+radius/3.75
  });

  var volumeWidth = $('#volume').width();
  var volumeOffset = $('#volume').offset();

  var updateVolume = function(volume) {
    $('#volume .bar').each(function(k) {
      if (k<volume/10) {
        $(this).addClass('active');
      } else {
        $(this).removeClass('active');
      }
    });
  }

  var move = function(e) {
    var x = e.clientX - (volumeOffset.left - window.scrollX);
    var volume = (x/volumeWidth)*100;
    sound.setVolume(volume);
    updateVolume(volume);
    return false;
  };

  updateVolume(sound.volume);

  var animateVolume = function() {
    if (!$(this).is('.animating')) {
      var originalHeight = $(this).height();
      $(this).addClass('animating');
      $(this).animate({ 'margin-top' : '-=15', height: '+=15', opacity: 1 }, 200, 'linear', function() {
        $(this).animate({ 'margin-top' : '+=15', height: '-=15', opacity: 0.9 }, 200, 'linear', function() {
          $(this).removeClass('animating');
          $(this).height(originalHeight);
        });
      });
    }
  }

  $('#volume .bar').bind('mousemove', animateVolume);
  $('#volume .bar').bind('click', animateVolume);

  $('#volume').bind('click', move);
  $('#volume').bind('mousedown', function() {
    $('#volume').bind('mousemove', move);
    $('#volume').one('mouseup', function() {
      $('#volume').unbind('mousemove', move);
    });
    return false;
  });
*/
  proto.init.push(function(player) {
    new Volume(player);
  })

})(Player.prototype);