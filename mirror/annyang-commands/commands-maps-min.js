var commands={"heran zoomen":function(){zoomIn()},"näher":function(){zoomIn()},"heraus zoomen":function(){zoomOut()},"zoom in":function(){zoomIn()},"zoom out":function(){zoomOut()},"zeige *address":function(o){toggleSearchMode("single"),document.getElementById("locationInput").value=o,setLocation()},"wo ist *address":function(o){toggleSearchMode("single"),console.log(o),document.getElementById("locationInput").value=o,setLocation()},"show *address":function(){toggleSearchMode("single"),document.getElementById("locationInput").value=address,setLocation()},"erstelle eine route von *address1 nach *address2":function(o,e){toggleSearchMode("directions"),console.log(o+e),document.getElementById("startInput").value=o,document.getElementById("endInput").value=e,findDirections()},news:function(){window.location="../news"},home:function(){window.location="../"}};