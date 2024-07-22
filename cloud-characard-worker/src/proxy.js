async function handleProxy(api, apiKey, path, body) {
	const request = new Request(api + path, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${apiKey}`,
		},
		body: JSON.stringify(body),
	  });
	return fetch(request);
}
export default handleProxy;
