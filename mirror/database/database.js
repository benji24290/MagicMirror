var serverURL = 'http://localhost:8081';
//var serverURL = 'http://192.168.1.124:8081';
var settingsURL = 'http://localhost:8081/settings';
//var settingsURL = 'http://192.168.1.124:8081/settings';

var defaultLang = "de";
var defaultSources = [{"source" : '20min', "priority" : 0}, {"source" : 'Blick', "priority" : 1}, {"source" : 'Tagesanzeiger', "priority" : 2}, {"source" : 'NZZ', "priority" : 3}];

var DATA_TYPE = {
  HOME : {value: "Home"}, 
  NEWS: {value: "News"}, 
  MAPS : {value: "Maps"}
};

//-------------------------------------------SETUP-------------------------------------------------------------------------------------------------------------

setupData = function (dataType) {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: settingsURL,
        success : function(data){
            var settings = JSON.parse(data)[0];
            
            if(dataType === DATA_TYPE.HOME) {
                connectSocket(DATA_TYPE.HOME);
                setupHome(settings);
            } else if (dataType === DATA_TYPE.NEWS) {
                connectSocket(DATA_TYPE.NEWS);
                setupNews(settings);
            } else if (dataType === DATA_TYPE.MAPS) {
                connectSocket(DATA_TYPE.MAPS);
                setupMaps(settings);
            }
        },
        error: function(error) {
            if(dataType === DATA_TYPE.HOME) {
                errorSetupHome();
            } else if (dataType === DATA_TYPE.NEWS) {
                errorSetupNews();
            } else if (dataType === DATA_TYPE.MAPS) {
                errorSetupMaps();
            }
        }
    });
},

connectSocket = function (dataType) {
    socket = io.connect(serverURL);
    socket.on('SETTINGS_UPDATE', function(data) {
        refreshData(dataType);
    });
},

setupHome = function (settings) {
    language = settings.general.selectedLang.code;
    annyang.setLanguage(language);
    initText(language);
    initWeatherText(language);
            
    clockStyle = settings.layout.selectedClockWidget;
    startTime('clock');
    $('#clock')[0].classList.add(clockStyle);
            
    initWeather();
    initForecast();
            
    quoteInterval = settings.quotes.interval * 60000;
    quoteCategories = settings.quotes.selectedCategories;
    initQuote();
},
    
errorSetupHome = function () {
    initText(defaultLang);
    initWeatherText(defaultLang);
            
    startTime('clock');
    $('#clock')[0].classList.add("clock1");
            
    initWeather();
    initForecast();
            
    displayError('HOME_ERROR_SETTINGS');
},

setupNews = function (settings) {
    language = settings.general.selectedLang.code;
    annyang.setLanguage(language);
    initText(language);
    
    clockStyle = settings.layout.selectedClockWidget;
    startTime('clock');
    $('#clock')[0].classList.add(clockStyle);
    
    sources = settings.news.sourcePriorities;
    initNews();
},
    
errorSetupNews = function () {
    startTime('clock');
    $('#clock')[0].classList.add(clockStyle);
    
    sources = defaultSources;
    initNews();
    
    displayError('HOME_ERROR_SETTINGS');
},
    
setupMaps = function (settings) {
    language = settings.general.selectedLang.code;
    annyang.setLanguage(language);
    initText(language);
    
    clockStyle = settings.layout.selectedClockWidget;
    startTime('clock');
    $('#clock')[0].classList.add(clockStyle);
    
    initMap();
},

errorSetupMaps = function () {
    startTime('clock');
    $('#clock')[0].classList.add("clock1");
    
    initMap();
    
    displayError('HOME_ERROR_SETTINGS');
},

//---------------------------------------------------------------------------------NEWS-LOADER------------------------------------------------------------------

getTagiData = function (theme) {
    var result = null;
    
    if(theme === 'Front') {
        var xmlURL = 'http://www.tagesanzeiger.ch/rss.html';
    } else if(theme === 'Zürich') {
        var xmlURL = 'http://www.tagesanzeiger.ch/zuerich/rss.html';
    } else if(theme === 'Börse') {
        var xmlURL = 'http://www.tagesanzeiger.ch/boerse/rss.html';
    } else {
        var xmlURL = 'http://www.tagesanzeiger.ch/'+theme.toLowerCase()+'/rss.html';
    }
    
    $.ajax({
        'async': false,
        type: 'GET',
        contentType: 'text/xml',
        url: xmlURL,
        success : function(data){
            result = data;
        },
        error : function(error) {
            result = error;
        }
    });
    
    return result;
},
    
getBlickData = function (theme) {
    var result = null;
    
    if(theme === 'Front') {
        var path = '/news/rss';
    } else if (theme === 'Zürich') {
        var path = '/news/schweiz/zuerich/rss';
    } else {
        var path = '/'+theme.toLowerCase()+'/rss';
    }

    var data = {host : 'www.blick.ch', path : path, method : 'http'};

    $.ajax({
        'async': false,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: serverURL+'/news',
        success : function (data) {
            result = data;
        },
        error : function (error) {
            result = error;
        }
    });
    
    return result;
},

getNZZData = function (theme) {
    var result = null;
    
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

    $.ajax({
        'async': false,
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: serverURL+'/news',
        success : function (data) {
            result = data;
        }, error : function (error) {
            result = error;
        }
    });   
    
    return result;
};