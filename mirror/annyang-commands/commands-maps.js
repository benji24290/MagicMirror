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
    'zeige *adress': function() {
        window.location = "../news";
    },
    'show *adress': function() {
        window.location = "../news";
    },
    'news': function() {
        window.location = "../news";
    },
    'home': function() {
        window.location = "../";
    }
};
