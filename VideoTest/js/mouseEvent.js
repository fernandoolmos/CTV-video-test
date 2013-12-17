var firstLoad = true;

function wheel(event) {
	var delta = 0;
        if (!event) { /* For IE. */
			if (firstLoad) log("OnMouseWheel :: IE");
			event = window.event;
		}
        if (event.wheelDelta) { /* IE/Opera. */
				if (firstLoad) log("OnMouseWheel :: IE/Opera");
                delta = event.wheelDelta/120;
        } else if (event.detail) { /** Mozilla case. */
                /** In Mozilla, sign of delta is different than in IE.
                 * Also, delta is multiple of 3.
                 */
				if (firstLoad) log("OnMouseWheel :: Mozilla");
                delta = -event.detail/3;
        }
        /** If delta is nonzero, handle it.
         * Basically, delta is now positive if wheel was scrolled up,
         * and negative, if wheel was scrolled down.
         */
        if (delta) {
			var wheelContainer = document.getElementById("wheelPopup");
			wheelContainer.innerHTML = "delta= " + delta;
		}
        /** Prevent default actions caused by mouse wheel.
         * That might be ugly, but we handle scrolls somehow
         * anyway, so don't bother here..
         */
//        if (event.preventDefault)
//                event.preventDefault();
//	event.returnValue = false;

	firstLoad = false;
}

function showWheel() {
	var wheelContainer = document.getElementById("wheelPopup");
	wheelContainer.style.visibility = "visible";
}

function hideWheel() {
	var wheelContainer = document.getElementById("wheelPopup");
	wheelContainer.style.visibility = "hidden";
}

window.onmousewheel = document.onmousewheel = wheel;