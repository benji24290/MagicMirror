var commands = {
  '20 Minuten': function() {
    selectSource("20min");

  },
  'Tagesanzeiger': function() {
    selectSource("Tagesanzeiger");

  },
  'Blick': function() {
    selectSource("Blick");

  },
  'NZZ': function() {
    selectSource("NZZ");

  },
  'maps': function() {
    window.location = "../maps";

  },
  'home': function() {
    window.location = "../";

  }
};