var texts = {};
var weatherConditionText = {};

initText = function(language){
    var textdata = (function() {
        var textdata = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "multi-lang-support/text.json",
            'dataType': "json",
            'success': function (data) {
                textdata = data;
            },
            'error': function (error) {
                $.ajax({
                    'async': false,
                    'global': false,
                    'url': "../multi-lang-support/text.json",
                    'dataType': "json",
                    'success': function (data) {
                        textdata = data;
                    }
                });
            }
        });
        return textdata;
    })();
    
    texts = textdata[language];
    return texts;
},
    
initWeatherText = function(language){
    var weatherdata = (function() {
        var weatherdata = null;
        $.ajax({
            'async': false,
            'global': false,
            'url': "multi-lang-support/weather.json",
            'dataType': "json",
            'success': function (data) {
                weatherdata = data;
            }
        });
        return weatherdata;
    })();
    
    weatherConditionText = weatherdata[language];
    return weatherConditionText;
},
    
getText = function (key) {
    return texts[key];
},

displayError = function (key) {
    document.getElementById('errorText').innerHTML = texts[key];
    window.setTimeout(function() {
      hideError();
    }, 9000);
},

hideError = function () {
    document.getElementById('errorText').innerHTML = '';
},

speak = function(key, lang){
  var langCode = ["de", "en", "es", "fr"];
  var langCodeVoice = ["de-CH", "en-US", "es-ES", "fr-FR"];
  var voiceCode;
  annyang.abort();
  var msg = new SpeechSynthesisUtterance( texts[key] );
  for(var i = 0; i < langCode.length; i++)
  {
    if(lang === langCode[i]){
      voiceCode = langCodeVoice[i];
    }
  }
  msg.lang = voiceCode;
  msg.onend = function(e) {
      annyang.start();
  };
  window.speechSynthesis.speak(msg);
}
