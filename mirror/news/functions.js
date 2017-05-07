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

//var settingsURL = 'http://192.168.1.124:8081/settings';
var settingsURL = 'http://localhost:8081/settings';
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

    // Start listening. You can call this here, or attach this call to an event, button, etc.
    annyang.start();
    }

    gest.options.subscribeWithCallback(function(gesture) {
				var message = '';
				if (gesture.direction) {
					message = gesture.direction;
				} else {
					message = gesture.error.message;
				}

				//console.log(message);
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
            sources = settings.news.sourcePriorities;

            startTime('clock');
            $('#clock')[0].classList.add(clockStyle);
            initNews();
        },
        error : function(error){
          sources = [{"source" : '20min', "priority" : 0}, {"source" : 'Blick', "priority" : 1}, {"source" : 'Tagesanzeiger', "priority" : 2}, {"source" : 'NZZ', "priority" : 3}];
          initNews();
          startTime('clock');
          $('#clock')[0].classList.add(clockStyle);
        }
    });

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


//--------------------NEWS----------------------------------------------------------------------------------------------------------------

compare = function (a,b) {
    if (a.priority < b.priority)
        return -1;
    if (a.priority > b.priority)
        return 1;
    return 0;
},

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
    //document.getElementById("Front").focus();



},

selectTheme = function (source, theme) {
    $('#news')[0].innerHTML = '<b>Currently no data available</b>';

    if(source === '20min') {
        var url = window['twentyMin_'+theme];
        $('#news')[0].innerHTML = '<iframe src="'+ url +'" style="width : 100%; height : 700px;"></iframe>';
        currentTheme = theme;



    } else if(source === 'Tagesanzeiger') {

        if(theme === 'Front') {
            var xmlURL = 'http://www.tagesanzeiger.ch/rss.html';
        } else if(theme === 'Zürich') {
            var xmlURL = 'http://www.tagesanzeiger.ch/zuerich/rss.html';
        } else if(theme === 'Börse') {
            var xmlURL = 'http://www.tagesanzeiger.ch/boerse/rss.html';
        } else {
            var xmlURL = 'http://www.tagesanzeiger.ch/'+theme.toLowerCase()+'/rss.html';
        }

        currentTheme = theme;
        $.ajax({
            type: 'GET',
            contentType: 'text/xml',
            url: xmlURL,
            success : function(data){
                buildTagiData(data, 0, theme);
            }
        });

    } else if(source === 'Blick') {

        if(theme === 'Front') {
            var path = '/news/rss';
        } else if (theme === 'Zürich') {
            var path = '/news/schweiz/zuerich/rss';
        } else {
            var path = '/'+theme.toLowerCase()+'/rss';
        }

        var data = {host : 'www.blick.ch', path : path, method : 'http'};

        currentTheme = theme;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:8081/news',
            success : function (data) {
                buildBlickData(data, 0, theme);
            }
        });

    } else if(source === 'NZZ') {

        if (theme === 'Front') {
            var path = '/startseite.rss';
        } else if (theme === 'Zürich') {
            var path = '/zuerich.rss';
        } else if (theme === 'Kultur') {
            var path = '/feuilleton.rss';
        } else if (theme === 'Auto') {
            var path = '/mobilitaet/auto-mobil.rss';
        } else {
            var path = '/'+theme.toLowerCase()+'.rss';
        }

        var data = {host : 'www.nzz.ch', path : path, method : 'https'};

        currentTheme = theme;

        $.ajax({
            type: 'POST',
            data: JSON.stringify(data),
            contentType: 'application/json',
            url: 'http://localhost:8081/news',
            success : function (data) {
                buildNZZData(data, 0, theme);
            }
        });

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

},
checkNextTheme = function (select) {
  var next;
  var before;
  var themelist;
  if(currentSource){
    if(currentSource == "20min"){
      themelist = twentyMinThemes;
    }
    if(currentSource == "NZZ"){
      themelist = nzzThemes;
    }
    if(currentSource == "Tagesanzeiger"){
      themelist = tagiThemes;
    }
    if(currentSource == "Blick"){
      themelist = blickThemes;
    }

    for(var i=0; i < themelist.length; i++)
    {
        if(themelist[i] === currentTheme)
          if(i+1 < themelist.length){
            next = themelist[i+1];
          }else{
            next = themelist[0];
          }
          if(i === 0){
            before = themelist[themelist.length+1];

          }else {
            before = themelist[i-1];
          }


    }
  }
  if(select == "before"){
    console.log(before+next);
    return before;
  }
  if(select == "next"){
    console.log(before+next);
    return next;
  }

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
            sources = settings.news.sourcePriorities;

            startTime('clock')
            $('#clock')[0].classList = '';
            $('#clock')[0].classList.add(clockStyle);
            initNews();
        }
    });
}
