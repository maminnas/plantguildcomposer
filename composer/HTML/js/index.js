      var shape;
      var myCoords;
      var geocoder;
      var map;
      var drawingManager;
      var windspeedLayer;
      
      navigator.geolocation.getCurrentPosition(initialize, displayError);
      
       function displayError(error) {
         var errors = { 
           1: 'Permission denied',
           2: 'Position unavailable',
           3: 'Request timeout'
         };
         alert("Error: " + errors[error.code]);
       }
      
      function initialize(position) {
        geocoder = new google.maps.Geocoder();
      	myCoords = position.coords;
        var mapDiv = document.getElementById('map-canvas');
        map = new google.maps.Map(mapDiv, {
          center: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          zoom: 20,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        });
        var image = 'Images/Tree-icon.png';
        var marker = new google.maps.Marker({
          map: map,
          position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
          draggable: true,
          icon: image
        });
        
       drawingManager = new google.maps.drawing.DrawingManager({
           drawingMode: google.maps.drawing.OverlayType.MARKER,
           drawingControl: true,
           drawingControlOptions: {
             position: google.maps.ControlPosition.TOP_CENTER,
             drawingModes: [
               google.maps.drawing.OverlayType.MARKER,
               google.maps.drawing.OverlayType.CIRCLE,
               google.maps.drawing.OverlayType.POLYGON,
               google.maps.drawing.OverlayType.POLYLINE,
               google.maps.drawing.OverlayType.RECTANGLE
             ]
           },
           markerOptions: {
             icon: 'Tree-icon.png',
             draggable: true
           },
           circleOptions: {
             fillColor: '#ffff00',
             fillOpacity: 1,
             strokeWeight: 1,
             clickable: false,
             editable: true,
             zIndex: 1
           }
         });
         drawingManager.setMap(map);
       
        
        var homeControlDiv = document.createElement('div');
                var homeControl = new HomeControl(homeControlDiv, map);
        
                homeControlDiv.index = 1;
                map.controls[google.maps.ControlPosition.TOP_RIGHT].push(homeControlDiv);
        
       	var weatherLayer = new google.maps.weather.WeatherLayer({
        	temperatureUnits: google.maps.weather.TemperatureUnit.FAHRENHEIT
        	});
        weatherLayer.setMap(map);
        
        var cloudLayer = new google.maps.weather.CloudLayer();
        cloudLayer.setMap(map);
        
        windspeedLayer = new google.maps.weather.WeatherConditions();
        console.log(windspeedLayer);
        windspeedLayer.setMap(map);
      } 
      
      function codeAddress() {
      	
        var address = $('#address').val();
        geocoder.geocode( { 'address': address}, function(results, status) {
          if (status == google.maps.GeocoderStatus.OK) {
          	$("#top_module").slideDown("normal", function(){
          		
          		google.maps.event.trigger(map, 'resize');
          		map.setZoom( map.getZoom() );
          	});
            map.setCenter(results[0].geometry.location);
            var marker = new google.maps.Marker({
                map: map,
                position: results[0].geometry.location
            });
            
          } else {
            console.log(status);
          }
        });
        
      }
      
	
	    /**
	     * The HomeControl adds a control to the map that simply
	     * returns the user to Chicago. This constructor takes
	     * the control DIV as an argument.
	     */
	
	    function HomeControl(controlDiv, map) {
	
	      // Set CSS styles for the DIV containing the control
	      // Setting padding to 5 px will offset the control
	      // from the edge of the map
	      controlDiv.style.padding = '5px';
	
	      // Set CSS for the control border
	      var controlUI = document.createElement('div');
	      controlUI.style.backgroundColor = 'white';
	      controlUI.style.borderStyle = 'solid';
	      controlUI.style.borderWidth = '2px';
	      controlUI.style.cursor = 'pointer';
	      controlUI.style.textAlign = 'center';
	      controlUI.title = 'Click to set the map to Home';
	      controlDiv.appendChild(controlUI);
	
	      // Set CSS for the control interior
	      var controlText = document.createElement('div');
	      controlText.style.fontFamily = 'Arial,sans-serif';
	      controlText.style.fontSize = '12px';
	      controlText.style.paddingLeft = '4px';
	      controlText.style.paddingRight = '4px';
	      controlText.innerHTML = '<b>Current Location</b>';
	      controlUI.appendChild(controlText);
	
	      // Setup the click event listeners: simply set the map to
	      // Chicago
	      google.maps.event.addDomListener(controlUI, 'click', function() {
	        map.panTo(new google.maps.LatLng(myCoords.latitude, myCoords.longitude))
	      });
	
	    }

      google.maps.event.addDomListener(window, 'load', initialize);