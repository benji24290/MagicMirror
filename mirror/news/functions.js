//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------DATA------------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


var socket;

var twentyMin_Front = 'http://www.20min.ch/screenplayer/?view=0';
var twentyMin_Ausland = 'http://www.20min.ch/screenplayer/?view=129';
var twentyMin_Schweiz = 'http://www.20min.ch/screenplayer/?view=63';
var twentyMin_Wirtschaft = 'http://www.20min.ch/screenplayer/?view=15';
var twentyMin_People = 'http://www.20min.ch/screenplayer/?view=83';
var twentyMin_Sprot = 'http://www.20min.ch/screenplayer/?view=67';
var twentyMin_Digital = 'http://www.20min.ch/screenplayer/?view=69';
var twentyMin_Wissen = 'http://www.20min.ch/screenplayer/?view=77';
var twentyMin_Auto = 'http://www.20min.ch/screenplayer/?view=71';
var twentyMin_Games = 'http://www.20min.ch/screenplayer/?view=117';

var clockStyle = 'clock1';
var sources;

var twentyMinThemes = ['Front', 'Ausland', 'Schweiz', 'Wirtschaft', 'People', 'Sprot', 'Digital', 'Wissen', 'Auto', 'Games'];
var tagiThemes = ['Front', 'Zürich', 'Schweiz', 'Börse', 'International', 'Reisen', 'Wirtschaft', 'Kultur', 'Sport', 'Auto', 'Panorama', 'Digital'];
var blickThemes = ['Front', 'Ausland', 'Schweiz', 'Zürich', 'Wirtschaft', 'Sport', 'People', 'Life'];
var nzzThemes = ['Front', 'International', 'Schweiz', 'Zürich', 'Wirtschaft', 'Finanzen', 'Kultur', 'Sport', 'Panorama', 'Wissenschaft', 'Auto', 'Digital'];

var currentTheme = '';
var currentSource = '';

var NEWS_SOURCE = {
  TWENTY_MIN : {value: "20Min"},
  BLICK: {value: "Blick"},
  NZZ : {value: "NZZ"},
  TAGI : {value: "Tagesanzeiger"}
};


//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------INITIALISATION--------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


$(document).ready(function () {
    initText("de");
    if (annyang) {
        annyang.setLanguage('de');
        //remove commands from previous pages
        annyang.removeCommands();
        // Add our commands to annyang
        annyang.addCommands(commands);
        // Start listening
        annyang.start();
    }

    gest.options.subscribeWithCallback(function(gesture) {
        var message = '';
        if (gesture.direction) {
            message = gesture.direction;
        } else {
            message = gesture.error.message;
        }

        if(message == "Right"){
            console.log("r");
            selectTheme(currentSource,checkNextTheme("next"));
        }
        if(message == "Left"){
            console.log("l");
            selectTheme(currentSource,checkNextTheme("before"));
        }
    });

    gest.start();

    setupData(DATA_TYPE.NEWS);
});


//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------GUI BUILDER-----------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


initNews = function () {
    sources.sort(compare);
    var html = '';
    $.each(sources, function (i, source) {
        html += '<li><a href="#" id="'+ source.source +'" onclick="selectSource(\''+ source.source +'\');">'+ source.source +'</a></li>';
    })
    $('#source')[0].innerHTML = html;
    selectSource(sources[0].source);
},


//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------HELPER----------------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


selectSource = function (name) {
    if(name === '20min' && currentSource !== name) {
        $('#news')[0].innerHTML = '';
        currentTheme = null;
         var html = '';
        $.each(twentyMinThemes, function (i, theme) {
            html += '<li ><a href="#" id="'+theme+'" onclick="selectTheme(\''+ name +'\', \''+ theme +'\');">'+ theme +'</a></li>';
        });
        $('#themes')[0].innerHTML = html;
        currentSource = name;
    } else if(name === 'Tagesanzeiger' && currentSource !== name) {
        $('#news')[0].innerHTML = '';
        currentTheme = null;
        var html = '';
        var availables = getAvailableThemes(NEWS_SOURCE.TAGI, tagiThemes);
        $.each(availables, function (i, theme) {
            html += '<li><a href="#" id="'+theme+'" onclick="selectTheme(\''+ name +'\', \''+ theme +'\');">'+ theme +'</a></li>';
        });
        $('#themes')[0].innerHTML = html;
        currentSource = name;
    } else if(name === 'Blick' && currentSource !== name) {
        $('#news')[0].innerHTML = '';
        currentTheme = null;
         var html = '';
        $.each(getAvailableThemes(NEWS_SOURCE.BLICK, blickThemes), function (i, theme) {
            html += '<li><a href="#" id="'+theme+'" onclick="selectTheme(\''+ name +'\', \''+ theme +'\');">'+ theme +'</a></li>';
        });
        $('#themes')[0].innerHTML = html;
        currentSource = name;
    } else if(name === 'NZZ' && currentSource !== name) {
        $('#news')[0].innerHTML = '';
        currentTheme = null;
         var html = '';
        $.each(getAvailableThemes(NEWS_SOURCE.NZZ, nzzThemes), function (i, theme) {
            html += '<li><a href="#" id="'+theme+'" onclick="selectTheme(\''+ name +'\', \''+ theme +'\');">'+ theme +'</a></li>';
        });
        $('#themes')[0].innerHTML = html;
        currentSource = name;
    }

    document.getElementById("20min").className="nSelectedNews";
    document.getElementById("NZZ").className="nSelectedNews";
    document.getElementById("Tagesanzeiger").className="nSelectedNews";
    document.getElementById("Blick").className="nSelectedNews";
    document.getElementById(name).className="selectedNews";
    selectTheme(name,"Front");
},

selectTheme = function (source, theme) {
    $('#news')[0].innerHTML = '<b>'+getText('NEWS_ERROR_NO_DATA');+'</b>';

    if(source === '20min') {
        var url = window['twentyMin_'+theme];
        $('#news')[0].innerHTML = '<iframe src="'+ url +'" style="width : 100%; height : 700px;"></iframe>';
        currentTheme = theme;

    } else if(source === 'Tagesanzeiger') {
        currentTheme = theme;
        var data = getTagiData(theme);
        buildTagiData(data, 0, theme);

    } else if(source === 'Blick') {
        currentTheme = theme;
        var data = getBlickData(theme);
        buildBlickData(data, 0, theme);

    } else if(source === 'NZZ') {
        currentTheme = theme;
        var data = getNZZData(theme);
        buildNZZData(data, 0, theme);

    }
    $("#themes li a").removeClass("selectedTheme");
    document.getElementById(theme).className="selectedTheme";
},

buildTagiData = function (data, index, theme) {
    if(currentSource === 'Tagesanzeiger' && currentTheme === theme) {

        $xml = $(data);
        var items = $xml.find('item');
        if(!items[index]) {
            index = 0;
        }

        $('#news')[0].innerHTML = parseTagiData($xml, items, index);

        setTimeout(function() {
            buildTagiData(data, index+1, theme);
        }, 5000);
    }
},

buildBlickData = function (data, index, theme) {
    if(currentSource === 'Blick' && currentTheme === theme) {

        $xml = $(data);
        var items = $xml.find('item');

        if(items.length > 0) {
            if(!items[index]) {
                index = 0;
            }

            $('#news')[0].innerHTML = parseBlickData($xml, items, index);

            setTimeout(function() {
                buildBlickData(data, index+1, theme);
            }, 5000);
        }
    }
},

buildNZZData = function (data, index, theme) {
    if(currentSource === 'NZZ' && currentTheme === theme) {

        $xml = $(data);
        var items = $xml.find('item');
        if(!items[index]) {
            index = 0;
        }

        $('#news')[0].innerHTML = parseNZZData($xml, items, index);

        setTimeout(function() {
            buildNZZData(data, index+1, theme);
        }, 5000);
    }
};
