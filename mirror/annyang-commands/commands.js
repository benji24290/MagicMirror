var commands = {
  'vorhersage ein': function() {
    if(errorForecast === false){
      document.getElementById("forecast1").style.display = "block";
      document.getElementById("forecast2").style.display = "block";
      document.getElementById("forecast3").style.display = "block";
    }else{
      document.getElementById('errorText').innerHTML = texts.HOME_ERROR_FORECAST;
      textToVoice(texts.HOME_ERROR_FORECAST,texts.language);
    }
  },
  'wettervorhersage ein': function() {
    if(errorForecast === false){
      document.getElementById("forecast1").style.display = "block";
      document.getElementById("forecast2").style.display = "block";
      document.getElementById("forecast3").style.display = "block";
    }else{
      console.log(texts.title);
      document.getElementById('errorText').innerHTML = texts.HOME_ERROR_FORECAST;
      textToVoice(texts.HOME_ERROR_FORECAST,texts.language);
    }
  },
  'forecast on': function() {
    if(errorForecast === false){
      document.getElementById("forecast1").style.display = "block";
      document.getElementById("forecast2").style.display = "block";
      document.getElementById("forecast3").style.display = "block";
    }else{
      document.getElementById('errorText').innerHTML = texts.HOME_ERROR_FORECAST;
      textToVoice(texts.HOME_ERROR_FORECAST,texts.language);      }
  },
  'vorhersage aus': function() {
    document.getElementById("forecast1").style.display = "none";
    document.getElementById("forecast2").style.display = "none";
    document.getElementById("forecast3").style.display = "none";
  },
  'wettervorhersage aus': function() {
    document.getElementById("forecast1").style.display = "none";
    document.getElementById("forecast2").style.display = "none";
    document.getElementById("forecast3").style.display = "none";
  },
  'forecast off': function() {
    document.getElementById("forecast1").style.display = "none";
    document.getElementById("forecast2").style.display = "none";
    document.getElementById("forecast3").style.display = "none";
  },
  'zitat aus': function() {
    document.getElementById("quote").style.display = "none";
  },
  'quote off': function() {
    document.getElementById("quote").style.display = "none";
  },
  'zitat ein': function() {
    document.getElementById("quote").style.display = "block";
  },
  'quote on': function() {
    document.getElementById("quote").style.display = "block";
  },
  //--------------------Eyetraking---------------------------
  'augen ein': function() {
    webgazer.setGazeListener(function(data, elapsedTime) {
      if (data === null) {
          return;
      }
      var xprediction = data.x; //these x coordinates are relative to the viewport
      var yprediction = data.y; //these y coordinates are relative to the viewport
      //console.log(elapsedTime); //elapsed time is based on time since begin was called
      if(xprediction+40 < window.innerWidth && yprediction+40 < window.innerHeight){
        document.getElementById("prediction").style.position = "absolute";
        document.getElementById("prediction").style.left = xprediction+'px';
        document.getElementById("prediction").style.top = yprediction+'px';
      }
      //check if eyepostition +- 100 of wheater element
      if(xprediction-100 < document.getElementById('weather').getBoundingClientRect().left   && xprediction+100 > document.getElementById('weather').getBoundingClientRect().left && yprediction-100 < document.getElementById('weather').getBoundingClientRect().top   && yprediction+100 > document.getElementById('weather').getBoundingClientRect().top){
        document.getElementById("weather").style.color = 'red';
        document.getElementById("quote").innerHTML="Wetter wurde Selektiert, um  die Stadt zu ändern sagen Sie zum Beispiel: -Stadt Bern- ";
        selectedId = "weather";
      }else{
        if(timer>=200){
          document.getElementById("weather").style.color = 'white';
          document.getElementById("quote").innerHTML="";
          selectedId = "";
          timer = 0;
        }
        timer++;
      }
    }).begin();
  },
  //--------------------Eyetraking---------------------------
  'augen aus': function() {
    if(webgazer){
      webgazer.end();
    }
    console.log("augen aus");
    document.getElementById("prediction").style.left = '-50px';
    document.getElementById("prediction").style.top = '-50px';
  },
  'wie ist das wetter in *stadt': function(stadt) {
    /*forecastWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast?q='+ stadt +'&units=metric&id=524901&APPID='+weatherApiKey;
    currentWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?q='+ stadt +'&units=metric&id=524901&APPID='+weatherApiKey;
    initWeather();
    initForecast();*/
    console.log("wie ist das wetter in"+stadt);
    document.getElementById('loading').style.display = "block";
    speechWetterUrl = 'http://api.openweathermap.org/data/2.5/weather?q='+ stadt +'&units=metric&id=524901&APPID='+weatherApiKey;
    $.getJSON(speechWetterUrl, function(data) {
      var text = 'In ' + data.name + ' ist es ' +data.main.temp+'°C';
      textToVoice(text,texts.language);
      document.getElementById('loading').style.display = "none";
    }).fail(function() {
      var text = "Es konnten keine Wetterdaten für "+stadt+" geladen werden";
      textToVoice(text,language);
      document.getElementById('loading').style.display = "none";
    });
  },
  'stadt *stadt': function(stadt) {
    if(selectedId == "weather"){
      forecastWeatherURL = 'http://api.openweathermap.org/data/2.5/forecast?q='+ stadt +'&units=metric&id=524901&APPID='+weatherApiKey;
      currentWeatherURL = 'http://api.openweathermap.org/data/2.5/weather?q='+ stadt +'&units=metric&id=524901&APPID='+weatherApiKey;
      initWeather();
      initForecast();
    }
  },
  'sprache englisch': function() {
    language = "en";
    annyang.setLanguage("en");
    console.log(language);
    initText();
    initWeatherText();
    initForecast();
    initWeather();
  },
  'language german': function() {
    language = "de";
    annyang.setLanguage("de");
    console.log(language);
    initText();
    initWeatherText();
    initForecast();
    initWeather();
  },
  'news': function() {
    window.location = "../mirror/news";
  },
  'maps': function() {
    window.location = "../mirror/maps";
  }
};
