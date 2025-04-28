// Script for event listeners

// Only allow numbers in this textarea
document.getElementById("codeareaFetch").addEventListener("input", function () {
	this.value = this.value.replace(/[^0-9]/g, '');
});

// Submit when enter key pressed
document.getElementById("codeareaFetch").addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		event.preventDefault();
		executeFunction();
	}
});

// Submit when HTML buttons pressed
document.getElementById('myForm').addEventListener('submit', (e) => {
	e.preventDefault()
	executeFunction();
});

// Copies/Pastes content to/from clipboard
document.getElementById("copyButton").addEventListener("click", function () {

	if (window.RECEIVE) {
		// For mobile copy
		if (window.MOBILE) {
			const textareaFetch = document.getElementById("textareaFetch");
			if (!textareaFetch.value) {
				toast.warning("Nothing to copy", { duration: 1000 });
				return;
			}
			textareaFetch.select();
			document.execCommand("copy");
			toast.info("Copied to clipboard");
		}

		// For desktop copy
		if (window.DESKTOP) {
			const text = document.getElementById("textareaFetch").value;

			if (!text) {
				toast.warning("Nothing to copy", { duration: 1000 });
				return;
			}

			navigator.clipboard.writeText(text).then(() => {
				toast.info("Copied to clipboard");
			});
		}
	}
	if (window.SEND) {
		(async () => {
			try {
				if (!navigator.clipboard) {
					// Clipboard API not available
					toast.error("Clipboard API not available. Try pasting by default method.");
					return;
				}

				const text = await navigator.clipboard.readText();
				if (!text) {
					toast.warning("Clipboard is empty");
					return;
				}
				document.getElementById("textareaSend").value += text;
			} catch (err) {
				console.error("Failed to read clipboard contents: ", err);
				toast.error(err.message || "Clipboard is empty");
			}
		})();
	}

});

// Textarea clearing & Animation trigger
let rotation = 0;
document.getElementById("resetButton").addEventListener("click", function (e) {

	const fetchCodearea = document.getElementById("codeareaFetch");
	const textareaFetch = document.getElementById("textareaFetch");
	const textareaSend = document.getElementById("textareaSend");

	// Textarea clear
	e.preventDefault();
	if (window.RECEIVE) {
		textareaFetch.value = fetchCodearea.value = '';
		fetchCodearea.focus();
	}
	if (window.SEND) {
		textareaSend.value = '';
		textareaSend.focus();
	}

	// Animation
	rotation += 180;
	document.getElementById("resetIcon").style.transform = `rotate(${rotation}deg)`;
});
