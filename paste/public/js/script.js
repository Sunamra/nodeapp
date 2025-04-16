const POST_API_ENDPOINT = 'http://localhost:3000/paste/api/v1/post';
const GET_API_ENDPOINT = 'http:/localhost:3000/paste/api/v1/get';

const toast = new ZephyrToast();

const executeFunction = () => {
	if (window.SEND) {
		postContent();
	} else if (window.RECEIVE) {
		getContent();
	}
}

// Submit when enter key pressed
document.getElementById("codearea").addEventListener("keypress", function (event) {
	if (event.key === "Enter") {
		event.preventDefault();
		executeFunction();
	}
});

// Submit when HTML buttons pressed
document.getElementById('myForm').addEventListener('submit', (e) => {
	e.preventDefault()
	executeFunction();
})


const postContent = () => {
	// console.log('postContent()');
	// return;

	// Using 'textarea2' for posting
	const textContent = document.getElementById('textarea2').value;

	if (!textContent) {
		toast.warning("No content");
		return;
	}

	fetch(POST_API_ENDPOINT, {
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
			toast.error(err?.message || err);
		})
}

const getContent = () => {
	// console.log('getContent()');
	// return;

	const code = document.getElementById('codearea').value;

	if (!code) {
		toast.warning("Please specify code");
		return;
	}

	fetch(`${GET_API_ENDPOINT}/${code}`)
		.then(res => {
			return res.json()
		})
		.then((res) => {
			if (res.success) {
				// console.log(res);

				// Using 'textarea' for fetching
				document.getElementById('textarea').value = res.data;
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

