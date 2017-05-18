var commands = {
    'heran zoomen': function() {
      zoomIn();
    },
    'heraus zoomen': function() {
      zoomOut();
    },
    'zoom in': function() {
      zoomIn();
    },
    'zoom out': function() {
      zoomOut();
    },
    'zeige *address': function(address) {
        toggleSearchMode("single");
        document.getElementById('startInput').innerHTML = address;
        setLocation();
    },
    'show *adress': function() {
      toggleSearchMode("single");
      document.getElementById('startInput').innerHTML = address;
      setLocation();
    },
    'news': function() {
        window.location = "../news";
    },
    'home': function() {
        window.location = "../";
    }
};
