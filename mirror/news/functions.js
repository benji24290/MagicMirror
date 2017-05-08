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


//------------------------------------------------------------------------------------------------------------------------------------------
//--------------------INITIALISATION--------------------------------------------------------------------------------------------------------
//------------------------------------------------------------------------------------------------------------------------------------------


$(document).ready(function () {

    if (annyang) {
        annyang.setLanguage('de');
        //remove commands from previous pages
        annyang.removeCommands();
        // Add our commands to annyang
        annyang.addCommands(commandsNews);
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
    if(name === '20min') {
        $('#news')[0].innerHTML = '';
        currentTheme = null;
         var html = '';
        $.each(twentyMinThemes, function (i, theme) {
            html += '<li ><a href="#" id="'+theme+'" onclick="selectTheme(\''+ name +'\', \''+ theme +'\');">'+ theme +'</a></li>';
        })
        $('#themes')[0].innerHTML = html;
        currentSource = name;
    } else if(name === 'Tagesanzeiger') {
        $('#news')[0].innerHTML = '';
        currentTheme = null;
        var html = '';
        $.each(tagiThemes, function (i, theme) {
            html += '<li><a href="#" id="'+theme+'" onclick="selectTheme(\''+ name +'\', \''+ theme +'\');">'+ theme +'</a></li>';
        })
        $('#themes')[0].innerHTML = html;
        currentSource = name;
    } else if(name === 'Blick') {
        $('#news')[0].innerHTML = '';
        currentTheme = null;
         var html = '';
        $.each(blickThemes, function (i, theme) {
            html += '<li><a href="#" id="'+theme+'" onclick="selectTheme(\''+ name +'\', \''+ theme +'\');">'+ theme +'</a></li>';
        })
        $('#themes')[0].innerHTML = html;
        currentSource = name;
    } else if(name === 'NZZ') {
        $('#news')[0].innerHTML = '';
        currentTheme = null;
         var html = '';
        $.each(nzzThemes, function (i, theme) {
            html += '<li><a href="#" id="'+theme+'" onclick="selectTheme(\''+ name +'\', \''+ theme +'\');">'+ theme +'</a></li>';
        })
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
    if(currentTheme === theme) {

        $xml = $(data);
        var items = $xml.find('item');
        if(!items[index]) {
            index = 0;
        }

        var html = '';
        var imgURL = $xml.find('image')[0].children[2].textContent;
        html += '<img src="'+ imgURL +'" alt="Tagi title img">';
        html += '<br><br>'
        html += $xml.find('title')[0].textContent;
        html += '<br><br>';
        html += items[index].children[0].textContent;
        html += '<br><br>'
        html += items[index].children[1].textContent;

        $('#news')[0].innerHTML = html;

        setTimeout(function() {
            buildTagiData(data, index+1, theme);
        }, 5000);
    }
},

buildBlickData = function (data, index, theme) {
    if(currentTheme === theme) {

        $xml = $(data);
        var items = $xml.find('item');

        if(items.length > 0) {
            if(!items[index]) {
                index = 0;
            }

            $item = $(items[index]);
            var html = '';

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

            $('#news')[0].innerHTML = html;

            setTimeout(function() {
                buildBlickData(data, index+1, theme);
            }, 5000);
        }
    }
},

buildNZZData = function (data, index, theme) {
    if(currentTheme === theme) {

        $xml = $(data);
        var items = $xml.find('item');
        if(!items[index]) {
            index = 0;
        }
        $item = $(items[index]);
        var html = '';

        html += $xml.find('title')[0].textContent;
        html += '<br><br>';
        html += $item.find('title')[0].textContent;
        html += '<br>'
        html += '<img src="'+ $item.find('media\\:thumbnail')[0].attributes[2].textContent +'" alt="Tagi title img">';
        html += '<br>'
        html += $item.find('description')[0].textContent;

        $('#news')[0].innerHTML = html;

        setTimeout(function() {
            buildNZZData(data, index+1, theme);
        }, 5000);
    }
};