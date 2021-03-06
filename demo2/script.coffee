$ ->

  loader = null

  $imgs = $('#imgs')
  $growl = $('#growl')

  $form = $('form').bind 'submit', (e) ->
    e.preventDefault()
    refresh()

  $usechain = $('[name=usechain]', $form)
  $options = $('.options', $form)
  $pipesize = $('[name=pipesize]', $form)
  $delay = $('[name=delay]', $form)

  $usechain.filter('[value=yes]').click ->
    $options.css 'opacity', 1
    $pipesize.prop 'disabled', false
    $delay.prop 'disabled', false
  $usechain.filter('[value=no]').click ->
    $options.css 'opacity', 0.5
    $pipesize.prop 'disabled', true
    $delay.prop 'disabled', true

  cleanGrowl = ->
    $items = $growl.find 'div'
    if $items.size() > 30
      $($items.get().pop()).remove()

  notify = (msg) ->
    msg = msg.replace(/\?.+/,'')
    $item = $("<div>#{msg}</div>")
    $item.prependTo($growl)
    cleanGrowl()

  randomSrcs = ->
    srcs = []
    random = $.now()
    srcs.push "../imgs/#{i}.jpg?#{random}" for i in [1..50]
    srcs

  refresh = ->
    
    if loader then loader.kill()

    $imgs.empty()
    usechain = true if $usechain.filter(':checked').val() == 'yes'
    pipesize = $pipesize.val()*1
    delay = $delay.val()*1

    if usechain
      options =
        pipesize: pipesize
        delay: delay
    else
      options = {}

    options.srcs = randomSrcs()

    loader = $.ImgLoader options

    loader.bind 'itemload', ($img) ->
      $imgs.append $img
      notify ("itemload fired: #{$img.attr 'src'}")
      setTimeout (-> $img.css 'opacity', 1), 1
    loader.bind 'allload', ->
      notify 'allload fired'

    loader.load()

