var commands={"heran zoomen":function(){zoomIn()},"näher":function(){zoomIn()},"heraus zoomen":function(){zoomOut()},"zoom in":function(){zoomIn()},"zoom out":function(){zoomOut()},"zeige *address":function(e){toggleSearchMode("single"),document.getElementById("locationInput").value=e,setLocation()},"wo ist *address":function(e){toggleSearchMode("single"),console.log(e),document.getElementById("locationInput").value=e,setLocation()},"show *address":function(){toggleSearchMode("single"),document.getElementById("locationInput").value=address,setLocation()},"erstelle eine route *mode von *address1 nach *address2":function(e,n,o){toggleSearchMode("directions"),console.log(n+"nach "+o+" "+e),document.getElementById("startInput").value=n,document.getElementById("endInput").value=o,(e="zu fuss")?findDirectionsWith("WALKING"):(e="mit dem zug")?findDirectionsWith("TRANSIT"):(e="mit dem fahrrad")?findDirectionsWith("BICYCLING"):(e="mit dem auto")?findDirectionsWith("DRIVING"):console.log(e)},"ich möchte von *address1 nach *address2 fahren":function(e,n){toggleSearchMode("directions"),console.log(e+n),document.getElementById("startInput").value=e,document.getElementById("endInput").value=n,findDirections()},news:function(){window.location="../news"},home:function(){window.location="../"}};