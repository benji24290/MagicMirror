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

getAvailableThemes = function (source, allThemes) {
    var availableThemes = [];
    
    if(source === NEWS_SOURCE.BLICK) {
        $.each(allThemes, function (i, theme) {
            var data = getBlickData(theme);
            $xml = $(data);
            var items = $xml.find('item');
            if(parseBlickData($xml, items, 0)) {
                availableThemes[availableThemes.length] = theme;
            }
        });
    } else if(source === NEWS_SOURCE.TAGI) {
        $.each(allThemes, function (i, theme) {
            var data = getTagiData(theme);
            $xml = $(data);
            var items = $xml.find('item');
            if(parseTagiData($xml, items, 0)) {
                availableThemes[availableThemes.length] = theme;
            }
        });
    } else if(source === NEWS_SOURCE.NZZ) {
        $.each(allThemes, function (i, theme) {
            var data = getNZZData(theme);
            $xml = $(data);
            var items = $xml.find('item');
            if(parseNZZData($xml, items, 0)) {
                availableThemes[availableThemes.length] = theme;
            }
        });
    }
    
    return availableThemes;
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
},

parseTagiData = function ($xml, items, index) {
    var html = '';
    var imgURL = $xml.find('image')[0].children[2].textContent;
    html += '<img src="'+ imgURL +'" alt="Tagi title img">';
    html += '<br><br>'
    html += $xml.find('title')[0].textContent;
    html += '<br><br>';
    html += items[index].children[0].textContent;
    html += '<br><br>'
    html += items[index].children[1].textContent;
    
    return html;
},
    
parseBlickData = function ($xml, items, index) {
    var html = '';
    $item = $(items[index]);
    if($item.find('title')[0] && $item.find('description')[0]) {
        var imgURL = $xml.find('url')[0].textContent;
        html += '<img src="'+ imgURL +'" alt="Blick title img">';
        html += '<br><br>'
        html += $xml.find('title')[0].textContent;
        html += '<br><br>';
        html += $item.find('title')[0].textContent;
        html += '<br>';
        html += $item.find('description')[0].textContent;
    }

    if($item.find('content\\:encoded') && $item.find('content\\:encoded')[0] && $item.find('content\\:encoded')[0].children.length > 0) {
        $.each($item.find('content\\:encoded')[0].children, function (i, content) {
            html += content.outerHTML;
        });
    }
    
    return html;
},

parseNZZData = function ($xml, items, index) {
    $item = $(items[index]);
    var html = '';

    html += $xml.find('title')[0].textContent;
    html += '<br><br>';
    html += $item.find('title')[0].textContent;
    html += '<br>'
    if($item.find('media\\:thumbnail') && $item.find('media\\:thumbnail')[0]) {
        html += '<img src="'+ $item.find('media\\:thumbnail')[0].attributes[2].textContent +'" alt="Tagi title img">';
        html += '<br>'
    }
    if($item.find('description') && $item.find('description')[0]) {
        html += $item.find('description')[0].textContent;
    }
    
    return html;
};