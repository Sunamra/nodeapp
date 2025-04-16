// Script for additional event listeners

// Only allow numbers in this textarea
document.getElementById("codearea").addEventListener("input", function () {
	this.value = this.value.replace(/[^0-9]/g, '');
});

// Copies/Pastes content to/from clipboard
document.getElementById("copyButton").addEventListener("click", function () {

	if (window.RECEIVE) {
		// For mobile copy
		if (window.MOBILE) {
			const textarea = document.getElementById("textarea");
			if (!textarea.value) {
				toast.warning("Nothing to copy", { duration: 1000 });
				return;
			}
			textarea.select();
			textarea.setSelectionRange(0, 999999);
			document.execCommand("copy");
			toast.info("Copied to clipboard");
		}

		// For desktop copy
		if (window.DESKTOP) {
			const text = document.getElementById("textarea").value;

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
					toast.error("Clipboard API not available");
					return;
				}

				const text = await navigator.clipboard.readText();
				if (!text) {
					toast.warning("Clipboard is empty 1");
					return;
				}
				document.getElementById("textarea2").value = text;
			} catch (err) {
				console.error("Failed to read clipboard contents: ", err);
				toast.warning("Clipboard is empty 2");
			}
		})();
	}

});

// Textarea clearing & Animation trigger
let rotation = 0;
document.getElementById("resetButton").addEventListener("click", function (e) {

	const codearea = document.getElementById("codearea");
	const textarea = document.getElementById("textarea");
	const textarea2 = document.getElementById("textarea2");

	// Textarea clear
	e.preventDefault();
	if (window.RECEIVE) {
		textarea.value = codearea.value = '';
		codearea.focus();
	}
	if (window.SEND) {
		textarea2.value = '';
		textarea2.focus();
	}

	// Animation
	rotation += 180;
	document.getElementById("resetIcon").style.transform = `rotate(${rotation}deg)`;
});
