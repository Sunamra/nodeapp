const text1 = document.getElementById('switchText1');
const text2 = document.getElementById('switchText2');
const textareaFetch = document.getElementById('textareaFetch');
const textareaSend = document.getElementById('textareaSend');
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
	document.getElementById('codeareaFetch').focus();
	copyButton.textContent = 'Copy';
	submitButton.textContent = 'Fetch';

	textareaFetch.readOnly = true;
	textareaFetch.style.outline = 'none';
	textareaFetch.placeholder = 'Fetched text appears here.';

	textareaFetch.style.display = '';
	textareaSend.style.display = 'none';
};

const sendUI = () => {
	window.SEND = true;
	window.RECEIVE = false;

	text2.classList.add('activeSwitchText');
	text1.classList.remove('activeSwitchText');

	codeDiv.style.display = 'none';
	textAreaLabel.style.display = '';
	copyButton.textContent = 'Paste';
	submitButton.textContent = 'Submit';

	textareaFetch.readOnly = false;
	textareaFetch.style.outline = 'auto';
	textareaFetch.placeholder = '';
	textareaFetch.style.display = 'none';

	textareaSend.style.display = '';
	textareaSend.focus();
};

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