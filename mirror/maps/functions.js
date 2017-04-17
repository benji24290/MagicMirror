//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------DATA------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


var settingsURL = 'http://localhost:8081/settings';
var map;
var socket;


//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------INITIALISATION--------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


$(document).ready(function () {

  if (annyang) {
    annyang.setLanguage('de');
    // Let's define our first command. First the text we expect, and then the function it should call
    var commands = {
        'news': function() {
            window.location = "../news";

          },
        'home': function() {
            window.location = "../";

          }
      };

    //remove commands from previous pages
    annyang.removeCommands();
    // Add our commands to annyang
    annyang.addCommands(commands);

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start();
  }
    // Get settings from DB
  $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: settingsURL,
        success : function(data){
            socket = io.connect('http://localhost:8081');
            socket.on('SETTINGS_UPDATE', function(data) {
                refreshData();
            });
            var settings = JSON.parse(data)[0];

            clockStyle = settings.layout.selectedClockWidget;

            startTime('clock');
            $('#clock')[0].classList.add(clockStyle);
            initMap();
        }
    });

});


//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------GUI BUILDER-----------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


initMap = function () {
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


//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------HELPER----------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


//--------------------CLOCK-----------------------------------------------------------------------------------------------------------------

startTime = function (container) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    day = checkTime(day);
    month = checkTime(month);
    m = checkTime(m);
    s = checkTime(s);

    $('#'+container)[0].innerHTML = h + ':' + m + ':' + s + '<br><span class="date">' + day+'.'+month+'.'+year+'</span>';

    setTimeout(function() {
        startTime(container);
    }, 500);
},

checkTime = function (i) {
    if (i < 10) {
        i = '0' + i;
    }
    return i;
},

//--------------------MAP-----------------------------------------------------------------------------------------------------------------

setLocation = function () {
    var geocoder = new google.maps.Geocoder();
    var address = $('#location')[0].value;

    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            var latitude = results[0].geometry.location.lat();
            var longitude = results[0].geometry.location.lng();

            var pos = {
                lat: results[0].geometry.location.lat(),
                lng: results[0].geometry.location.lng()
            };
            map.setCenter(pos);
            map.setZoom(15);
            getZoomLevel(pos);
        }
    });
},

getZoomLevel = function (pos) {

    var data = {host : 'maps.googleapis.com', path : '/maps/api/geocode/json?latlng='+ pos.lat +','+ pos.lng +'&sensor=true', method : 'https'};
    $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:8081/address',
            success : function (data) {
                var address = JSON.parse(data).results;
                // TODO: determine zoom level according to returned data
            }
        });
},


//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------DAO-------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


refreshData = function () {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: settingsURL,
        success : function(data){
            var settings = JSON.parse(data)[0];

            clockStyle = settings.layout.selectedClockWidget;

            startTime('clock');
            $('#clock')[0].classList = '';
            $('#clock')[0].classList.add(clockStyle);
            initMap();
        }
    });
};
