//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------DATA------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------

var map;
var socket;

var DIRECTIONS = {
  LEFT : {value: "left"},
  RIGHT: {value: "right"},
  UP : {value: "up"},
  DOWN : {value: "down"}
};

//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------INITIALISATION--------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


$(document).ready(function () {

    if (annyang) {
        annyang.setLanguage('de');
        //remove commands from previous pages
        annyang.removeCommands();
        // Add our commands to annyang
        annyang.addCommands(commands);
        // Start listening
        annyang.start();
    }
    
    setupData(DATA_TYPE.MAPS);
});


//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------GUI BUILDER-----------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


initMap = function () {
    // Set texts
    $('#location')[0].innerHTML = getText('MAPS_INFO_LOCATION');
    $('#go')[0].innerHTML = getText('MAPS_INFO_GO');
    
    // Create a map object and specify the DOM element for display.
    map = new google.maps.Map($('#map')[0], {
      center: {lat: -34.397, lng: 150.644},
      scrollwheel: false,
      zoom: 8
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        map.setCenter(pos);
        }, function() {});
    }
},
    
findDirections = function () {
 
    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay);
},
    
calculateAndDisplayRoute = function (directionsService, directionsDisplay) {
    
    // travel mode: DRIVING, WALKING, BICYCLING, TRANSIT (BUS, RAIL, SUBWAY, TRAIN, TRAM)
    
    
    directionsService.route({
        
        origin: $('#startInput')[0].value,
        destination: $('#endInput')[0].value,
        travelMode: 'TRANSIT'
        
    }, function(response, status) {
      
        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            showDetails(response);
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    });
},

showDetails = function (response) {
    
    var message = '';
    $.each(response.routes[0].legs, function (i, leg) {
        if(leg.departure_time) {
            message += 'departure: ' + leg.departure_time.text + '\n';
        }
        if(leg.arrival_time) {
            message += 'arrival: ' + leg.arrival_time.text + '\n';
        }
        message += 'distance: ' + leg.distance.text + '\n';
        message += 'durcation: ' + leg.duration.text + '\n';
        $.each(leg.steps, function (i, step) {
            message += i+1 + '. ' + step.instructions + '\n';
        });
    });
    alert(message);
},
    
toggleSearchMode = function (element) {
    if(element === 'single') {
        $('#singleLocation').show();
        $('#directions').hide();
    }else if(element === 'directions') {
        $('#singleLocation').hide();
        $('#directions').show();
    }
    
    moveOnMap(DIRECTIONS.DOWN);
    moveOnMap(DIRECTIONS.UP);
    moveOnMap(DIRECTIONS.LEFT);
    moveOnMap(DIRECTIONS.RIGHT);
},
    
moveOnMap = function (direction) {
    
    var actualLat = map.getCenter().lat(); // Y-Axis
    var actualLng = map.getCenter().lng(); // X-Axis
    var pos = {
        lat: actualLat,
        lng: actualLng
    };
    
    if(direction === DIRECTIONS.UP) {
        var newLat = actualLat + 5;
        var pos = {
            lat: newLat,
            lng: actualLng
        };
    } else if(direction === DIRECTIONS.DOWN) {
        var newLat = actualLat - 5;
        var pos = {
            lat: newLat,
            lng: actualLng
        };
    } else if(direction === DIRECTIONS.LEFT) {
        var newLng = actualLng - 5;
        var pos = {
            lat: actualLat,
            lng: newLng
        };
    } else if(direction === DIRECTIONS.RIGHT) {
        var newLng = actualLng + 5;
        var pos = {
            lat: actualLat,
            lng: newLng
        };
    } 
    map.setCenter(pos);
},

zoomIn = function(){
  if(map.zoom <= 21){
    //console.log("if");
    map.setZoom(map.zoom + 1);
  }else{
    console.log("max zoomin");
  }
},

zoomOut = function(){
    if(map.zoom >= 3){
      //console.log("if");
      map.setZoom(map.zoom - 1);
    }else{
      console.log("max zoomout");
    }

};