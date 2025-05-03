const API_BASE = 'https://sunamra.in/paste/api/v1';

const toast = new ZephyrToast();

// This will be called from ./eventListeners.js
const executeFunction = () => {
	if (window.SEND) {
		postContent();
	} else if (window.RECEIVE) {
		getContent();
	}
}

const postContent = () => {
	// console.log('postContent()');
	// return;

	const textContent = document.getElementById('textareaSend').value;

	if (!textContent) {
		toast.warning("No content");
		return;
	}

	fetch(API_BASE, {
		method: "POST",
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ content: textContent })
	})
		.then(res => {
			return res.json()
		})
		.then((data) => {
			// console.log(data.success);
			if (data.success) {
				toast.success("Posting Successful", { duration: 2000 });
				setTimeout(() => {
					toast.info(`Code is ${data.code}`, { duration: 5000 });
				}, 300);
				document.getElementById('lastCode').innerHTML = data.code;

			}
			else {
				console.error(data.message);
				toast.error(data.message || "Error Posting")
			}
		})
		.catch((err) => {
			console.error('Error Posting: ', err);
			toast.error('Error Posting');
		})
}

const getContent = () => {
	// console.log('getContent()');
	// return;

	const code = document.getElementById('codeareaFetch').value;

	if (!code) {
		toast.warning("Please specify code");
		return;
	}

	fetch(`${API_BASE}/${code}`)
		.then(res => {
			return res.json()
		})
		.then((res) => {
			if (res.success) {
				// console.log(res);
				document.getElementById('textareaFetch').value = res.data;
			}
			else {
				throw new Error(`File ${code} doesn't exist`);
			}
		})
		.catch((err) => {
			console.error('Error in GET: ', err);
			toast.error(err?.message || err);
		})
}

