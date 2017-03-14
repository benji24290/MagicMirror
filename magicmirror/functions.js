//-------------------------------------------------------------------------------------------------------------------------
//-------------DATA--------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------

var settingsURL = 'http://192.168.1.124:8081/settings';
var page = {};

// General
var languages;
var birthdays;
var selectedLang;

// News
var news;

// Quotes
var availableQuoteCategorys;
var selectedQuoteCategorys;
var currentSelectedCategory;
var quoteInterval;

// Layout
var clockWidgets;
var selectedClockWidget;
var displayForecast = true;

// socket
var socket;


//-------------------------------------------------------------------------------------------------------------------------
//-------------INITIATION--------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


$(document).ready(function () {
    
    // Get settings from DB
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: settingsURL,
        success : function(data){
            socket = io.connect('http://192.168.1.124:8081');
            var settings = JSON.parse(data)[0];
            // General
            birthdays = settings.general.birthdays;
            selectedLang = settings.general.selectedLang;
            languages = settings.general.availableLanguages;

            // News
            news = settings.news.sourcePriorities;

            // Quotes
            availableQuoteCategorys = settings.quotes.availableCategories;
            selectedQuoteCategorys = settings.quotes.selectedCategories;
            quoteInterval = settings.quotes.interval;

            // Layout
            selectedClockWidget = settings.layout.selectedClockWidget;
            clockWidgets = settings.layout.clockWidgets;
            displayForecast = settings.layout.displayForecast;
            
            buildGeneralSettings();
            buildNewsSection();
            buildQuoteSection();
            buildLayoutSection();

            // Call when running the first time or to reset default settings
            initSettings();
            
            page = {
                get inSync() {
                    return page._inSync;
                },
                set inSync(val) {
                    if(val) {
                        $('#inSync')[0].style.display = 'block';
                        $('#notInSync')[0].style.display = 'none';
                    } else {
                        $('#inSync')[0].style.display = 'none';
                        $('#notInSync')[0].style.display = 'block';
                    }
                    return page._inSync = val;
                }
            };

            page.inSync = true;
        }
    });

    // Init collaplable sections
    $('#generalpreferences').on('show.bs.collapse', function () {
        $('#collapseicon1').removeClass('glyphicon-collapse-down');
        $('#collapseicon1').addClass('glyphicon-collapse-up');
    });

    $('#generalpreferences').on('hidden.bs.collapse', function () {
        $('#collapseicon1').removeClass('glyphicon-collapse-up');
        $('#collapseicon1').addClass('glyphicon-collapse-down');
    });
    
    $('#newspreferences').on('show.bs.collapse', function () {
        $('#collapseicon2').removeClass('glyphicon-collapse-down');
        $('#collapseicon2').addClass('glyphicon-collapse-up');
    });

    $('#newspreferences').on('hidden.bs.collapse', function () {
        $('#collapseicon2').removeClass('glyphicon-collapse-up');
        $('#collapseicon2').addClass('glyphicon-collapse-down');
    });
    
    $('#quotespreferences').on('show.bs.collapse', function () {
        $('#collapseicon3').removeClass('glyphicon-collapse-down');
        $('#collapseicon3').addClass('glyphicon-collapse-up');
    });

    $('#quotespreferences').on('hidden.bs.collapse', function () {
        $('#collapseicon3').removeClass('glyphicon-collapse-up');
        $('#collapseicon3').addClass('glyphicon-collapse-down');
    });
    
    $('#layoutpreferences').on('show.bs.collapse', function () {
        $('#collapseicon4').removeClass('glyphicon-collapse-down');
        $('#collapseicon4').addClass('glyphicon-collapse-up');
    });

    $('#layoutpreferences').on('hidden.bs.collapse', function () {
        $('#collapseicon4').removeClass('glyphicon-collapse-up');
        $('#collapseicon4').addClass('glyphicon-collapse-down');
    });

    $('.btn-toggle').click(function() {
        $(this).find('.btn').toggleClass('active');
        $(this).find('.btn').toggleClass('btn-primary');
        $(this).find('.btn').toggleClass('btn-default');
        if(displayForecast) {
            displayForecast = false;
        } else {
            displayForecast = true;
        }
        page.inSync = false;
    });
    
});


//-------------------------------------------------------------------------------------------------------------------------
//-------------GUI BUILDER-------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


buildGeneralSettings = function () {
    buildLangDropdown();
    if(birthdays.length > 0) {
        $.each(birthdays, function (index, bday) {
            addBirthday(bday);
        });
    } else {
        addBirthday();
    }
},
    
buildNewsSection = function () {
    news.sort(compare);
    
    var container = $('#sort tbody')[0];
    var html = '';
    $.each(news, function (i, source) {
         html += '<tr><td class="index">'+(i+1)+'</td><td>'+ source.source +'</td></tr>';
    });
    container.innerHTML = html;
    
    $('#sort tbody').sortable({
        helper: fixHelperModified,
        stop: updateIndex
    }).disableSelection();
},
    
buildQuoteSection = function () {
    // interval
    $('#quoteInterval')[0].setAttribute('value', quoteInterval);
    
    // table
    var availableTable = $('#availableCategorys')[0];
    var selectedTable = $('#selectedCategorys')[0];
    var availableHtml = '';
    var selectedHtml = '';
    
    $.each(availableQuoteCategorys, function (index, category) {
        availableHtml += '<tr id="avarow'+index+'" onclick="selectRow(avarow'+index+')"><td>'+ category +'</td></tr>';
    });
    
    $.each(selectedQuoteCategorys, function (index, category) {
        selectedHtml += '<tr id="selrow'+index+'" onclick="selectRow(selrow'+index+')"><td>'+ category +'</td></tr>';
    });
    
    availableTable.innerHTML = availableHtml;
    selectedTable.innerHTML = selectedHtml;
},
    
buildLayoutSection = function () {
    var container = $('#clockWidget')[0];
    $.each(clockWidgets, function (index, widget) {
        var opt = document.createElement('option');
        opt.innerHTML = widget;
        opt.setAttribute('value', widget);
        if(selectedClockWidget) {
            var selected = selectedClockWidget === widget;
            opt.selected = selected;
            if(selected) {
                showClock(parseInt(widget.substr(widget.length-1)));
            }
        }
        container.appendChild(opt);
    });
    
    if(displayForecast) {
        $('#forecastToggle')[0].innerHTML = '<button class="btn btn-sm btn-primary active">ON</button><button class="btn btn-sm btn-default">OFF</button>';
    } else {
        $('#forecastToggle')[0].innerHTML = '<button class="btn btn-sm btn-default">ON</button><button class="btn btn-sm btn-primary active">OFF</button>';
    }
                                                
},


//-------------------------------------------------------------------------------------------------------------------------
//-------------HELPER FUNCTIONS--------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


//-------------SECTION: GENERAL--------------------------------------------------------------------------------------------
    
buildLangDropdown = function () {
    var defaul = null;
    if(!selectedLang) { // No prestored settings, take it from the browser
        var lang = navigator.language || navigator.userLanguage; 
        var browser = lang.substr(0,2);
        $.each(languages, function (index, language) {
            if (language.code === browser) {
                defaul = language.value;
            }
        });
        if (defaul === null) {
            defaul = languages[0].value;
        }
    } else {
        defaul = selectedLang.value;
    }
    var container = $('#language')[0];
    $.each(languages, function (index, language) {
        var selected = defaul === language.value;
        var opt = document.createElement('option');
        opt.innerHTML = language.value;
        opt.setAttribute('value', language.code);
        opt.selected = selected;
        container.appendChild(opt);
    });
},
    
updateLanguage = function () {
    var selected = $('#language')[0].value;
    selectedLang = $.grep(languages, function(l){ return l.code == selected; })[0];
    page.inSync = false;
},
    
initDatepicker = function (id) {
    $('#'+id).datepicker({
        calendarWeeks: true,
        autoclose: true
    }).on('changeDate', function (ev) {
        var date = ev.date;
        if(date.getMonth()) {
            page.inSync = false;
            var index = ev.currentTarget.id.substr(ev.currentTarget.id.length-1);
            var name = $('#bName'+index)[0].value;
            var exists = $.grep(birthdays, function(b){ 
                if(b.name == name) {
                    b.date = date;
                    return b.name == name; 
                }
                return b.name == name; 
            });
            if(exists.length == 0) {
                birthdays[birthdays.length] = {name : name, date : date};
            }
        }
    });
},

addBirthday = function (bday) {
    var table = $('#birthday')[0];
    var index = table.children[1].children.length-1;
    var row = table.children[1].insertRow(index);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    if(bday) {
        cell1.innerHTML = '<input id="bName'+index+'" type="text" value ="'+ bday.name +'" />';
    } else {
        cell1.innerHTML = '<input id="bName'+index+'" type="text" />';
    }
    cell2.innerHTML = '<input id="datepicker'+index+'" class="datepicker" data-date-format="mm/dd/yyyy">';
    
    cell3.innerHTML = '<button type="button" class="btn glyphicon glyphicon-minus" style="float : right; background-color : darksalmon;" onclick="deleteBirthday('+ index +');"></button>';
    
    initDatepicker('datepicker'+index);
    if(bday) {
        var d = new Date(bday.date);
        $('#datepicker'+index).datepicker('setDate', new Date(d));
        $('#datepicker'+index).datepicker('update');
    }
},
    
deleteBirthday = function (index) {
    var name = $('#birthday tbody')[0].children[index].firstChild.firstChild.value;
    $.each(birthdays, function (i, bday) {
       if(bday.name === name) {
           birthdays.splice(i, 1);
           page.inSync = false;
           return false;
       }
    });
    $('#birthday tbody')[0].innerHTML = '<tr><td></td><td></td><td><button type="button" class="btn glyphicon glyphicon-plus" style="float : right;" onclick="addBirthday();"></button></td></tr>';
    if(birthdays.length > 0) {
        $.each(birthdays, function (index, bday) {
            addBirthday(bday);
        });
    } else {
        addBirthday();
    }
},

//-------------SECTION: NEWS--------------------------------------------------------------------------------------------
    
compare = function (a,b) {
    if (a.priority < b.priority)
        return -1;
    if (a.priority > b.priority)
        return 1;
    return 0;
},

fixHelperModified = function(e, tr) {
    var $originals = tr.children();
    var $helper = tr.clone();
    $helper.children().each(function(index) {
        $(this).width($originals.eq(index).width())
    });
    return $helper;
},

updateIndex = function(e, ui) {
    $('td.index', ui.item.parent()).each(function (i) {
        $(this).html(i + 1);
    });
    
    $.each($('#sort tbody')[0].children, function (i, tr) {
        var index = tr.textContent.substr(0,1);
        var name = tr.textContent.substr(1);
        var newsItem = $.grep(news, function(n){ return n.source == name; })[0];
        if(newsItem) {
            newsItem.priority = parseInt(index)-1;
            page.inSync = false;
        }
    });
},  

//-------------SECTION: QUOTES--------------------------------------------------------------------------------------------

updateQuoteInterval = function () {
    quoteInterval = parseInt($('#quoteInterval')[0].value);
    page.inSync = false;
},   
    
selectRow = function (row) {
    currentSelectedCategory = row;
    
    var elements = document.querySelectorAll("#availableCategorys .selectedCategory");
    $.each(elements, function (element) {
       this.classList.remove('selectedCategory'); 
    });
    
    elements = document.querySelectorAll("#selectedCategorys .selectedCategory");
    $.each(elements, function (element) {
       this.classList.remove('selectedCategory'); 
    });
    
    row.firstChild.classList.add('selectedCategory');
},

addCategory = function () {
     if(currentSelectedCategory.parentElement.parentElement.id === 'availableCategorys') {
        var item = currentSelectedCategory.innerText;
        $.each(availableQuoteCategorys, function (index, category) {
           if(category === item) {
               selectedQuoteCategorys[selectedQuoteCategorys.length] = item;
               availableQuoteCategorys.splice(index, 1);
           } 
        });
        page.inSync = false;
        buildQuoteSection();
    }
},

removeCategory = function () {
   if(currentSelectedCategory.parentElement.parentElement.id === 'selectedCategorys') {
        var item = currentSelectedCategory.innerText;
        $.each(selectedQuoteCategorys, function (index, category) {
           if(category === item) {
               availableQuoteCategorys[availableQuoteCategorys.length] = item;
               selectedQuoteCategorys.splice(index, 1);
           } 
        });
        page.inSync = false;
        buildQuoteSection();
    }
},

//-------------SECTION: LAYOUT--------------------------------------------------------------------------------------------

startTime = function (container) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    
    day = checkTime(day)
    month = checkTime(month);
    m = checkTime(m);
    s = checkTime(s);
    
    $('#'+container)[0].innerHTML = h + ':' + m + ':' + s + '<br><span class="date">' + day+'.'+month+'.'+year+'</span>';
    
    setTimeout(function() {
        startTime(container);
    }, 500);
},
    
checkTime = function (i) {
    if (i < 10) {
        i = '0' + i
    };
    return i;
},

showClock = function (id) {
    for (var i = 1; i <= clockWidgets.length; i++) {
        if (i === id) {
            $('#preview'+i)[0].style.display = 'block';
            startTime('preview'+i);
        } else {
            $('#preview'+i)[0].style.display = 'none';
        }
    }
},

updateClockWidget = function () {
    var name = $('#clockWidget')[0].value;
    showClock(parseInt(name.substr(name.length-1)));
    selectedClockWidget = $.grep(clockWidgets, function(w){ return w == name; })[0];
    page.inSync = false;
},


//-------------------------------------------------------------------------------------------------------------------------
//-------------DAO---------------------------------------------------------------------------------------------------------
//-------------------------------------------------------------------------------------------------------------------------


// This method will delete the current settings and overwrite it with the object below
initSettings = function () {
    var data = {"general" : {"selectedLang" : {"code" : 'en', "value" : 'Englisch'}, "availableLanguages" : [{"code" : 'en', "value" : 'Englisch'}, {"code" : 'de', "value" : 'Deutsch'}], 
                           "birthdays" : [{"name" : 'Linda', "date" : 'Mon Feb 06 2017 00:00:00 GMT+0100 (CET)'}]},
                "news" : {"sourcePriorities" : [{"source" : '20min', "priority" : 0}, {"source" : 'Blick', "priority" : 1}, {"source" : 'Tagesanzeiger', "priority" : 2}, {"source" : 'NZZ', "priority" : 3}]},
                "quotes" : {"interval" : 30, "availableCategories" : ['funny', 'life', 'love', 'management', 'sports', 'art', 'students'], "selectedCategories" : ['inspire']},
                "layout" : {"selectedClockWidget" : 'clock1', "clockWidgets" : ['clock1', 'clock2', 'clock3'], "displayForecast" : displayForecast}};
    
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: 'http://192.168.1.124:8081/initSettings'
    });
},
    
getSettings = function () {
    $.ajax({
        type: 'GET',
        contentType: 'application/json',
        url: settingsURL,
        success : function(data){
            var settings = JSON.parse(data)[0];
            mapSettings(settings);
        }
    });
},
    
updateSettings = function () {
    var data = JSON.parse(getCurrentSettingsString());
    
    $.ajax({
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        url: settingsURL,
        success : function () {
            page.inSync = true;
            socket.emit('SETTINGS_UPDATE', 'settings updated');
        }
    });
},
    
getCurrentSettingsString = function () {
    var jsonString = '{"general" : {"selectedLang" : {"code" : "'+selectedLang.code+'", "value" : "'+selectedLang.value+'"}, "availableLanguages" : ['; 
    $.each(languages, function (i, lang) {
       jsonString += '{"code" : "'+ lang.code +'", "value" : "'+ lang.value +'"},'; 
    });
    jsonString = jsonString.substr(0, jsonString.length-1);
    jsonString += '], "birthdays" : [';
    $.each(birthdays, function (i, birthday) {
        if(birthday.name && birthday.date) {
            jsonString += '{"name" : "'+ birthday.name +'", "date" : "'+ birthday.date +'"},'; 
        }
    });
    jsonString = jsonString.substr(0, jsonString.length-1);
    jsonString += ']}, "news" : {"sourcePriorities" : [';
    $.each(news, function (i, source) {
       jsonString += '{"source" : "'+ source.source +'", "priority" : "'+ source.priority +'"},'; 
    });
    jsonString = jsonString.substr(0, jsonString.length-1);
    jsonString += ']}, "quotes" : {"interval" : ' + quoteInterval + ', "availableCategories" : [';
    $.each(availableQuoteCategorys, function (i, cat) {
       jsonString += '"'+cat+'",'; 
    });
    jsonString = jsonString.substr(0, jsonString.length-1);
    jsonString += '], "selectedCategories" : [';
    $.each(selectedQuoteCategorys, function (i, cat) {
       jsonString += '"'+cat+'",'; 
    });
    jsonString = jsonString.substr(0, jsonString.length-1);
    jsonString += ']}, "layout" : { "selectedClockWidget" : "' + selectedClockWidget + '", "clockWidgets" : ["clock1", "clock2", "clock3"], "displayForecast" : '+ displayForecast +'}}';
    
    return jsonString;
},
    
mapSettings = function (settings) {
    
    // General
    birthdays = settings.general.birthdays;
    selectedLang = settings.general.selectedLang;
    languages = settings.general.availableLanguages;
    
    // News
    news = settings.news.sourcePriorities;
    
    // Quotes
    availableQuoteCategorys = settings.quotes.availableCategories;
    selectedQuoteCategorys = settings.quotes.selectedCategories;
    quoteInterval = settings.quotes.interval;
    
    // Layout
    selectedClockWidget = settings.layout.selectedClockWidget;
    clockWidgets = settings.layout.clockWidgets;
    displayForecast = settings.layout.displayForecast;
}