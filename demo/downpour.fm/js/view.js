$(function() {
  window.useHTML5Audio = true;
  var storage = window.storage = JSON.parse(localStorage.getItem('state') || '{ "tracks" : [], "groups" : [] }');

  var save = function() {
    localStorage.removeItem('state');
    localStorage.setItem('state', JSON.stringify(storage));
  };

  window.reset = function() {
    storage = {
      groups : {},
      tracks : []
    }
    save();
    window.location.reload();
  };

  $('.reset').click(function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    reset();
  })

  var player = window.player = new Player({});

  $('#playlist .playlist a.play-track').live('click', function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();

    $('#playlist .active').removeClass('active');
    $(this).addClass('active');
    player.load($(this).attr('href'), player.play);
    return false;
  });

  $('#playlist #buttons li').click(function(e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    window.location.hash = $(this).find('a').attr('href');

    if ($(this).is('.playlist')) {
      scrollToTrack(0);
    }
    return false;
  });

  $('#playlist #buttons li a').click(function(e) {
    e.preventDefault();
  });

  var navigate = function() {
    $('#playlist .content > *').hide();

    var loc = 'playlist';
    if (window.location.hash.length > 1) {
      loc = window.location.hash.replace('#', '');
    }

    if (loc === 'playlist' && $('.group-list li').length === 0) {
      window.location.hash = '#groups';
      loc = 'groups';
    }

    $('#playlist .content .' + loc).show();
    $('#playlist .content .' + loc).find(':input:first').focus();
    $('#playlist #buttons li.selected').removeClass('selected');
    $('#playlist #buttons li.' + loc).addClass('selected');
  };

  player.el.bind('finished', function() {
    $('#playlist .content a.active').parent().next('li').find('a').click()
  });

  var appendTrackTimer;
  var updateTrackCount = function() {
    $('#buttons .playlist .count').text($('.playlist li').length);
    $('#buttons .playlist .count').addClass('active');
    clearTimeout(appendTrackTimer);
    appendTrackTimer = setTimeout(function() {
      $('#buttons .playlist .count').removeClass('active');
    }, 2000);
  };

  var appendTrack = function(track) {
    if (storage.groups[track.group]) {
      var
      matches = track.title.match(/((^.*) - )?(.*)/),
      artist = track.username,
      title = track.title;

      if (matches[2]) {
        artist = matches[2];
        title = matches[3];
      }

      title = '[' + storage.groups[track.group].name + '] ' + artist + ' - ' + title;
      $('#playlist ul.playlist').append('<li><a class="play-track" href="' + track.url + '">' + title + '</a></li>');
    }
    updateTrackCount();
  };

  var appendGroupTimer;
  var updateGroupCount = function() {
    $('#buttons .groups .count').text($('.group-list li').length);
    $('#buttons .groups .count').addClass('active');
    clearTimeout(appendGroupTimer);
    appendGroupTimer = setTimeout(function() {
      $('#buttons .groups .count').removeClass('active');
    }, 2000);
  };

  var appendGroup = function(name, unique, id, prepend) {
    if (unique !== name) {
      name = name + ' (' + unique + ')';
    }
    // TODO: kick off resolver
    $('.no-groups').hide();
    var markup = '<li class="resolving"><a href="#" class="remove">x</a> <a href="#' + id + '">' + name + '</a></li>';
    $('.group-list').append(markup);

    updateGroupCount();
  };

  var tracklist = {};
  $.each(storage.tracks, function(idx, track) {
    tracklist[track.id] = true;
    appendTrack(track);
  });

  $.each(storage.groups, function(id, group) {
    if (!group || !group.name) {
      reset();
      return false;
    }
    appendGroup(group.name, group.unique, id)
  });

  if ($('.group-list li').length === 0) {
    player.load('http://soundcloud.com/dephas8/dephas8-brain-voltage');
  }

  $('.group-list li a.remove').live('click', function() {
    var groupId = parseInt($(this).next('a').attr('href').replace('#', ''), 10);
    delete storage.groups[groupId];

    if (storage.tracks && storage.tracks.filter) {
      storage.tracks = storage.tracks.filter(function(track) {
        if (track.group === groupId) {
          $('#playlist .playlist a[href="' + track.url + '"]').parent().remove();
          delete tracklist[track.id];
          return false;
        }
        return true;
      });
    }

    if (storage.tracks.length === 0) {
      $('.no-groups').fadeIn();
    }
    save();

    $(this).parent().remove();
    updateTrackCount();
    updateGroupCount();
    return false;
  });

  $('.group-name').bind('keydown', function(e) {
    e.stopPropagation();
    $(this).removeClass('error');
    if (e.keyCode === 13) {
      $('.add-group').click();
    }
  });

  $('.add-group').bind('click', function() {
    var name = $.trim($('.group-name').val());
    if (name === '') {
      $('.group-name').addClass('error');
      return false;
    }

    var url = 'http://soundcloud.com/groups/' + name;
    var ok = false;
    $.ajax({
      url : "http://api.soundcloud.com/resolve.json?client_id=" + player.soundcloud.key + "&url=" + url,
      dataType : 'jsonp',
      success : function(data) {
        if (!storage.groups[data.id]) {
          storage.groups[data.id] = {
            name : data.name,
            unique : data.permalink
          };
          updatePlaylist(data.id);
          appendGroup(data.name, data.permalink, data.id);
          save();
        }

        $('.group-name').val('');
        updateGroupCount();
      },
    });
  });

  player.el.bind('playing', function(e, data) {
    storage.position = data.value;
    save();
  });

  player.el.bind('trackinfo', function(e, data) {
    storage.current = data.id;
    scrollToTrack();
    save();
  });

  player.el.bind('loaded', scrollToTrack);

  var scrollToTrack = function() {
    var current = $('#playlist .playlist a.active');
    var scroller = current.parents('.scroller');

    var coff = current.offset();
    var poff = current.parents('ul').offset();

    if (coff && poff) {
      scroller.animate({
        scrollTop : (coff.top - poff.top) - scroller.height()*.25
      }, 200);
    }
  };

  player.el.bind('volume', function(e, volume) {
    storage.volume = volume;
    player.volume = volume;
    save();
  });

  var updatePlaylist = window.updatePlaylist = function(group_id) {
    if (!group_id) { return; }
    $.ajax({
      url : 'https://api.soundcloud.com/groups/' + group_id + '/tracks.json?client_id=' + player.soundcloud.key,
      dataType : 'json',
      success: function(data) {
        var originalLength = $('#playlist .playlist li').length, track;
        for (var i=0, l=data.length; i<l; i++) {

          if (!tracklist[data[i].id]) {
            track = {
              id: data[i].id,
              url : data[i].permalink_url,
              title : data[i].title,
              username : data[i].user.username,
              group : group_id
            };
            storage.tracks.push(track);

            tracklist[data[i].id] = true;
            appendTrack(track);
          }
        }

        save();

        if (originalLength === 0) {
          window.location.hash = "#playlist";
          $('#playlist .playlist li:first a').click();
        }
      }
    });
  };

  player.el.bind('finished', function() {
    $.each(storage.groups, function(id, group) {
      updatePlaylist(id);
    })
  });

  updatePlaylist();

  $(window).bind('keydown', function(e) {
    switch (e.keyCode) {
      case 39: // right arrow (next track)
        $('#playlist .content a.active').parent().next('li').find('a').click()
      break;

      case 37: // left arrow (previous track)
        $('#playlist .content a.active').parent().prev('li').find('a').click()
      break;

      case 32:
        player.el.find('.controls .pause:visible, .controls .play:visible').click()
      break;

      case 40: // down arrow (volume down)
        player.volumeControl(player.volumeControl()-5);
      break;

      case 38: // up array (volume up)
        player.volumeControl(player.volumeControl()+5);
      break;

      case 221: // right bracket (jump forward)
        player.progress(player.progress() + 500)
      break;

      case 219: // left bracket (jump backward)
        player.progress(player.progress() - 500)
      break;

      case 191: // '/' for showing the help screen
        if (e.shiftKey) {
          window.location.hash = "#help";
        }

      break;

    }
  });

  var urlHash = false;
  setInterval(function() {
    if (urlHash !== window.location.hash) {
      urlHash = window.location.hash;
      navigate();
    }
  }, 50);

  if (window.location.toString().indexOf('developer=true') > -1) {
    $('.developer').fadeIn();
  }

  $(window).load(function() {
    var current = storage.tracks.length, tracks = storage.tracks, found;
    while (current--) {
      if (tracks[current].id === storage.current) {
        found = tracks[current];
        break;
      }
    }

    if (found) {
      $('#playlist a[href="' + found.url + '"]').addClass('active');
      player.load(storage.current);
      player.el.one('sound:created', function() {
        player.el.trigger('loading');
        var targetPercent = storage.position/player.sound.meta.duration;
        player.el.bind('buffering', function waitForBuffer(e, o) {
          if (targetPercent < o.value/o.total) {
            player.el.unbind('buffering', waitForBuffer);
            player.sound.setPosition(storage.position);
            player.el.trigger('loaded');
            player.play();
          }
        });
      });
    } else {
      $('#playlist .content a:first').click();
    }
  });
});