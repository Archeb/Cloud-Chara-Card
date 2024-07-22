# Cloud Character Card “云角色卡”方案

为了防止角色卡设定和世界书轻易流出，设计此方案。

该方案相当于在你的反代（或者LLM API）前面多加一层反代，这个反代负责把角色卡的内容和世界书填充进去，然后这个反代由角色卡作者控制。

## 流程
酒馆（空白卡只有卡面和作者预先设定好的可以被调整的参数，用户填入LLM API地址和token）-> cloudflare worker/vercel/hf space等saas平台 -> 填充设定和世界书触发词 -> LLM API

## 防御效果
如果要让用户能够自己指定API Endpoint地址，prompt还是能获取到的。但是他们永远不可能获取到完整的世界书和触发机制。

## 部署成本
可以做成模板一键发布到cloudflare worker/vercel/hf space等saas平台，门槛不算特别高

## 方案开发难度与维护成本
低，该方案只需要进行一些参数的替换然后发给API后端即可。主要需要工作量的是权限管理部分。

## 缺点
~~角色卡作者会不可避免地从原理上能够获得LLM API Token，还有聊天记录（当然也完全可以匿名化处理）~~ 

通过使用hugging face等平台进行部署，可以做到代码可审计（同时角色卡受到保护），消除这方面的担忧。

## 使用自定义API钓走prompt？
为了防止这种事情，流程可以优化成：用户想要使用官方API或者OpenRouter等大代理站以外的自定义代理，则必须与卡片作者沟通，然后作者将其添加到代理白名单中。

让要加proxy的手动在dc、qq等渠道私聊作者让他加。对于潜在的恶意转载者来说，这很麻烦而且低效率，增加了他暴露的风险；但是对于真正想玩的人和创作者来说，都不会太麻烦，同时有效地促进了沟通。

## 更多可能性？

- 本项目除了作为代理，还可以建立一个landing page。
- 该landing page可以放置角色卡的介绍、一些自定义的元素比如背景音乐和图片、使用指引等
- 作者想停止配布了也可以随时关闭，但是又不会影响玩家自己存在本地的聊天记录

## Q&A
Q：如果想要改卡或者用自定义API怎么办
A：角色卡作者可以预留被允许修改的参数，没设计的话那确实连user的名字都没办法改；API的话，角色卡作者可以设定是否允许请求openai、claude等以外的非官方API，但是有被偷走prompt的风险。

Q：和电子魅魔网站、TG酒馆等Bot的区别？
A：该方案是去中心化的，我们提供的只有模板，不用担心偷卡私有化或者盈利化等问题；角色卡作者们自己进行一键部署，托管到各大SaaS云平台，都有免费套餐，也不用担心被人攻击的问题（作者有很多，攻击不过来）