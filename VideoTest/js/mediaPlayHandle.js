
// Variable declaration
var tv_player_selection, old_tv_player_selection, tv_player_selection_url = null;
var tv_player_selection_level = 0;
var option_selected = 0;
var startKeyDown = 0;
var videoUrl = './videos.json';
var widevineUrl = './widevine.json';
var container, optionsContainer, urlsContainer, videoUrlText, widevineUrlText = null;
var videosArray = [];
var widevineArray = [];
var isBlocked = true;

// Global
videoUrl_selected = null;
widevineUrl_selected = null;

/*
 * Initialization
 */
function init() {
	container = document.getElementById("tv_player_selection_content");
	optionsContainer = document.getElementById("tv_player_selection_content_option");
	urlsContainer = document.getElementById("tv_player_selection_content_url");
	videoUrlText = document.getElementById("video_url_text");
	widevineUrlText = document.getElementById("widevine_url_text");
	isBlocked = true;
	//Only for pace
	if (typeof pace !== "undefined") {
		log(pace.CA.getStatusInformation());
	}
}

/*
 * Process keyboard: onKeyDown
 */
function processKeyDown(e) {
	startKeyDown = (new Date()).getTime();
	var keyCode;
	if(window.event) { // IE
		keyCode = e.keyCode;
	} else if(e.which) { // Netscape/Firefox/Opera
		keyCode = e.which;
	} else {
		alert("Unknown event type.");
		return ;
	}
	// Lets process it
	processKeyHandle(keyCode);
}

/*
 * Process keyboard: onKeyUp
 */
function processKeyUp(e) {
	var timeDiff = (new Date()).getTime() - startKeyDown;
	var keyCode;
	if(window.event) { // IE
		keyCode = e.keyCode;
	} else if(e.which) { // Netscape/Firefox/Opera
		keyCode = e.which;
	} else {
		alert("Unknown event type.");
		return ;
	}
	// Lets process it if needed
}

/*
 * Process list selection (using mouse or keyboard)
 */
function focushover(element) {
	var _classname = element.className;
	if (typeof _classname !== "undefined") {
		element.className += " list_selection_selected";
	} else {
		// TODO: check this
		element.className = " list_selection_selected";
	}
	tv_player_selection = element.id[element.id.length - 1];
}

/*
 * Process list deselection (using mouse or keyboard)
 */
function unfocus(element) {
	var _classname = element.className;
	if (typeof _classname !== "undefined") {
		var _classList = _classname.split(" ");
		_classname = "";
		for (var i = 0; i < _classList.length; i++) {
			// Remove the selected css style
			if ( _classList[i] !== "list_selection_selected") {
				_classname += _classList[i] + " ";
			}
		}
		element.className = _classname;
	} else {
		element.className = "";
	}
}

/*
 * Load the available options from url file
 */
function loadUrl(url){
	var childs = [];
	var values = [];
	var numOfUrls = 4;
	var i = 1;
	// Simple animation
	$(container).animate({
			marginLeft: '-420px'
		}, 500, function() {}
	);
	// Retrieve options
	$.getJSON(url,
		function(data){
			$.each(data,function(key,val){
				if (i <= numOfUrls) {
					childs[i-1] = i + ". " + key;
					values[i-1] = val;
				} else {
					return;
				}
				i++;
			});
			updateList(childs);
		});
	return values;
}

/*
 * Set element display to none
 */
function hide(element) {
	element.style.display = 'none';
}

/*
 * Update List
 */
function updateList(childs){
	for (var i in childs) {
		urlsContainer.children[i].innerHTML = childs[i];
	}
}

/*
 * option selection
 */
function select(element) {
	// Main menu level
	if (tv_player_selection_level === 0){
		switch (tv_player_selection) {
			case "1":
				// Extra check
				if (videoUrl_selected !== null) {
					option_selected = 1;
					playVideo();
				} /*else {
					//TODO: lanzar popUp
				}*/
				break;
			case "2":
				option_selected = 2;
				videosArray = loadUrl(videoUrl);
				tv_player_selection_level = 1;
				old_tv_player_selection = tv_player_selection;
				focushover(urlsContainer.children[0]);
				break;
			case "3":
				option_selected = 3;
				widevineArray = loadUrl(widevineUrl);
				tv_player_selection_level = 1;
				old_tv_player_selection = tv_player_selection;
				focushover(urlsContainer.children[0]);
				break;
			case "4":
				getAndShowToken();
				break;
			default:
				option_selected = 2;
				// Play videos by default
				loadUrl(videoUrl);
		}
	// Second level	
	} else {
		var id = parseInt(tv_player_selection, 10);
		setUrl(urlsContainer.children[id-1]);
		unfocus(urlsContainer.children[id-1]);
		tv_player_selection_level = 0;
		tv_player_selection = old_tv_player_selection;
	}
}

/*
 * Set the Url
 */
function setUrl(element) {
	var id = element.id[element.id.length - 1];
	if (option_selected === 2) {
		videoUrlText.innerHTML = videosArray[id-1];
		videoUrl_selected = videosArray[id-1];
		log("SETTINGS ## video url = " + videoUrl_selected);
	} else if (option_selected === 3) {
		widevineUrlText.innerHTML = widevineArray[id-1];
		widevineUrl_selected = widevineArray[id-1];
		log("SETTINGS ## widevine url = " + widevineUrl_selected);
	}
	$(container).animate({
		marginLeft: '0px'
		}, 500, function() {
			// Animation complete.
	});
}

/*
 * Implement the logic for key pressing
 */
function processKeyHandle(keyCode) {
	// MODAL
	if (keyCode === VK_0) {
		window.location.reload();
	} else if (keyCode === VK_1) {
		window.history.back();
	}
	var nc = 0;
	if ((isBlocked) && (keyCode === VK_ENTER)) {
		isBlocked = false;
		hide(document.getElementById("tv_player_selection_content_overlap"));
		focushover(document.getElementById("tv_player_selection_1"));
	} else {
		var id = 1;
		var _container = null;
		switch(keyCode) {
			case VK_PLAY:
				resume();
				break;
			case VK_PAUSE:
				pause();
				break;
			case VK_STOP:
				stop();
				break;
			case VK_UP :
				id = parseInt(tv_player_selection, 10);
				_container = (tv_player_selection_level === 0)?optionsContainer:urlsContainer;
				if (id > 1) {
					unfocus(_container.children[id-1]);
					id--;
					focushover(_container.children[id-1]);
				} else if  (id === 1){
					unfocus(_container.children[id-1]);
					focushover(_container.children[3]);
				}
				break;
			case VK_LEFT :
				_container = (tv_player_selection_level === 0)?optionsContainer:urlsContainer;
				if (tv_player_selection_level === 1) {
					unfocus(_container.children[tv_player_selection-1]);
					tv_player_selection_level = 0;
					tv_player_selection = old_tv_player_selection;
					$(container).animate({
						marginLeft: '0px'
						}, 500, function() {
						// Animation complete.
					});
				}
				break;
			case VK_DOWN :
				id = parseInt(tv_player_selection,10);
				_container = (tv_player_selection_level === 0)?optionsContainer:urlsContainer;
				if (id < 4) {
					unfocus(_container.children[id-1]);
					id++;
					focushover(_container.children[id-1]);
				} else if (id === 4) {
					unfocus(_container.children[id-1]);
					focushover(_container.children[0]);
				}
				break;
			case VK_RIGHT :
				id = parseInt(tv_player_selection,10);
				_container = (tv_player_selection_level === 0)?optionsContainer:urlsContainer;
				if (tv_player_selection_level === 0) {
					select(_container.children[id]);
				}
				break;
			case VK_ENTER :
				id = parseInt(tv_player_selection,10);
				_container = (tv_player_selection_level === 0)?optionsContainer:urlsContainer;
				select(_container.children[id]);
				break;
			case VK_REWIND :
				rwd();
				break;
			case VK_FAST_FWD :
				fwd();
				break;
			default :
				// log("KeyCode: " + keyCode);
				break;
		}
	}
}


function isVideoSelection(key){
		var popupDiv = document.getElementById("popupDiv");
		if (popupDiv) {
			if (key == VK_ENTER) {
				selectVideo(null);
			} else {
				var movie = document.getElementById(key);
				if (movie) {
					selectVideo(movie.getAttribute("name"));
				}
			}
			return true;
		} else {
			return false;
		}
}

function selectVideo(val){
	if (val !== null) {
		createPlayer(val);
	}
	var popUp = document.getElementById("popupDiv");
	$('body')[0].removeChild(popUp);
}

function selectVideoFrom(url) {
	stopPlayer();
	$.getJSON(url,
		function(data){
			var popupDiv = document.createElement("div");
			popupDiv.setAttribute("class","VideosPopup");
			popupDiv.setAttribute("id","popupDiv");
			
			var body = $('body')[0];
			body.appendChild(popupDiv);

			var button = document.createElement("button");
			button.setAttribute("class","VideosCerrar");
			button.innerHTML ="Cerrar";
			button.onclick = function(){
				body.removeChild(popupDiv);
				popupDiv = null;
			};
			popupDiv.appendChild(button);

			var result = "result: ";
			var i = 1;
			$.each(data,function(key,val){
				var div = document.createElement("div");
				div.innerHTML = i + ". " + key;
				div.setAttribute("id",i + 48);
				div.setAttribute("name",val);
				div.setAttribute("class","VideosListElement");
				div.onclick = function(){
					selectVideo(val);
				};
				popupDiv.appendChild(div);
				result = result + "key:" + key +",value:" + val + " ||�";
				i++;
			});
		});
}
