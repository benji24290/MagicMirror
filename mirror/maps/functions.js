//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------DATA------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------

var map;
var socket;
var lastDirectionsDetails;

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
    gest.options.subscribeWithCallback(function(gesture) {
        var message = '';
        if (gesture.direction) {
            message = gesture.direction;
        } else {
            message = gesture.error.message;
        }

        if(message == "Right"){
            console.log("r");
            moveOnMap(DIRECTIONS.RIGHT);
        }else if(message == "Left"){
            console.log("l");
            moveOnMap(DIRECTIONS.LEFT);
        }else if(message == "Long up"){
            console.log("u");
            moveOnMap(DIRECTIONS.UP);
        }else if(message == "Long down"){
            console.log("d");
            moveOnMap(DIRECTIONS.DOWN);
        }else{
          console.log(message);
        }
    });
    gest.start();
});



//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------GUI BUILDER-----------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


initMap = function () {
    // Set texts
    //$('#location')[0].innerHTML = getText('MAPS_INFO_LOCATION');
    //$('#go')[0].innerHTML = getText('MAPS_INFO_GO');

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
findDirectionsWith = function (mode) {

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay, mode);
},

findDirections = function () {

    var directionsService = new google.maps.DirectionsService;
    var directionsDisplay = new google.maps.DirectionsRenderer;
    directionsDisplay.setMap(map);
    calculateAndDisplayRoute(directionsService, directionsDisplay, "DRIVING");
},

calculateAndDisplayRoute = function (directionsService, directionsDisplay, mode) {

    // travel mode: DRIVING, WALKING, BICYCLING, TRANSIT (BUS, RAIL, SUBWAY, TRAIN, TRAM)

    directionsService.route({

        origin: $('#startInput')[0].value,
        destination: $('#endInput')[0].value,

        travelMode: mode


    }, function(response, status) {

        if (status === 'OK') {
            directionsDisplay.setDirections(response);
            console.log(mode);
            showDetails(response);
        } else {
            console.log('Directions request failed due to ' + status);
        }
    });
},

showDetails = function (response) {

    var message = '';
    var speach = '';
    $.each(response.routes[0].legs, function (i, leg) {
        if(leg.departure_time) {
            message += 'Abfahrt: ' + leg.departure_time.text + '\n';
            speach += 'Abfahrt: ' + leg.departure_time.text + '\n';
        }
        if(leg.arrival_time) {
            message += 'Ankunft: ' + leg.arrival_time.text + '\n';
            speach += '. Ankunft: ' + leg.arrival_time.text + '\n';
        }
        message += 'Distanz: ' + leg.distance.text + '\n';
        message += 'Dauer: ' + leg.duration.text + '<br>';
        speach += 'die Distanz beträgt ' + leg.distance.text + '\n';
        speach += 'und dauert ' + leg.duration.text ;
        $.each(leg.steps, function (i, step) {
            message += i+1 + '. ' + step.instructions + '<br>';
        });
    });
    //alert(message);
    speak(speach ,"de")
    document.getElementById('detailsCenter').innerHTML = message;
},

toggleSearchMode = function (element) {
    if(element === 'single') {
        $('#singleLocation').show();
        $('#directions').hide();
    }else if(element === 'directions') {
        $('#singleLocation').hide();
        $('#directions').show();
    }
},

moveOnMap = function (direction) {

    /*var actualLat = map.getCenter().lat(); // Y-Axis
    var actualLng = map.getCenter().lng(); // X-Axis
    var pos = {
        lat: actualLat,
        lng: actualLng
    };*/

    if(direction === DIRECTIONS.UP) {
        /*var newLat = actualLat + 5*map.zoom/30;
        console.log(map.zoom);
        var pos = {
            lat: newLat,
            lng: actualLng
        };*/
        map.panBy(0, -400)
    } else if(direction === DIRECTIONS.DOWN) {
        map.panBy(0, 400)
    } else if(direction === DIRECTIONS.LEFT) {
        map.panBy(-400, 0)
    } else if(direction === DIRECTIONS.RIGHT) {
        map.panBy(400, 0)
    }
},


zoomIn = function(){
  if(map.zoom <= 21){
    //console.log("if");
    map.setZoom(map.zoom + 1);
  }else{
    speak("maximales zoom  erreicht", "de");
    console.log("max zoomin");
  }
},

zoomOut = function(){
    if(map.zoom >= 3){
      //console.log("if");
      map.setZoom(map.zoom - 1);
    }else{
      speak("minimales zoom  erreicht", "de");
      console.log("max zoomout");
    }

};
