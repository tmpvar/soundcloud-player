(function(proto) {

  function Play(player) {
    this.render();
  }

  Play.prototype = {
    render : function() {
      this.el = $('<div />');
      el.addClass('controls');
      el.append('<img class="unselectable play" src="img/play_balanced.png"/>');
      el.append('<img class="unselectable pause" src="img/pause.png" />');
      this.player.el.append(this.el);
    }
  };


  proto.init.push(function(player) {
    new Play(player);
  };

})(Player.prototype);