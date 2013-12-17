var log_text_container = null;
var callback_registered = false;

function checkVideoStatus() {
	try {
		var xmlVideoStatus = pace.TV.getVideoStatus(0);
		var parser = new DOMParser();
		var videoStatus = parser.parseFromString(xmlVideoStatus,"text/xml").
			getElementsByTagName('video')[0];
		var params = ['index','state','speed','timeshift','capabilities','url'];
		log('state' + ": " + videoStatus.getAttribute('state'));
		// for(var i in params) {
			// log(params[i] + ": " + videoStatus.getAttribute(params[i]));
		// }
		//List all params
		// for (var i = 0; i < videoStatus.attributes.length; i++){
			// var att = videoStatus.attributes[i];
			// log(att.name + ": " + att.value);
		// }
		return videoStatus.getAttribute('state');
	} catch(e){
		log(e);
	}
	
}

function tvCb(event, data, datastr) {
	var e = (typeof event == 'undefined')?0:event; 
	try {
		log("generado un evento: " + e);
		switch (e) {
			case pace.TV.EVENT_HDMI_CONNECTED:
				log("hdmi connected");
				break;
			case pace.TV.EVENT_HDMI_DISCONNECTED:
				log("hdmi disconnected");
				break;
			case pace.TV.EVENT_CHANNEL_CHANGED:
				log("event_channel_changed");
				break;
			case pace.TV.EVENT_VIDEO_STATE_CHANGED:
				log("event_channel_changed");
				checkVideoStatus();
				break;
			case pace.TV.EVENT_VIDEO_ERROR:
				log("error de video con código: " + data);
				switch (data) {
					case pace.TV.EVENT_SSTREAM_TUNER_ERROR:
						log("sstream tuner error");
						break;
					case pace.TV.EVENT_SSTREAM_MANIFEST_ERROR:
						log("manifest error");
						break;
					case pace.TV.EVENT_SSTREAM_SOCKET_ERROR:
						log("EVENT_SSTREAM_SOCKET_ERROR");
						break;
					case pace.TV.EVENT_SSTREAM_HTTP_ERROR:
						log("EVENT_SSTREAM_HTTP_ERROR");
						break;
					case pace.TV.EVENT_SSTREAM_CHUNK_ERROR:
						log("EVENT_SSTREAM_CHUNK_ERROR");
						break;
					case pace.TV.EVENT_SSTREAM_DRM_ERROR:
						log("EVENT_SSTREAM_DRM_ERROR");
						break;
					default:
						log("event_video_error_undefined");
				}
				break;
			case pace.TV.EVENT_HDCP_ERROR:
				switch (data) {
					case pace.TV.ERROR_RAISED:
						log("error_raised");
						break;
					case pace.TV.ERROR_CLEARED:
						log("error_cleared");
						break;
				}
				break;
			case pace.TV.EVENT_VIDEO_PLAYING:
				log("event_video_playing");
				break;
			case pace.TV.EVENT_VIDEO_STOPPED:
				log("event_video_stopped");
				break;
			case pace.TV.EVENT_DATA_VIDEO_AUTO_RESUME:
				log("event_data_video_auto_resume");
				break;
			case pace.TV.EVENT_DATA_VIDEO_EXIT_TIMESHIFT:
				log("event_data_video_exit_timeshift");
				break;
			default:
				log("undefined event: " + e);
		}
	} catch (e){
		log("error registering events");
	}
}

function createPlayer() {
	try {
		var res = pace.TV.registerCallback('tvCb');
		log("register callback tv: " + res);
		if (res === 0) {
			callback_registered = true;
		}
	} catch(e) {
		log('Error: ' + e);
	}
}


function playVideo(){
	if (!callback_registered) {
		createPlayer();
	}
	hideBackground();
	log("set visible output: " + pace.TV.setVisible(true));
	// var playResult = pace.TV.play(0,videoUrl_selected,"video/x-pace-sstream");
	checkVideoStatus();
	log("url: "+ videoUrl_selected);
	pace.TV.stop(0);
	log("play output: " + pace.TV.play(0,videoUrl_selected));
	
	log("setFullScreen output: " + pace.TV.setFullScreen(0));
	log("set visible output: " + pace.TV.setVisible(true));
	checkVideoStatus();
	setTimeout(pause,5000);
	//setTimeout(resume,20000);
	setTimeout(fwd,15000);
	setTimeout(seekTo,30000);
	//setTimeout(resume,15000);
	//setTimeout(fwd1,10000);
	//setTimeout(resume,22000);
	//setTimeout(rwd,11000);
	//setTimeout(stop,30000);
}

function hideBackground(){
	document.body.setAttribute("class","PlayBody");
}

function showAlert(playResult){
	var msg = "play result: " + playResult;
	pace.TV.stop();
	document.body.setAttribute("class","RegularBody");
	log(msg);
}

function resume(){
	log("resume");
	pace.TV.resume(0);
	checkVideoStatus()
}

function play(){
}

function pause(){
	log("pause");
	pace.TV.pause(0);
	checkVideoStatus();
}

function fwd(){
	pace.TV.setPlayMode(0,1,2.0);
	checkVideoStatus();
}

function fwd1(){
	log("fwd1");
	pace.TV.setPlayMode(0,1,1.0);
	checkVideoStatus();
}

function rwd(){
	log("rwd");
	pace.TV.setPlayMode(0,-1,1.0);
	checkVideoStatus();
}

function stop(){
	log("stop with result: " + pace.TV.stop(0));
	pace.TV.stop(0);
	checkVideoStatus();
	document.body.style.display = "";
}

function seekTo(position) {
	log('seek to');
	pace.TV.setPlaybackPosition(0,100);
	checkVideoStatus();
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
