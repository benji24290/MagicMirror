var serverURL="http://localhost:8081",settingsURL="http://localhost:8081/settings",defaultLang="de",defaultSources=[{source:"20min",priority:0},{source:"Blick",priority:1},{source:"Tagesanzeiger",priority:2},{source:"NZZ",priority:3}],DATA_TYPE={HOME:{value:"Home"},NEWS:{value:"News"},MAPS:{value:"Maps"}};setupData=function(e){$.ajax({type:"GET",contentType:"application/json",url:settingsURL,success:function(t){var s=JSON.parse(t)[0];e===DATA_TYPE.HOME?(connectSocket(DATA_TYPE.HOME),setupHome(s)):e===DATA_TYPE.NEWS?(connectSocket(DATA_TYPE.NEWS),setupNews(s)):e===DATA_TYPE.MAPS&&(connectSocket(DATA_TYPE.MAPS),setupMaps(s))},error:function(t){e===DATA_TYPE.HOME?errorSetupHome():e===DATA_TYPE.NEWS?errorSetupNews():e===DATA_TYPE.MAPS&&errorSetupMaps()}})},connectSocket=function(e){socket=io.connect(serverURL),socket.on("SETTINGS_UPDATE",function(t){refreshData(e)})},setupHome=function(e){language=e.general.selectedLang.code,annyang.setLanguage(language),initText(language),initWeatherText(language),clockStyle=e.layout.selectedClockWidget,startTime("clock"),$("#clock")[0].classList.add(clockStyle),initWeather(),initForecast(),quoteInterval=6e4*e.quotes.interval,quoteCategories=e.quotes.selectedCategories,initQuote()},errorSetupHome=function(){initText(defaultLang),initWeatherText(defaultLang),startTime("clock"),$("#clock")[0].classList.add("clock1"),initWeather(),initForecast(),displayError("HOME_ERROR_SETTINGS")},setupNews=function(e){language=e.general.selectedLang.code,annyang.setLanguage(language),initText(language),clockStyle=e.layout.selectedClockWidget,startTime("clock"),$("#clock")[0].classList.add(clockStyle),sources=e.news.sourcePriorities,initNews()},errorSetupNews=function(){startTime("clock"),$("#clock")[0].classList.add(clockStyle),sources=defaultSources,initNews(),displayError("HOME_ERROR_SETTINGS")},setupMaps=function(e){language=e.general.selectedLang.code,annyang.setLanguage(language),initText(language),clockStyle=e.layout.selectedClockWidget,startTime("clock"),$("#clock")[0].classList.add(clockStyle),initMap()},errorSetupMaps=function(){startTime("clock"),$("#clock")[0].classList.add("clock1"),initMap(),displayError("HOME_ERROR_SETTINGS")},getTagiData=function(e){var t=null;if("Front"===e)var s="http://www.tagesanzeiger.ch/rss.html";else if("Zürich"===e)var s="http://www.tagesanzeiger.ch/zuerich/rss.html";else if("Börse"===e)var s="http://www.tagesanzeiger.ch/boerse/rss.html";else var s="http://www.tagesanzeiger.ch/"+e.toLowerCase()+"/rss.html";return $.ajax({async:!1,type:"GET",contentType:"text/xml",url:s,success:function(e){t=e},error:function(e){t=e}}),t},getBlickData=function(e){var t=null;if("Front"===e)var s="/news/rss";else if("Zürich"===e)var s="/news/schweiz/zuerich/rss";else var s="/"+e.toLowerCase()+"/rss";var a={host:"www.blick.ch",path:s,method:"http"};return $.ajax({async:!1,type:"POST",data:JSON.stringify(a),contentType:"application/json",url:serverURL+"/news",success:function(e){t=e},error:function(e){t=e}}),t},getNZZData=function(e){var t=null;if("Front"===e)var s="/startseite.rss";else if("Zürich"===e)var s="/zuerich.rss";else if("Kultur"===e)var s="/feuilleton.rss";else if("Auto"===e)var s="/mobilitaet/auto-mobil.rss";else var s="/"+e.toLowerCase()+".rss";var a={host:"www.nzz.ch",path:s,method:"https"};return $.ajax({async:!1,type:"POST",data:JSON.stringify(a),contentType:"application/json",url:serverURL+"/news",success:function(e){t=e},error:function(e){t=e}}),t};