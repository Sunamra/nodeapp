// Global variables to be used by other scripts

// Device type
window.MOBILE = false;
window.DESKTOP = false;
// Open tab
window.RECEIVE = false;
window.SEND = false;

// Identify device
if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
	// console.log("Mobile device detected");
	window.MOBILE = true;
} else {
	// console.log("Desktop device detected");
	window.DESKTOP = true;
}
