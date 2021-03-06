(function() {

  $(function() {
    var $delay, $form, $growl, $imgs, $options, $pipesize, $usechain, cleanGrowl, loader, notify, randomSrcs, refresh;
    loader = null;
    $imgs = $('#imgs');
    $growl = $('#growl');
    $form = $('form').bind('submit', function(e) {
      e.preventDefault();
      return refresh();
    });
    $usechain = $('[name=usechain]', $form);
    $options = $('.options', $form);
    $pipesize = $('[name=pipesize]', $form);
    $delay = $('[name=delay]', $form);
    $usechain.filter('[value=yes]').click(function() {
      $options.css('opacity', 1);
      $pipesize.prop('disabled', false);
      return $delay.prop('disabled', false);
    });
    $usechain.filter('[value=no]').click(function() {
      $options.css('opacity', 0.5);
      $pipesize.prop('disabled', true);
      return $delay.prop('disabled', true);
    });
    cleanGrowl = function() {
      var $items;
      $items = $growl.find('div');
      if ($items.size() > 30) return $($items.get().pop()).remove();
    };
    notify = function(msg) {
      var $item;
      msg = msg.replace(/\?.+/, '');
      $item = $("<div>" + msg + "</div>");
      $item.prependTo($growl);
      return cleanGrowl();
    };
    randomSrcs = function() {
      var i, random, srcs;
      srcs = [];
      random = $.now();
      for (i = 1; i <= 50; i++) {
        srcs.push("../imgs/" + i + ".jpg?" + random);
      }
      return srcs;
    };
    return refresh = function() {
      var delay, options, pipesize, usechain;
      if (loader) loader.kill();
      $imgs.empty();
      if ($usechain.filter(':checked').val() === 'yes') usechain = true;
      pipesize = $pipesize.val() * 1;
      delay = $delay.val() * 1;
      if (usechain) {
        options = {
          pipesize: pipesize,
          delay: delay
        };
      } else {
        options = {};
      }
      options.srcs = randomSrcs();
      loader = $.ImgLoader(options);
      loader.bind('itemload', function($img) {
        $imgs.append($img);
        notify("itemload fired: " + ($img.attr('src')));
        return setTimeout((function() {
          return $img.css('opacity', 1);
        }), 1);
      });
      loader.bind('allload', function() {
        return notify('allload fired');
      });
      return loader.load();
    };
  });

}).call(this);
