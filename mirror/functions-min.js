var settingsURL="http://192.168.1.124:8081/settings",weatherApiKey="307fbfa5c26f248d4bf737722b750fad",city="Zuerich",country="ch",forecastWeatherURL="http://api.openweathermap.org/data/2.5/forecast?q="+city+","+country+"&units=metric&id=524901&APPID="+weatherApiKey,currentWeatherURL="http://api.openweathermap.org/data/2.5/weather?q="+city+","+country+"&units=metric&id=524901&APPID="+weatherApiKey,clockStyle,quoteCategories,quoteInterval,language="de",quote="",author="",timer=0,selectedId,errorForecast=!1,weatherInterval=9e5,texts;$(document).ready(function(){initText(),console.log(texts.language),annyang&&(annyang.setLanguage(language),annyang.removeCommands(),annyang.addCommands(commands),annyang.start()),$.ajax({type:"GET",contentType:"application/json",url:settingsURL,success:function(e){var t=JSON.parse(e)[0];quoteInterval=6e4*t.quotes.interval,quoteCategories=t.quotes.selectedCategories,clockStyle=t.layout.selectedClockWidget,language=t.general.selectedLang.code,initWeather(),initForecast(),initQuote(),startTime("clock"),$("#clock")[0].classList.add(clockStyle)},error:function(e){startTime("clock"),$("#clock")[0].classList.add("clock1"),document.getElementById("errorText").innerHTML="Ihre Einstellungen konnten nicht abgerufen werden.",initWeather(),initForecast()}})}),initWeather=function(){console.log("getting weather..."),$.getJSON(currentWeatherURL,function(e){$("#icon")[0].src="images/"+e.weather[0].icon+".png",$("#location")[0].innerHTML=e.name,$("#temp")[0].innerHTML=e.main.temp,$("#description")[0].innerHTML=translateWeather(e.weather[0].description)}).fail(function(){document.getElementById("errorText").innerHTML=texts.HOME_ERROR_WEATHER,textToVoice(texts.HOME_ERROR_WEATHER,language)}),setTimeout(function(){initWeather()},weatherInterval)},initForecast=function(){console.log("getting forecast..."),$.getJSON(forecastWeatherURL,function(e){for(var t=new Date,n=t.getDate(),a=0,r=0,o=1,i=200,s=-200,c=[],l=[],u=["200","200","200","200","200","200"],g=["-200","-200","-200","-200","-200","-200"],m=[],d=[];e.list[o];)0===e.list[r].dt_txt.substring(9,10).localeCompare(e.list[o].dt_txt.substring(9,10))?(e.list[r].weather[0].icon.endsWith("d")&&(d[d.length]="images/"+e.list[r].weather[0].icon+".png",m[m.length]=e.list[r].weather[0].description),u[a]>e.list[r].main.temp_min&&(u[a]=e.list[r].main.temp_min),g[a]<e.list[r].main.temp_max&&(g[a]=e.list[r].main.temp_max)):(0===d.length&&(d[d.length]="images/"+e.list[r].weather[0].icon+".png",m[m.length]=e.list[r].weather[0].description),c[a]=mode(d),l[a]=mode(m),d=[],m=[],a+=1),o++,r++;$("#forecast_minTemp1")[0].innerHTML=u[0],$("#forecast_maxTemp1")[0].innerHTML=g[0],$("#forecast_icon1")[0].src=c[0],$("#forecast_description1")[0].innerHTML=translateWeather(l[0]),$("#forecast_minTemp2")[0].innerHTML=u[1],$("#forecast_maxTemp2")[0].innerHTML=g[1],$("#forecast_icon2")[0].src=c[1],$("#forecast_description2")[0].innerHTML=translateWeather(l[1]),$("#forecast_minTemp3")[0].innerHTML=u[2],$("#forecast_maxTemp3")[0].innerHTML=g[2],$("#forecast_icon3")[0].src=c[2],$("#forecast_description3")[0].innerHTML=translateWeather(l[2])}).fail(function(){document.getElementById("errorText").innerHTML=texts.HOME_ERROR_FORECAST,document.getElementById("forecast1").style.display="none",document.getElementById("forecast2").style.display="none",document.getElementById("forecast3").style.display="none",errorForecast=!0}),setTimeout(function(){initForecast()},weatherInterval)},initQuote=function(){var e=$("#quote")[0],t=quoteCategories[getRandomInt(0,quoteCategories.length-1)],n="http://quotes.rest/qod.json?category="+t;$.getJSON(n,function(t){quote=t.contents.quotes[0].quote,author=t.contents.quotes[0].author,e.innerHTML=quote+"  -  "+author}),setTimeout(function(){initQuote()},quoteInterval)},mode=function(e){if(0===e.length)return null;for(var t={},n=e[0],a=1,r=0;r<e.length;r++){var o=e[r];null===t[o]?t[o]=1:t[o]++,t[o]>a&&(n=o,a=t[o])}return n},textToVoice=function(e,t){var n=["de","en","es","fr"],a=["de-CH","en-US","es-ES","fr-FR"],r;annyang.abort();for(var o=new SpeechSynthesisUtterance(e),i=0;i<n.length;i++)t===n[i]&&(r=a[i]);o.lang=r,o.onend=function(e){},window.speechSynthesis.speak(o),annyang.start()},translateWeather=function(e){for(var t=["clear sky","Orange","Apple","Mango"],n=["Klarer Himmel","Orange","Apple","Mango"],a=0;a<t.length;a++)e===t[a]&&(e=n[a]);return e},initText=function(){var e=function(){var e=null;return $.ajax({async:!1,global:!1,url:"multi-lang-support/text.json",dataType:"json",success:function(t){e=t}}),e}();texts=e[language]},getRandomInt=function(e,t){return Math.floor(Math.random()*(t-e+1))+e};