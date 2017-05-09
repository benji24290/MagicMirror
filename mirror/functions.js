//-------------------------------------------------------------------------------------------------------------------------
//-------------DATA--------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


var weatherApiKey = '307fbfa5c26f248d4bf737722b750fad';
var city = 'Zuerich';
var country = 'ch';
var forecastWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast?q='+ city +','+ country +'&units=metric&id=524901&APPID='+weatherApiKey;
var currentWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?q='+ city +','+ country +'&units=metric&id=524901&APPID='+weatherApiKey;
var clockStyle;
var quoteCategories;
var quoteInterval;
var language = "de";
var quote = '';
var author = '';
var timer = 0; //wie lange ein element selected ist
var selectedId; //die ID des selceted element
var errorForecast = false;
var weatherInterval = 900000; //time to weather refresh DEFAULT 900000
var weatherConditionText;


//-------------------------------------------------------------------------------------------------------------------------
//-------------INITIALISATION----------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


$(document).ready(function () {

    if (annyang) {
        annyang.setLanguage(language);
        //remove commands from previous pages
        annyang.removeCommands();
        // Add our commands to annyang
        //the commands are located in a separated file: annyang-commands/commands.js
        annyang.addCommands(commands);
        // Start listening
        annyang.start();
    }
    
    setupData(DATA_TYPE.HOME);

});


//-------------------------------------------------------------------------------------------------------------------------
//-------------FUNCTIONS---------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


initWeather = function () {
    console.log("start init weather...");
    
    $.getJSON(currentWeatherURL, function(data) {
        document.getElementById('weather').style.display = "block";
        $('#icon')[0].src = 'images/'+ data.weather[0].icon +'.png';
        $('#location')[0].innerHTML = data.name;
        $('#temp')[0].innerHTML = data.main.temp;
        $('#description')[0].innerHTML = weatherConditionText["w"+data.weather[0].id];
        console.log("finish init weather successfully");
    }).fail(function() {
        displayError('HOME_ERROR_WEATHER');
        speak('HOME_ERROR_WEATHER',language);
        document.getElementById('weather').style.display = "none";
        console.log("finish init weather with error");
    });

    // Refresh weather after 15min
    setTimeout(function() {
        initWeather();
    }, weatherInterval);
},

initForecast = function () {
    console.log("start init forecast...");
    
    $.getJSON(forecastWeatherURL, function(data) {
        var today = new Date();
        var dayObject = today.getDate();
        var nextDay = 0; // 0=heute 1=morgen 2=übermorgen..
        var i = 0;
        var j = 1;
        var temp_min = 200;
        var temp_max = -200;
        var displayIcons = [];
        var displayWeatherText = [];
        var temp_minArr=['200','200','200','200','200','200'];
        var temp_maxArr=['-200','-200','-200','-200','-200','-200'];
        var weatherText = [];
        var icons = [];
        
        while(data.list[j]){
            if(data.list[i].dt_txt.substring(9,10).localeCompare(data.list[j].dt_txt.substring(9,10)) === 0){
                if(data.list[i].weather[0].icon.endsWith('d')) {
                icons[icons.length] = 'images/'+ data.list[i].weather[0].icon +'.png';
                weatherText[weatherText.length] = data.list[i].weather[0].id;
            }
            if(temp_minArr[nextDay] > data.list[i].main.temp_min){
                temp_minArr[nextDay] = data.list[i].main.temp_min;
            }
            if(temp_maxArr[nextDay] < data.list[i].main.temp_max){
                temp_maxArr[nextDay] = data.list[i].main.temp_max;
            }
            }else{
                if(icons.length === 0){
                    icons[icons.length] = 'images/'+ data.list[i].weather[0].icon +'.png';
                    weatherText[weatherText.length] = data.list[i].weather[0].id;
                }
                displayIcons[nextDay] = mode(icons);
                displayWeatherText[nextDay] = "w"+ mode(weatherText);
                icons = [];
                weatherText = [];
                nextDay=nextDay + 1;
            }
            j++;
            i++;
        }
      
        $('#forecast_time1')[0].innerHTML = getText('HOME_INFO_FORECAST_DAY1');
        $('#forecast_minTemp1')[0].innerHTML = temp_minArr[0];
        $('#forecast_maxTemp1')[0].innerHTML = temp_maxArr[0];
        $('#forecast_icon1')[0].src =displayIcons[0];
        $('#forecast_description1')[0].innerHTML = weatherConditionText[displayWeatherText[0]];

        $('#forecast_time2')[0].innerHTML = getText('HOME_INFO_FORECAST_DAY2');
        $('#forecast_minTemp2')[0].innerHTML = temp_minArr[1];
        $('#forecast_maxTemp2')[0].innerHTML = temp_maxArr[1];
        $('#forecast_icon2')[0].src =displayIcons[1];
        $('#forecast_description2')[0].innerHTML =weatherConditionText[displayWeatherText[1]];

        $('#forecast_time3')[0].innerHTML = getText('HOME_INFO_FORECAST_DAY3');
        $('#forecast_minTemp3')[0].innerHTML = temp_minArr[2];
        $('#forecast_maxTemp3')[0].innerHTML = temp_maxArr[2];
        $('#forecast_icon3')[0].src = displayIcons[2];
        $('#forecast_description3')[0].innerHTML = weatherConditionText[displayWeatherText[2]];

        console.log("finish init forecast successfully");
    }).fail(function() {
        displayError('HOME_ERROR_FORECAST');
        speak('HOME_ERROR_FORECAST',language);
        document.getElementById("forecast1").style.display = "none";
        document.getElementById("forecast2").style.display = "none";
        document.getElementById("forecast3").style.display = "none";
        errorForecast=true;
        
        console.log("finish init forecast with error");
    });
    
    // Refresh forecast after 15min
    setTimeout(function() {
        initForecast();
    }, weatherInterval);
},

initQuote = function () {
    console.log("start init quote...");
    
    var container = $('#quote')[0];
    var category = quoteCategories[getRandomInt(0,quoteCategories.length-1)];
    var url = 'http://quotes.rest/qod.json?category='+category;

    $.getJSON(url, function(data) {
        quote = data.contents.quotes[0].quote;
        author = data.contents.quotes[0].author;
        container.innerHTML = quote + '  -  ' + author;
        console.log("finish init forecast successfully");
    }).fail(function(){
        console.log("finish init forecast with error");
    });

    // Refresh quote
    setTimeout(function() {
        initQuote();
    }, quoteInterval);
};