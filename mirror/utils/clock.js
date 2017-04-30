startTime = function (container) {
    var today = new Date();
    var day = today.getDate();
    var month = today.getMonth();
    var year = today.getFullYear();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();

    day = checkTime(day);
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
        i = '0' + i;
    }
    return i;
}