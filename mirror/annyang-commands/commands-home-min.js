var commands={"vorhersage ein":function(){!1===errorForecast?(document.getElementById("forecast1").style.display="block",document.getElementById("forecast2").style.display="block",document.getElementById("forecast3").style.display="block"):(document.getElementById("errorText").innerHTML=texts.HOME_ERROR_FORECAST,textToVoice(texts.HOME_ERROR_FORECAST,texts.language))},"wettervorhersage ein":function(){!1===errorForecast?(document.getElementById("forecast1").style.display="block",document.getElementById("forecast2").style.display="block",document.getElementById("forecast3").style.display="block"):(console.log(texts.title),document.getElementById("errorText").innerHTML=texts.HOME_ERROR_FORECAST,textToVoice(texts.HOME_ERROR_FORECAST,texts.language))},"forecast on":function(){!1===errorForecast?(document.getElementById("forecast1").style.display="block",document.getElementById("forecast2").style.display="block",document.getElementById("forecast3").style.display="block"):(document.getElementById("errorText").innerHTML=texts.HOME_ERROR_FORECAST,textToVoice(texts.HOME_ERROR_FORECAST,texts.language))},"vorhersage aus":function(){document.getElementById("forecast1").style.display="none",document.getElementById("forecast2").style.display="none",document.getElementById("forecast3").style.display="none"},"wettervorhersage aus":function(){document.getElementById("forecast1").style.display="none",document.getElementById("forecast2").style.display="none",document.getElementById("forecast3").style.display="none"},"forecast off":function(){document.getElementById("forecast1").style.display="none",document.getElementById("forecast2").style.display="none",document.getElementById("forecast3").style.display="none"},"zitat aus":function(){document.getElementById("quote").style.display="none"},"quote off":function(){document.getElementById("quote").style.display="none"},"zitat ein":function(){document.getElementById("quote").style.display="block"},"quote on":function(){document.getElementById("quote").style.display="block"},"augen ein":function(){webgazer.setGazeListener(function(e,t){if(null!==e){var n=e.x,o=e.y;n+40<window.innerWidth&&o+40<window.innerHeight&&(document.getElementById("prediction").style.position="absolute",document.getElementById("prediction").style.left=n+"px",document.getElementById("prediction").style.top=o+"px"),n-100<document.getElementById("weather").getBoundingClientRect().left&&n+100>document.getElementById("weather").getBoundingClientRect().left&&o-100<document.getElementById("weather").getBoundingClientRect().top&&o+100>document.getElementById("weather").getBoundingClientRect().top?(document.getElementById("weather").style.color="red",document.getElementById("cityTextArea").value=texts.HOME_INFO_TEXTBOX_CITY,document.getElementById("quote").innerHTML=texts.HOME_INFO_QUOTE_CITY_1,document.getElementById("cityTextArea").style.display="block",selectedId="weather"):(timer>=200&&(document.getElementById("cityTextArea").style.display="none",document.getElementById("weather").style.color="white",document.getElementById("quote").innerHTML="",selectedId="",timer=0),timer++)}}).begin()},"augen aus":function(){webgazer&&webgazer.end(),console.log("augen aus"),document.getElementById("prediction").style.left="-50px",document.getElementById("prediction").style.top="-50px"},"wie ist das wetter in *stadt":function(e){console.log("wie ist das wetter in"+e),document.getElementById("loading").style.display="block",speechWetterUrl="http://api.openweathermap.org/data/2.5/weather?q="+e+"&units=metric&id=524901&APPID="+weatherApiKey,$.getJSON(speechWetterUrl,function(e){var t="In "+e.name+" ist es "+e.main.temp+"°C";textToVoice(t,texts.language),document.getElementById("loading").style.display="none"}).fail(function(){var t="Es konnten keine Wetterdaten für "+e+" geladen werden";textToVoice(t,language),document.getElementById("loading").style.display="none"})},"what is the weather in *stadt":function(e){console.log("wie ist das wetter in"+e),document.getElementById("loading").style.display="block",speechWetterUrl="http://api.openweathermap.org/data/2.5/weather?q="+e+"&units=metric&id=524901&APPID="+weatherApiKey,$.getJSON(speechWetterUrl,function(e){var t="In "+e.name+" its "+e.main.temp+"°C";textToVoice(t,texts.language),document.getElementById("loading").style.display="none"}).fail(function(){var t="Weather data for "+e+" could not be loaded";textToVoice(t,language),document.getElementById("loading").style.display="none"})},"stadt *stadt":function(e){"weather"==selectedId&&(document.getElementById("cityTextArea").value=e,document.getElementById("quote").innerHTML=texts.HOME_INFO_QUOTE_CITY_2)},"city *stadt":function(e){"weather"==selectedId&&(document.getElementById("cityTextArea").value=e,document.getElementById("quote").innerHTML=texts.HOME_INFO_QUOTE_CITY_2)},"bestätigen":function(){if("weather"==selectedId){var e=document.getElementById("cityTextArea").value;forecastWeatherURL="http://api.openweathermap.org/data/2.5/forecast?q="+e+"&units=metric&id=524901&APPID="+weatherApiKey,currentWeatherURL="http://api.openweathermap.org/data/2.5/weather?q="+e+"&units=metric&id=524901&APPID="+weatherApiKey,document.getElementById("quote").innerHTML="",document.getElementById("cityTextArea").style.display="none",initWeather(),initForecast()}},save:function(){if("weather"==selectedId){var e=document.getElementById("cityTextArea").value;forecastWeatherURL="http://api.openweathermap.org/data/2.5/forecast?q="+e+"&units=metric&id=524901&APPID="+weatherApiKey,currentWeatherURL="http://api.openweathermap.org/data/2.5/weather?q="+e+"&units=metric&id=524901&APPID="+weatherApiKey,document.getElementById("quote").innerHTML="",document.getElementById("cityTextArea").style.display="none",initWeather(),initForecast()}},"sprache englisch":function(){console.log("changing to english"),language="en",annyang.setLanguage("en"),console.log(language),initText(language),initWeatherText(language),initForecast(),initWeather()},"language german":function(){language="de",annyang.setLanguage("de"),console.log(language),initText(language),initWeatherText(language),initForecast(),initWeather()},news:function(){window.location="../mirror/news"},maps:function(){window.location="../mirror/maps"}};