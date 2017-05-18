//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------DATA------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------

var map;
var socket;


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




};

zoomIn = function(){
  if(map.zoom <= 21){
    //console.log("if");
    map.setZoom(map.zoom + 1);
  }else{
    console.log("max zoomin");
  }
};
zoomOut = function(){
    if(map.zoom >= 3){
      //console.log("if");
      map.setZoom(map.zoom - 1);
    }else{
      console.log("max zoomout");
    }

};
