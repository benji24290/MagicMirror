var commands = {
    'heran zoomen': function() {
      zoomIn();
    },
    'näher': function() {
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
        document.getElementById('locationInput').value = address;
        setLocation();
    },
    'wo ist *address': function(address) {
        toggleSearchMode("single");
        console.log(address);
        document.getElementById('locationInput').value = address;
        setLocation();
    },
    'show *address': function() {
      toggleSearchMode("single");
      document.getElementById('locationInput').value = address;
      setLocation();
    },
    'erstelle eine route von *address1 nach *address2': function(address1, address2) {
        toggleSearchMode("directions");
        console.log(address1 + address2);
        document.getElementById('startInput').value = address1;
        document.getElementById('endInput').value = address2;
        findDirections();
    },
    'news': function() {
        window.location = "../news";
    },
    'home': function() {
        window.location = "../";
    }
};
// 0,003 zoom 22 7333

// 0,1 zoom 16 160

//
