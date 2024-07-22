import handleProxy from './proxy';
import { cloudWorld } from './cloudWorld';
import { cloudCharaCard } from './cloudCharaCard';

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
						if (cloudWorld[key]) {
							message.content = message.content.replace(cccWorld, cloudWorld[key].content);
							console.log(`Replaced ${key}`);
						}
					}
				}
				// look for <ccc-description /> tags
				message.content = message.content.replace(/<ccc-description \/>/g, cloudCharaCard.description);
				// look for <ccc-api> and <ccc-api-key> tags, and pass them to the proxy
				cccApi = cccApi ?? message.content.match(/<ccc-api>(.*?)<\/ccc-api>/);
				cccApiKey = cccApiKey ?? message.content.match(/<ccc-api-key>(.*?)<\/ccc-api-key>/);
			}
			if (cccApi && cccApiKey) {
				const api = cccApi[1];
				const apiKey = cccApiKey[1];
				return handleProxy(api, apiKey, url.pathname, requestJson);
			} else {
				return new Response(JSON.stringify({ error: { code: 400, message: 'Bad request: Missing API and API Key' } }), { status: 400 });
			}
		}

		return new Response(`<h2>Cloud Character Card Demo</h2><p>云角色卡演示</p><p>请把本页的地址复制到API Endpoint中开始使用角色卡</p>`, {
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
		});
	},
};
