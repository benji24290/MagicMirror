var socket,twentyMin_Front="http://www.20min.ch/screenplayer/?view=0",twentyMin_Ausland="http://www.20min.ch/screenplayer/?view=129",twentyMin_Schweiz="http://www.20min.ch/screenplayer/?view=63",twentyMin_Wirtschaft="http://www.20min.ch/screenplayer/?view=15",twentyMin_People="http://www.20min.ch/screenplayer/?view=83",twentyMin_Sprot="http://www.20min.ch/screenplayer/?view=67",twentyMin_Digital="http://www.20min.ch/screenplayer/?view=69",twentyMin_Wissen="http://www.20min.ch/screenplayer/?view=77",twentyMin_Auto="http://www.20min.ch/screenplayer/?view=71",twentyMin_Games="http://www.20min.ch/screenplayer/?view=117",clockStyle="clock1",sources,twentyMinThemes=["Front","Ausland","Schweiz","Wirtschaft","People","Sprot","Digital","Wissen","Auto","Games"],tagiThemes=["Front","Zürich","Schweiz","Börse","International","Reisen","Wirtschaft","Kultur","Sport","Auto","Panorama","Digital"],blickThemes=["Front","Ausland","Schweiz","Zürich","Wirtschaft","Sport","People","Life"],nzzThemes=["Front","International","Schweiz","Zürich","Wirtschaft","Finanzen","Kultur","Sport","Panorama","Wissenschaft","Auto","Digital"],currentTheme="",currentSource="";$(document).ready(function(){initText("de"),annyang&&(annyang.setLanguage("de"),annyang.removeCommands(),annyang.addCommands(commands),annyang.start()),gest.options.subscribeWithCallback(function(e){var t="";t=e.direction?e.direction:e.error.message,"Right"==t&&(console.log("r"),selectTheme(currentSource,checkNextTheme("next"))),"Left"==t&&(console.log("l"),selectTheme(currentSource,checkNextTheme("before")))}),gest.start(),setupData(DATA_TYPE.NEWS)}),initNews=function(){sources.sort(compare);var e="";$.each(sources,function(t,n){e+='<li><a href="#" id="'+n.source+'" onclick="selectSource(\''+n.source+"');\">"+n.source+"</a></li>"}),$("#source")[0].innerHTML=e,selectSource(sources[0].source)},selectSource=function(e){if("20min"===e){$("#news")[0].innerHTML="",currentTheme=null;var t="";$.each(twentyMinThemes,function(n,i){t+='<li ><a href="#" id="'+i+'" onclick="selectTheme(\''+e+"', '"+i+"');\">"+i+"</a></li>"}),$("#themes")[0].innerHTML=t,currentSource=e}else if("Tagesanzeiger"===e){$("#news")[0].innerHTML="",currentTheme=null;var t="";$.each(tagiThemes,function(n,i){t+='<li><a href="#" id="'+i+'" onclick="selectTheme(\''+e+"', '"+i+"');\">"+i+"</a></li>"}),$("#themes")[0].innerHTML=t,currentSource=e}else if("Blick"===e){$("#news")[0].innerHTML="",currentTheme=null;var t="";$.each(blickThemes,function(n,i){t+='<li><a href="#" id="'+i+'" onclick="selectTheme(\''+e+"', '"+i+"');\">"+i+"</a></li>"}),$("#themes")[0].innerHTML=t,currentSource=e}else if("NZZ"===e){$("#news")[0].innerHTML="",currentTheme=null;var t="";$.each(nzzThemes,function(n,i){t+='<li><a href="#" id="'+i+'" onclick="selectTheme(\''+e+"', '"+i+"');\">"+i+"</a></li>"}),$("#themes")[0].innerHTML=t,currentSource=e}document.getElementById("20min").className="nSelectedNews",document.getElementById("NZZ").className="nSelectedNews",document.getElementById("Tagesanzeiger").className="nSelectedNews",document.getElementById("Blick").className="nSelectedNews",document.getElementById(e).className="selectedNews",selectTheme(e,"Front")},selectTheme=function(e,t){if($("#news")[0].innerHTML="<b>"+getText("NEWS_ERROR_NO_DATA"),"20min"===e){var n=window["twentyMin_"+t];$("#news")[0].innerHTML='<iframe src="'+n+'" style="width : 100%; height : 700px;"></iframe>',currentTheme=t}else if("Tagesanzeiger"===e){currentTheme=t;var i=getTagiData(t);buildTagiData(i,0,t)}else if("Blick"===e){currentTheme=t;var i=getBlickData(t);buildBlickData(i,0,t)}else if("NZZ"===e){currentTheme=t;var i=getNZZData(t);buildNZZData(i,0,t)}$("#themes li a").removeClass("selectedTheme"),document.getElementById(t).className="selectedTheme"},buildTagiData=function(e,t,n){if(currentTheme===n){$xml=$(e);var i=$xml.find("item");i[t]||(t=0);var r="";r+='<img src="'+$xml.find("image")[0].children[2].textContent+'" alt="Tagi title img">',r+="<br><br>",r+=$xml.find("title")[0].textContent,r+="<br><br>",r+=i[t].children[0].textContent,r+="<br><br>",r+=i[t].children[1].textContent,$("#news")[0].innerHTML=r,setTimeout(function(){buildTagiData(e,t+1,n)},5e3)}},buildBlickData=function(e,t,n){if(currentTheme===n){$xml=$(e);var i=$xml.find("item");if(i.length>0){i[t]||(t=0),$item=$(i[t]);var r="";if($item.find("title")[0]&&$item.find("description")[0]){var c=$xml.find("url")[0].textContent;r+='<img src="'+c+'" alt="Blick title img">',r+="<br><br>",r+=$xml.find("title")[0].textContent,r+="<br><br>",r+=$item.find("title")[0].textContent,r+="<br>",r+=$item.find("description")[0].textContent}$item.find("content\\:encoded")&&$item.find("content\\:encoded")[0]&&$item.find("content\\:encoded")[0].children.length>0&&$.each($item.find("content\\:encoded")[0].children,function(e,t){r+=t.outerHTML}),$("#news")[0].innerHTML=r,setTimeout(function(){buildBlickData(e,t+1,n)},5e3)}}},buildNZZData=function(e,t,n){if(currentTheme===n){$xml=$(e);var i=$xml.find("item");i[t]||(t=0),$item=$(i[t]);var r="";r+=$xml.find("title")[0].textContent,r+="<br><br>",r+=$item.find("title")[0].textContent,r+="<br>",r+='<img src="'+$item.find("media\\:thumbnail")[0].attributes[2].textContent+'" alt="Tagi title img">',r+="<br>",r+=$item.find("description")[0].textContent,$("#news")[0].innerHTML=r,setTimeout(function(){buildNZZData(e,t+1,n)},5e3)}};