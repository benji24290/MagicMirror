var map,socket;$(document).ready(function(){annyang&&(annyang.setLanguage("de"),annyang.removeCommands(),annyang.addCommands(commands),annyang.start()),setupData(DATA_TYPE.MAPS)}),initMap=function(){$("#location")[0].innerHTML=getText("MAPS_INFO_LOCATION"),$("#go")[0].innerHTML=getText("MAPS_INFO_GO"),map=new google.maps.Map($("#map")[0],{center:{lat:-34.397,lng:150.644},scrollwheel:!1,zoom:8}),navigator.geolocation&&navigator.geolocation.getCurrentPosition(function(o){var n={lat:o.coords.latitude,lng:o.coords.longitude};map.setCenter(n)},function(){})},zoomIn=function(){map.zoom<=21?map.setZoom(map.zoom+1):console.log("max zoomin")},zoomOut=function(){map.zoom>=3?map.setZoom(map.zoom-1):console.log("max zoomout")};