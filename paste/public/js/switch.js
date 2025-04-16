// Global variables to be used by other scripts
// Device type
window.MOBILE = false;
window.DESKTOP = false;
// Open tab
window.RECEIVE = false
window.SEND = false

// Identify device
if (/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
	// console.log("Mobile device detected");
	window.MOBILE = true;
} else {
	// console.log("Desktop device detected");
	window.DESKTOP = true;
}

const text1 = document.getElementById('switchText1');
const text2 = document.getElementById('switchText2');
const textarea = document.getElementById('textarea');
const textarea2 = document.getElementById('textarea2');
const codeDiv = document.getElementById('codeDiv');
const textAreaLabel = document.getElementById('textAreaLabel');
const submitButton = document.getElementById('submitButton');
const copyButton = document.getElementById('copyButton');

const receiveUI = () => {
	window.RECEIVE = true;
	window.SEND = false;

	text1.classList.add('activeSwitchText');
	text2.classList.remove('activeSwitchText');

	codeDiv.style.display = '';
	textAreaLabel.style.display = 'none';
	document.getElementById("codearea").focus();
	copyButton.textContent = 'Copy';
	submitButton.textContent = 'Fetch';

	textarea.readOnly = true;
	textarea.style.outline = 'none';
	textarea.placeholder = "Fetched text appears here.";

	// 'textarea' visible for fetching
	textarea.style.display = '';
	textarea2.style.display = 'none';
}

const sendUI = () => {
	window.SEND = true;
	window.RECEIVE = false;

	text2.classList.add('activeSwitchText');
	text1.classList.remove('activeSwitchText');

	codeDiv.style.display = 'none';
	textAreaLabel.style.display = '';
	copyButton.textContent = 'Paste';
	submitButton.textContent = 'Submit';

	textarea.readOnly = false;
	textarea.style.outline = 'auto';
	textarea.placeholder = "";
	textarea.style.display = 'none';
	
	// 'textarea2' visible for posting
	textarea2.style.display = '';
	textarea2.focus();
}

// Change UI based on current tab
text1.addEventListener('click', () => {
	receiveUI();
});
text2.addEventListener('click', () => {
	sendUI();
});

// Default settings
if (window.MOBILE) {
	sendUI();
}
else if (window.DESKTOP) {
	receiveUI();
}