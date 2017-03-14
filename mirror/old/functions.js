//-------------------------------------------------------------------------------------------------------------------------
//-------------DATA--------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


var settingsURL = 'http://192.168.1.124:8081/settings';
var weatherApiKey = '307fbfa5c26f248d4bf737722b750fad';
var city = 'Zuerich';
var country = 'ch';
var currentWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?q='+ city +','+ country +'&units=metric&id=524901&APPID='+weatherApiKey;
var forecastWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast?q='+ city +','+ country +'&units=metric&id=524901&APPID='+weatherApiKey;
var clockStyle;
var quoteCategories;
var quoteInterval;
var quote = '';
var author = '';
var displayForecast;
var socket;


//-------------------------------------------------------------------------------------------------------------------------
//-------------INITIALISATION----------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


$(document).ready(function () {

    // Get settings from DB
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: settingsURL,
        success : function(data){
            socket = io.connect('http://192.168.1.124:8081');
            socket.on('SETTINGS_UPDATE', function(data) {
                refreshData();
            });
            var settings = JSON.parse(data)[0];

            quoteInterval = settings.quotes.interval * 60000;
            quoteCategories = settings.quotes.selectedCategories;
            clockStyle = settings.layout.selectedClockWidget;
            displayForecast = settings.layout.displayForecast;

            initWeather();
            initQuote();
            startTime('clock')
            $('#clock')[0].classList.add(clockStyle);
        }
    });
});


//-------------------------------------------------------------------------------------------------------------------------
//-------------GUI BUILDER---------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


initWeather = function () {

    $('#container')[0].innerHTML = '<tr><td><div id="clock"></div></td></tr><tr><td><div class="weather"><img id="icon" src=""><br>Current temp: <span id="temp"></span>&#x2103;<br>Current weather: <span id="description"></span><br>Max temp today: <span id="maxTemp"></span>&#x2103;<br>Min temp today: <span id="minTemp"></span>&#x2103;<br></div></td></tr>';

    $.getJSON(currentWeatherURL, function(data) {
        $('#icon')[0].src = 'PNG/'+ data.weather[0].icon +'.png';
        $('#temp')[0].innerHTML = data.main.temp;
        $('#description')[0].innerHTML = data.weather[0].description;
        //$('#maxTemp')[0].innerHTML = data.main.temp_max;
        //$('#minTemp')[0].innerHTML = data.main.temp_min;
    });

    if(displayForecast) {
        var day=1;
        $.getJSON(forecastWeatherURL, function(data) {
            data.list.reverse();
              //while(day == 1){

                var tempDate = "20-00-0000 hallo";
alert(tempDate);
                var date = tempDate.substring(0,10);
alert(date);

                $.each(data.list, function (i, item) {
                  //if(date != item.dt_txt.substring(0,10)){
                    //alert(item.dt_text);
			//date = item.dt_text.substring(0,10);
                  //}

                  var container = $('#container')[0];
                  var imgSrc = 'http://openweathermap.org/img/w/'+ item.weather[0].icon +'.png?id=524901&APPID='+weatherApiKey;
                  var row = container.insertRow(container.children.length+1);
                  var cell = row.insertCell(0);
                  cell.innerHTML = '<td><div id="forecast'+i+'" class="weather"><span id="forecast_time'+i+'">'+ item.dt_text +'</span><br><img id="forecast_icon'+i+'" src="'+imgSrc+'"><br>Weather: <span id="forecast_description'+i+'">'+item.weather[0].description+'</span><br>Max temp: <span id="forecast_maxTemp'+i+'">'+item.main.temp_max+'</span>&#x2103;<br>Min temp: <span id="forecast_minTemp'+i+'">'+item.main.temp_min+'</span>&#x2103;<br></div></td>';
                });
              //}
        });
    }

    setTimeout(function() {
        initWeather();
    }, 3600000); // Reload weather every hour
},

initQuote = function () {
    var container = $('#quote')[0];
    var category = quoteCategories[getRandomInt(0,quoteCategories.length-1)];
    var url = 'http://quotes.rest/qod.json?category='+category;

    $.getJSON(url, function(data) {
        quote = data.contents.quotes[0].quote;
        author = data.contents.quotes[0].author;

        container.innerHTML = quote + '  -  ' + author;
    });

    setTimeout(function() {
        initQuote();
    }, quoteInterval);
},


//-------------------------------------------------------------------------------------------------------------------------
//-------------HELPER---------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


startTime = function (container) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    day = checkTime(day)
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
        i = '0' + i
    };
    return i;
},


getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
},


//-------------------------------------------------------------------------------------------------------------------------
//-------------DAO---------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


refreshData = function () {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: settingsURL,
        success : function(data){
            var settings = JSON.parse(data)[0];

            quoteInterval = settings.quotes.interval * 60000;
            quoteCategories = settings.quotes.selectedCategories;
            clockStyle = settings.layout.selectedClockWidget;
            displayForecast = settings.layout.displayForecast;

            initWeather();
            initQuote();
            startTime('clock')
            $('#clock')[0].classList = '';
            $('#clock')[0].classList.add(clockStyle);
        }
    });
}
