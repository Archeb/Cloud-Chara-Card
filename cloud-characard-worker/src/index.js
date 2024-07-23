const handleProxy = async (api, apiKey, path, body) =>{
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

export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);

		if (url.pathname.startsWith('/v1')) {
			const requestJson = await request.json();
			var cccApi;
			var cccApiKey;
			// go through requestJson.messages
			for (const message of requestJson.messages) {
				console.log(message.role, message.content.length);
				// look for <ccc-world> tags
				const cccWorlds = message.content.match(/<ccc-world>(.*?)<\/ccc-world>/g);
				if (cccWorlds) {
					console.log(`found ${cccWorlds.length} ccc-world tags`);
					for (const cccWorld of cccWorlds) {
						const key = cccWorld.replace(/<ccc-world>|<\/ccc-world>/g, '');
						if (cloudCharaCard.cloudWorld[key]) {
							message.content = message.content.replace(cccWorld, cloudCharaCard.cloudWorld[key].content);
							console.log(`Replaced ${key}`);
						}
					}
				}
				// look for <ccc-api> and <ccc-api-key> tags, and pass them to the proxy
				cccApi = cccApi ?? message.content.match(/<ccc-api>(.*?)<\/ccc-api>/);
				cccApiKey = cccApiKey ?? message.content.match(/<ccc-api-key>(.*?)<\/ccc-api-key>/);
				// remove <ccc-api> and <ccc-api-key> tags
				message.content = message.content.replace(/<ccc-api>(.*?)<\/ccc-api>/g, '');
				message.content = message.content.replace(/<ccc-api-key>(.*?)<\/ccc-api-key>/g, '');
				// look for <ccc-description /> tags
				message.content = message.content.replace(/<ccc-description \/>/g, cloudCharaCard.description);
				// look for <ccc-personality /> tags
				message.content = message.content.replace(/<ccc-personality \/>/g, cloudCharaCard.personality);
				// look for <ccc-scenarios /> tags
				message.content = message.content.replace(/<ccc-scenarios \/>/g, cloudCharaCard.scenarios);
				// look for <ccc-first_mes /> tags
				message.content = message.content.replace(/<ccc-first_mes \/>/g, cloudCharaCard.first_mes);
				// look for <ccc-mes_example /> tags
				message.content = message.content.replace(/<ccc-mes_example \/>/g, cloudCharaCard.mes_example);
			}
			if (cccApi && cccApiKey) {
				const api = cccApi[1];
				const apiKey = cccApiKey[1];
				return handleProxy(api, apiKey, url.pathname, requestJson);
			} else {
				return new Response(JSON.stringify({ error: { code: 400, message: 'Bad request: Missing API and API Key' } }), { status: 400 });
			}
		}

		return new Response(`<title>${cloudCharaCard.name}</title>
			<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/@picocss/pico@2/css/pico.min.css"
/>
<body><main class="container">
			<h2>${cloudCharaCard.name}</h2>
			<p>这是一张云端角色卡，您可以在酒馆中使用该角色卡，就跟任何其他角色卡一样。</p>
			<div>${cloudCharaCard.cloudNote}</div>
			<h4>使用说明</h4>
			<p>请在酒馆中打开API设置，选择聊天补全源为 Custom (OpenAI-compatible)</p>
			<p>Custom Endpoint (Base URL) 输入：<code>https://${request.headers.get("Host")}/v1</code></p>
			<p>Custom API Key 可以留空；Model ID 需要输入完整的模型名称如 <code>claude-3-5-sonnet-20240620</code></p>
			<p>然后打开角色卡编辑，在<code>&lt;ccc-api&gt;</code>和<code>&lt;ccc-api-key&gt;</code>标签里面输入你要用的反代或者官方API地址和Key（不要带有 /v1 结尾）。</p>
			<p>然后就完成了，只需要像任何其他角色卡一样游玩即可。</p>
			</main>
			</body>
			`, {
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
		});
	},
};
