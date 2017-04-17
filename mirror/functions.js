//-------------------------------------------------------------------------------------------------------------------------
//-------------DATA----TEST---------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------
//test comment

var settingsURL = 'http://192.168.1.124:8081/settings';
var weatherApiKey = '307fbfa5c26f248d4bf737722b750fad';
var city = 'Zuerich';
var country = 'ch';
var forecastWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast?q='+ city +','+ country +'&units=metric&id=524901&APPID='+weatherApiKey;
var currentWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?q='+ city +','+ country +'&units=metric&id=524901&APPID='+weatherApiKey;
var clockStyle;
var quoteCategories;
var quoteInterval;
var quote = '';
var author = '';


//-------------------------------------------------------------------------------------------------------------------------
//-------------INITIALISATION----------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


$(document).ready(function () {
    // Get settings from DB
    if (annyang) {
      annyang.setLanguage('de');
  // Let's define our first command. First the text we expect, and then the function it should call
  var commands = {
    'news': function() {
      window.location = "../mirror/news";

    },
    'maps': function() {
      window.location = "../mirror/maps";

    }
  };
  //remove commands from previous pages
  annyang.removeCommands();
  // Add our commands to annyang
  annyang.addCommands(commands);

  // Start listening. You can call this here, or attach this call to an event, button, etc.
  annyang.start();
}
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: settingsURL,
        success : function(data){
            var settings = JSON.parse(data)[0];

            quoteInterval = settings.quotes.interval * 60000;
            quoteCategories = settings.quotes.selectedCategories;
            clockStyle = settings.layout.selectedClockWidget;

            initWeather();
            initForecast();
            initQuote();
            startTime('clock');
            $('#clock')[0].classList.add(clockStyle);
        },
        error: function(errorThrown) {
            startTime('clock');
            $('#clock')[0].classList.add("clock1");
           initWeather();
           initForecast();
        }

    });

});


//-------------------------------------------------------------------------------------------------------------------------
//-------------FUNCTIONS---------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


startTime = function (container) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    day = checkTime(day);
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
        i = '0' + i;
    }
    return i;
},

initWeather = function () {
    $.getJSON(currentWeatherURL, function(data) {

        $('#icon')[0].src = 'PNG/'+ data.weather[0].icon +'.png';
        $('#location')[0].innerHTML = data.name;
        $('#temp')[0].innerHTML = data.main.temp;
        $('#description')[0].innerHTML = translateWeather(data.weather[0].description);
        //$('#maxTemp')[0].innerHTML = data.main.temp_max;
        //$('#minTemp')[0].innerHTML = data.main.temp_min;
    });
},

initForecast = function () {
    $.getJSON(forecastWeatherURL, function(data) {
      var today = new Date();
      var dayObject = today.getDate();
      var nextDay=0; //0=heute 1=morgen 2=übermorgen..
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
              icons[icons.length] = 'PNG/'+ data.list[i].weather[0].icon +'.png';
              weatherText[weatherText.length] = data.list[i].weather[0].description;
            }
            if(temp_minArr[nextDay] > data.list[i].main.temp_min){
              temp_minArr[nextDay] = data.list[i].main.temp_min;
            }
            if(temp_maxArr[nextDay] < data.list[i].main.temp_max){
              temp_maxArr[nextDay] = data.list[i].main.temp_max;
            }
          }else{
              if(icons.length === 0){
                icons[icons.length] = 'PNG/'+ data.list[i].weather[0].icon +'.png';
                weatherText[weatherText.length] = data.list[i].weather[0].description;
              }
              displayIcons[nextDay] = mode(icons);
              displayWeatherText[nextDay] = mode(weatherText);
              icons = [];
              weatherText = [];
              nextDay=nextDay + 1;
          }
            j++;
            i++;
      }
      //console.log(temp_minArr);
      //console.log(displayWeatherText);
      //console.log(displayIcons);
      //console.log(translateWeather(displayWeatherText[0]));
      //$('#maxTemp')[0].innerHTML = data.main.temp_max;
      $('#forecast_minTemp1')[0].innerHTML = temp_minArr[0];
      $('#forecast_maxTemp1')[0].innerHTML = temp_maxArr[0];
      $('#forecast_icon1')[0].src =displayIcons[0];
      $('#forecast_description1')[0].innerHTML =translateWeather(displayWeatherText[0]);


      $('#forecast_minTemp2')[0].innerHTML = temp_minArr[1];
      $('#forecast_maxTemp2')[0].innerHTML = temp_maxArr[1];
      $('#forecast_icon2')[0].src =displayIcons[1];
      $('#forecast_description2')[0].innerHTML =translateWeather(displayWeatherText[1]);


      $('#forecast_minTemp3')[0].innerHTML = temp_minArr[2];
      $('#forecast_maxTemp3')[0].innerHTML = temp_maxArr[2];
      $('#forecast_icon3')[0].src =displayIcons[2];
      $('#forecast_description3')[0].innerHTML =translateWeather(displayWeatherText[2]);

      /*
        $('#icon')[0].src = '/PNG/'+ data.weather[0].icon +'.png';
        $('#temp')[0].innerHTML = data.main.temp;
        */
    });
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

translateWeather = function(text){
  var english = ["clear sky", "Orange", "Apple", "Mango"];
  var german = ["Klarer Himmel", "Orange", "Apple", "Mango"];
  for(var i = 0; i < english.length; i++)
  {
    if(text === english[i]){
      text = german[i];
    }
  }
  return text;

},

getRandomInt = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
