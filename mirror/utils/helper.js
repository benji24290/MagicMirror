//--------------------HOME-----------------------------------------------------------------------------------------------------------------

mode = function(array){
    if(array.length === 0)
        return null;
    var modeMap = {};
    var maxEl = array[0], maxCount = 1;
    for(var i = 0; i < array.length; i++)
    {
        var el = array[i];
        if(modeMap[el] === null)
            modeMap[el] = 1;
        else
            modeMap[el]++;
        if(modeMap[el] > maxCount)
        {
            maxEl = el;
            maxCount = modeMap[el];
        }
    }

    return maxEl;
},

getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
},

//--------------------MAPS-----------------------------------------------------------------------------------------------------------------

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
            url: serverURL+'/address',
            success : function (data) {
                var address = JSON.parse(data).results;
                // TODO: determine zoom level according to returned data
            }
        });
}

//--------------------NEWS----------------------------------------------------------------------------------------------------------------

compare = function (a,b) {
    if (a.priority < b.priority)
        return -1;
    if (a.priority > b.priority)
        return 1;
    return 0;
},

checkNextTheme = function (select) {
    var next, before;
    var themelist;

    if(currentSource){
        if(currentSource == "20min"){
            themelist = twentyMinThemes;
        }
        else if(currentSource == "NZZ"){
            themelist = nzzThemes;
        }
        else if(currentSource == "Tagesanzeiger"){
            themelist = tagiThemes;
        }
        else if(currentSource == "Blick"){
            themelist = blickThemes;
        }

        for(var i=0; i < themelist.length; i++) {
            if(themelist[i] === currentTheme){
                  if(i+1 < themelist.length){
                    next = themelist[i+1];
                  }else{
                    next = themelist[0];
                  }
                  if(i === 0){
                      before = themelist[themelist.length-1];
                      console.log(themelist.length);
                  }else {
                      before = themelist[i-1];
                  }
            }

        }
    }

    if(select == "before"){
        console.log(before+next);
        return before;
    }
    else if(select == "next"){
        console.log(before+next);
        return next;
    }
};
