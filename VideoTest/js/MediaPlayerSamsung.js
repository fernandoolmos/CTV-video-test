var log_text_container = null;
var videoFrame = null;

/*
 * Player initiliazation
 */
function createPlayer() {
	var _media = document.createElement("object");

	_media.setAttribute("data",videoUrl_selected);
	_media.setAttribute("type", "application/x-netcast-av");
	_media.setAttribute("autoStart", true);
	_media.setAttribute("downloadable", "false");
	_media.setAttribute("id", "media");
	_media.width = 425;
	_media.height = 240;
	
	// Check the video url extension
	_media.onReadyStateChange = onReadyStateChange;
	_media.onPlayStateChange = onPlayStateChange;
	if (videoUrl_selected.substring(videoUrl_selected.length - 3) === "wvm" ||
	videoUrl_selected.substring(videoUrl_selected.length - 3) === "mp4") {
		_media.setAttribute("drm_type","widevine");
		_media.Buffering = onBuffering;
	} else {
		_media.Buffering = onBufferingHLS;
	}
	_media.Error = onError;
	
	videoFrame = document.getElementById("tv_player_container");
	videoFrame.appendChild(_media);
}

function playVideo() {
	var videoNoise = document.getElementById("tv_player_noise");
	videoNoise.style.display = "none";
	createPlayer();
	setTimeout(seekTo,10000);
}

function seekTo() {
	_interval = setInterval(function(){
		log(PlayStateChange[document.getElementById("media").playState]);
	},20);
	setTimeout(clearInterval(_interval),2000);
	log("ojo que hago log");
	var media = document.getElementById("media");
	log("estado antes del seek: " + PlayStateChange[media.playState]);
	if (media !== null) {
		media.seek(50000);
		log("estado despues del seek: " + PlayStateChange[media.playState]);
	}
}

function play() {
	var media = document.getElementById("media");
	if (media !== null){
		media.play(1);
	}
}

function pause() {
	var media = document.getElementById("media");
	if (media !== null){
		media.play(0);
	}
}

function stop() {
	var media = document.getElementById("media");
	if (media !== null){
		media.stop();
	}
	if (videoFrame !== null && media !== null){
		videoFrame.removeChild(media);
		media = null;
		
		var videoNoise = document.getElementById("tv_player_noise");
		videoNoise.style.display = "block";
		
		resetLog();
	}
	
}

function onReadyStateChange(lReadyStateChange) {
	log("PLAYER:onReadyStateChange ## " + lReadyStateChange + ". " + ReadyStateChange[lReadyStateChange]);
}

function onPlayStateChange() {
	var newState = document.getElementById("media").playState;
	log("PLAYER:OnPlayStateChange ## " + newState + ". " + PlayStateChange[newState]);
	if (newState === "0"){
		resetLog();
	}
}

function onBuffering(bIsBufferingStarted) {
	var media = document.getElementById("media");
	log("PLAYER:OnBuffering ## with bIsBufferingStarted: " + bIsBufferingStarted);
	if (bIsBufferingStarted && widevineUrl_selected !== null && widevineUrl_selected !== " ") {
		log("PLAYER:OnBuffering ## start buffering");
	media.setWidevineDrmURL(widevineUrl_selected);
	log("PLAYER:Widevine ## Setting: " + widevineUrl_selected);
//	media.setWidevineUserData("TOKEN")
//	log("PLAYER:Widevine ## Sending token con contenido TOKEN");
	log("PLAYER:Widevine ## Token content = "+ token);
	if (token !== null){
		log("PLAYER:Widevine ## Sending token with content: " + token);
		media.setWidevineUserData(token);
	}
	media.setWidevinePortalID("telefonica");
	media.setWidevineStoreFront("telefonica");
	log("PLAYER:OnBuffering ## setting widevine : " + widevineUrl_selected);

	
	} else {
		log("PLAYER:OnBuffering ## finish buffering");
	}
}

function onBufferingHLS(bIsBufferingStarted) {
	var media = document.getElementById("media");
	log("PLAYER:OnBuffering ## with bIsBufferingStarted: " + bIsBufferingStarted);
}

function onError() {
	log("PLAYER:OnError ## ************ ERROR ************");
	log("PLAYER:OnError ## Error occured. (ERRCODE:"+media.error+")");
}

function log(message) {
	var pre = "##  ";
	if (log_text_container === null){
		log_text_container = document.getElementById("log_text");
	}
	log_text_container.innerHTML = pre + message + "<br>" + log_text_container.innerHTML;

	jQuery.ajax({
		type: "POST",
		url: 'http://10.95.232.41:8082/Log/indexLocal.php',
		data: "title= LG:EVENT: " + message
	});
}

function resetLog() {
	if (log_text_container !== null){
		log_text_container.innerHTML = "";
		log_text_container.styel.height = "";
	}
	
}
