var settingsURL="http://192.168.1.124:8081/settings",weatherApiKey="307fbfa5c26f248d4bf737722b750fad",city="Zuerich",country="ch",forecastWeatherURL="http://api.openweathermap.org/data/2.5/forecast?q="+city+","+country+"&units=metric&id=524901&APPID="+weatherApiKey,currentWeatherURL="http://api.openweathermap.org/data/2.5/weather?q="+city+","+country+"&units=metric&id=524901&APPID="+weatherApiKey,clockStyle,quoteCategories,quoteInterval,language="de",quote="",author="",timer=0,selectedId,errorForecast=!1,weatherInterval=9e5,texts;$(document).ready(function(){if(initText(),annyang){annyang.setLanguage(language);var e={"vorhersage ein":function(){!1===errorForecast?(document.getElementById("forecast1").style.display="block",document.getElementById("forecast2").style.display="block",document.getElementById("forecast3").style.display="block"):(document.getElementById("errorText").innerHTML=texts.HOME_ERROR_FORECAST,textToVoice(texts.HOME_ERROR_FORECAST,texts.language))},"wettervorhersage ein":function(){!1===errorForecast?(document.getElementById("forecast1").style.display="block",document.getElementById("forecast2").style.display="block",document.getElementById("forecast3").style.display="block"):(console.log(texts.title),document.getElementById("errorText").innerHTML=texts.HOME_ERROR_FORECAST,textToVoice(texts.HOME_ERROR_FORECAST,texts.language))},"forecast on":function(){!1===errorForecast?(document.getElementById("forecast1").style.display="block",document.getElementById("forecast2").style.display="block",document.getElementById("forecast3").style.display="block"):(document.getElementById("errorText").innerHTML=texts.HOME_ERROR_FORECAST,textToVoice(texts.HOME_ERROR_FORECAST,texts.language))},"vorhersage aus":function(){document.getElementById("forecast1").style.display="none",document.getElementById("forecast2").style.display="none",document.getElementById("forecast3").style.display="none"},"wettervorhersage aus":function(){document.getElementById("forecast1").style.display="none",document.getElementById("forecast2").style.display="none",document.getElementById("forecast3").style.display="none"},"forecast off":function(){document.getElementById("forecast1").style.display="none",document.getElementById("forecast2").style.display="none",document.getElementById("forecast3").style.display="none"},"zitat aus":function(){document.getElementById("quote").style.display="none"},"quote off":function(){document.getElementById("quote").style.display="none"},"zitat ein":function(){document.getElementById("quote").style.display="block"},"quote on":function(){document.getElementById("quote").style.display="block"},"augen ein":function(){webgazer.setGazeListener(function(e,t){if(null!==e){var n=e.x,o=e.y;n+40<window.innerWidth&&o+40<window.innerHeight&&(document.getElementById("prediction").style.position="absolute",document.getElementById("prediction").style.left=n+"px",document.getElementById("prediction").style.top=o+"px"),n-100<document.getElementById("weather").getBoundingClientRect().left&&n+100>document.getElementById("weather").getBoundingClientRect().left&&o-100<document.getElementById("weather").getBoundingClientRect().top&&o+100>document.getElementById("weather").getBoundingClientRect().top?(document.getElementById("weather").style.color="red",document.getElementById("quote").innerHTML="Wetter wurde Selektiert, um  die Stadt zu ändern sagen Sie zum Beispiel: -Stadt Bern- ",selectedId="weather"):(timer>=200&&(document.getElementById("weather").style.color="white",document.getElementById("quote").innerHTML="",selectedId="",timer=0),timer++)}}).begin()},"augen aus":function(){webgazer&&webgazer.end(),console.log("augen aus"),document.getElementById("prediction").style.left="-50px",document.getElementById("prediction").style.top="-50px"},"wie ist das wetter in *stadt":function(e){console.log("wie ist das wetter in"+e),document.getElementById("loading").style.display="block",speechWetterUrl="http://api.openweathermap.org/data/2.5/weather?q="+e+"&units=metric&id=524901&APPID="+weatherApiKey,$.getJSON(speechWetterUrl,function(e){var t="In "+e.name+" ist es "+e.main.temp+"°C";textToVoice(t,language),document.getElementById("loading").style.display="none"}).fail(function(){var t="Es konnten keine Wetterdaten für "+e+" geladen werden";textToVoice(t,language),document.getElementById("loading").style.display="none"})},"stadt *stadt":function(e){"weather"==selectedId&&(forecastWeatherURL="http://api.openweathermap.org/data/2.5/forecast?q="+e+"&units=metric&id=524901&APPID="+weatherApiKey,currentWeatherURL="http://api.openweathermap.org/data/2.5/weather?q="+e+"&units=metric&id=524901&APPID="+weatherApiKey,initWeather(),initForecast())},"sprache englisch":function(){language="en",annyang.setLanguage("en"),console.log(language),initForecast(),initWeather()},"language german":function(){language="de",annyang.setLanguage("de"),console.log(language),initForecast(),initWeather()},news:function(){window.location="../mirror/news"},maps:function(){window.location="../mirror/maps"}};annyang.removeCommands(),annyang.addCommands(e),annyang.start()}$.ajax({type:"GET",contentType:"application/json",url:settingsURL,success:function(e){var t=JSON.parse(e)[0];quoteInterval=6e4*t.quotes.interval,quoteCategories=t.quotes.selectedCategories,clockStyle=t.layout.selectedClockWidget,language=t.general.selectedLang.code,initWeather(),initForecast(),initQuote(),startTime("clock"),$("#clock")[0].classList.add(clockStyle)},error:function(e){startTime("clock"),$("#clock")[0].classList.add("clock1"),document.getElementById("errorText").innerHTML="Ihre Einstellungen konnten nicht abgerufen werden.",initWeather(),initForecast()}})}),startTime=function(e){var t=new Date,n=t.getDate(),o=t.getMonth(),a=t.getFullYear(),r=t.getHours(),i=t.getMinutes(),s=t.getSeconds();n=checkTime(n),o=checkTime(o),i=checkTime(i),s=checkTime(s),$("#"+e)[0].innerHTML=r+":"+i+":"+s+'<br><span class="date">'+n+"."+o+"."+a+"</span>",setTimeout(function(){startTime(e)},500)},checkTime=function(e){return e<10&&(e="0"+e),e},initWeather=function(){console.log("getting weather..."),$.getJSON(currentWeatherURL,function(e){$("#icon")[0].src="PNG/"+e.weather[0].icon+".png",$("#location")[0].innerHTML=e.name,$("#temp")[0].innerHTML=e.main.temp,$("#description")[0].innerHTML=translateWeather(e.weather[0].description)}).fail(function(){document.getElementById("errorText").innerHTML=texts.HOME_ERROR_WEATHER,textToVoice(texts.HOME_ERROR_WEATHER,language)}),setTimeout(function(){initWeather()},weatherInterval)},initForecast=function(){console.log("getting forecast..."),$.getJSON(forecastWeatherURL,function(e){for(var t=new Date,n=t.getDate(),o=0,a=0,r=1,i=200,s=-200,c=[],l=[],d=["200","200","200","200","200","200"],u=["-200","-200","-200","-200","-200","-200"],g=[],m=[];e.list[r];)0===e.list[a].dt_txt.substring(9,10).localeCompare(e.list[r].dt_txt.substring(9,10))?(e.list[a].weather[0].icon.endsWith("d")&&(m[m.length]="PNG/"+e.list[a].weather[0].icon+".png",g[g.length]=e.list[a].weather[0].description),d[o]>e.list[a].main.temp_min&&(d[o]=e.list[a].main.temp_min),u[o]<e.list[a].main.temp_max&&(u[o]=e.list[a].main.temp_max)):(0===m.length&&(m[m.length]="PNG/"+e.list[a].weather[0].icon+".png",g[g.length]=e.list[a].weather[0].description),c[o]=mode(m),l[o]=mode(g),m=[],g=[],o+=1),r++,a++;$("#forecast_minTemp1")[0].innerHTML=d[0],$("#forecast_maxTemp1")[0].innerHTML=u[0],$("#forecast_icon1")[0].src=c[0],$("#forecast_description1")[0].innerHTML=translateWeather(l[0]),$("#forecast_minTemp2")[0].innerHTML=d[1],$("#forecast_maxTemp2")[0].innerHTML=u[1],$("#forecast_icon2")[0].src=c[1],$("#forecast_description2")[0].innerHTML=translateWeather(l[1]),$("#forecast_minTemp3")[0].innerHTML=d[2],$("#forecast_maxTemp3")[0].innerHTML=u[2],$("#forecast_icon3")[0].src=c[2],$("#forecast_description3")[0].innerHTML=translateWeather(l[2])}).fail(function(){document.getElementById("errorText").innerHTML="Die Wettervorhersage konnte nicht geladen werden.",document.getElementById("forecast1").style.display="none",document.getElementById("forecast2").style.display="none",document.getElementById("forecast3").style.display="none",errorForecast=!0}),setTimeout(function(){initForecast()},weatherInterval)},initQuote=function(){var e=$("#quote")[0],t=quoteCategories[getRandomInt(0,quoteCategories.length-1)],n="http://quotes.rest/qod.json?category="+t;$.getJSON(n,function(t){quote=t.contents.quotes[0].quote,author=t.contents.quotes[0].author,e.innerHTML=quote+"  -  "+author}),setTimeout(function(){initQuote()},quoteInterval)},mode=function(e){if(0===e.length)return null;for(var t={},n=e[0],o=1,a=0;a<e.length;a++){var r=e[a];null===t[r]?t[r]=1:t[r]++,t[r]>o&&(n=r,o=t[r])}return n},textToVoice=function(e,t){var n=["de","en","es","fr"],o=["de-CH","en-US","es-ES","fr-FR"],a;annyang.abort();for(var r=new SpeechSynthesisUtterance(e),i=0;i<n.length;i++)t===n[i]&&(a=o[i]);r.lang=a,r.onend=function(e){},window.speechSynthesis.speak(r),annyang.start()},translateWeather=function(e){for(var t=["clear sky","Orange","Apple","Mango"],n=["Klarer Himmel","Orange","Apple","Mango"],o=0;o<t.length;o++)e===t[o]&&(e=n[o]);return e},initText=function(){var e=function(){var e=null;return $.ajax({async:!1,global:!1,url:"text.json",dataType:"json",success:function(t){e=t}}),e}();texts=e[language]},getRandomInt=function(e,t){return Math.floor(Math.random()*(t-e+1))+e};