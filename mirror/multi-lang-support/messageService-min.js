var texts={};initText=function(n){var e=function(){var n=null;return $.ajax({async:!1,global:!1,url:"multi-lang-support/text.json",dataType:"json",success:function(e){n=e}}),n}();return texts=e[n];console.log(texts)},displayError=function(n){document.getElementById("errorText").innerHTML=texts[n]},hideError=function(){document.getElementById("errorText").innerHTML=""},speak=function(n,e){var t=["de","en","es","fr"],r=["de-CH","en-US","es-ES","fr-FR"],o;annyang.abort();for(var s=new SpeechSynthesisUtterance(texts[n]),a=0;a<t.length;a++)e===t[a]&&(o=r[a]);s.lang=o,s.onend=function(n){},window.speechSynthesis.speak(s),annyang.start()};