var texts = {};

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
          }
      });
      return textdata;
  })();
    texts = textdata[language];
    return texts;
    console.log(texts);
},

displayError = function (key) {
    document.getElementById('errorText').innerHTML = texts[key];
    window.setTimeout(function() {
      document.getElementById('errorText').innerHTML = "";
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
  //  annyang.start();
  };
  window.speechSynthesis.speak(msg);
  annyang.start();
}
