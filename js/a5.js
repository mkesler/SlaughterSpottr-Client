(function() {
  // home page 
  $(document).on("pageinit", "#home", function() {
    $.ajax({
      url:'http://slaughter-spottr.herokuapp.com/api/count',
      success:function(data) {
        $('.intro').html('Slaughter has been spotted ' + data.count + ' times!');
      },
      error: function(jqXHR) {
        console.log(jqXHR);
      }
    });
  });

  // report location page
  $(document).on("pageinit", "#report", function() {
    // load change screen locations
    getAddresses(function(results) {
      $('address').html(results[1].formatted_address);
    });

    // refresh button
    $('.refreshLnk').on('click', function() {
      getAddresses(function(results) {
        $('address').html(results[1].formatted_address);
      });
    }); 

    // report button
    $('.reportBtn').on('click', function(ev) {
      ev.preventDefault();
      $.ajax({
        type: 'PUT',
        url:'http://slaughter-spottr.herokuapp.com/api/add?location=' + localStorage.getItem('lat') + ',' + localStorage.getItem('lon'),
        success:function(data) {
          $('.alert').fadeIn('slow').delay(2000).fadeOut('slow');
          $.ajax({
            url:'http://slaughter-spottr.herokuapp.com/api/count',
            success:function(data) {
              $('.intro').html('Slaughter has been spotted ' + data.count + ' times!');
            },
            error: function(jqXHR) {
              console.log(jqXHR);
            }
          });
        },
        error: function(data) {
          console.log(data);
        }
      });
    });
  });

  // map page
  $(document).on( 'pageshow', '.ui-page', function () {
    document.getElementById('map_canvas').style.display="block";
    // canvas
    var mapOptions = {
      center: new google.maps.LatLng(37.541311, -77.53576),
      zoom: 10,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    var map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);    
    
    // markers
    $.ajax({
      url:'http://slaughter-spottr.herokuapp.com/api/list',
      success:function(data) {
        console.log(data);
        $.each(data, function() {
          var infoWindow = new google.maps.InfoWindow({
            content: this.date
          }); 

          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(this.lat,this.lon),
          }); 

          marker.setMap(map);

          google.maps.event.addListener(marker, 'click', function() {
            infoWindow.open(map, marker);
          });
        });
        google.maps.event.trigger(map, 'resize');      
      },
      error: function(jqXHR) {
        console.log(jqXHR);
      }
    });
  });
}());

function getAddresses(callback) {
  if (navigator.geolocation) {
    $.mobile.showPageLoadingMsg();
    navigator.geolocation.getCurrentPosition(function(data) {
      localStorage.setItem('lat', data.coords.latitude);
      localStorage.setItem('lon', data.coords.longitude);
      var latlng   = new google.maps.LatLng(data.coords.latitude, data.coords.longitude),
          geocoder = new google.maps.Geocoder();

      src = "http://maps.googleapis.com/maps/api/staticmap?center=[lat],[lon]&zoom=12&size=120x120&maptype=roadmap&markers=color:red%7Ccolor:red%7C[lat],[lon]&sensor=true";
      src = src.replace(/\[lat\]/g, latlng.Xa).replace(/\[lon\]/g, latlng.Ya);
      $('.location').find('img').attr('src', src);

      geocoder.geocode({'latLng': latlng}, function(results, status) {
        $.mobile.hidePageLoadingMsg();
        if(callback) {callback(results);}
      });
    }, function() { // error/denied
      $.mobile.hidePageLoadingMsg();
      $('.report').replaceWith("This application requires geolocation!");
    }, 
    {
      enableHighAccuracy:true
    });
  }
}
