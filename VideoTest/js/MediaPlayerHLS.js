var log_text_container = null;

function createPlayer(){
	//TODO fill if neccesary
}

function playVideo(){
	document.body.style.visibility = "hidden";
	jwplayer('player_7010').setup({
    file: "http://b16317.cdn.telefonica.com:1935/live/ep/16317/cdn_live_1344441665393/playlist.m3u8",
    width: "480",
    height: "270",
    image: "http://content.bitsontherun.com/thumbs/3XnJSIm4-640.jpg",
    autostart: "true",
  });
}

function hideBackground(){
	document.body.style.background = '';
}




function showAlert(playResult){
	var msg = "play result: " + playResult;
	//pace.TV.stop();
	document.body.style.display = "";
	log(msg);
}

function resume(){
	log("resume");
	//pace.TV.resume(0);
	checkVideoStatus()
}

function pause(){
	log("pause");
	//pace.TV.pause(0);
	checkVideoStatus();
}

function stop(){
	log("stop");
	//pace.TV.stop(0);
	checkVideoStatus();
	document.body.style.display = "";
}

function seekTo(position) {
	//pace.TV.setPlaybackPosition(0,15);
}



function log(message){
	var pre = "##  ";
	if (log_text_container === null){
		log_text_container = document.getElementById("log_text");
	}
	log_text_container.innerHTML += pre + message + "<br>";
	if (log_text_container.scrollHeight > 450){
		var _h = log_text_container.scrollHeight + 100;
		log_text_container.style.height += _h + "px";
	}
	//log (Telefonica)
	jQuery.ajax({
		type: "POST",
		url: 'http://10.95.74.174:8082/Log/indexLocal.php',
		data: "title= PACE:EVENT: " + message
	});
}

function resetLog(){
	if (log_text_container != null){
		log_text_container.innerHTML = "";
		log_text_container.styel.height = "";
	}
	
}
