$(document).on "pageinit", ->
   if navigator.geolocation
      $.mobile.showPageLoadingMsg()
      navigator.geolocation.watchPosition (data) ->
         $('.position').show();
         $('.lat').html(data.coords.latitude.toString().substring(0,9) + ',&nbsp;');
         $('.lon').html(data.coords.longitude.toString().substring(0,9));
         $.mobile.hidePageLoadingMsg()
         true
   true


