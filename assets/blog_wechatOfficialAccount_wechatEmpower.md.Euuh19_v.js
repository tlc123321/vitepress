import{_ as s,o as a,c as n,R as p}from"./chunks/framework.M8QmVFdX.js";const F=JSON.parse('{"title":"微信公众号h5授权","description":"","frontmatter":{},"headers":[],"relativePath":"blog/wechatOfficialAccount/wechatEmpower.md","filePath":"blog/wechatOfficialAccount/wechatEmpower.md","lastUpdated":1717050767000}'),o={name:"blog/wechatOfficialAccount/wechatEmpower.md"},l=p(`<h1 id="微信公众号h5授权" tabindex="-1">微信公众号h5授权 <a class="header-anchor" href="#微信公众号h5授权" aria-label="Permalink to &quot;微信公众号h5授权&quot;">​</a></h1><h2 id="背景" tabindex="-1">背景 <a class="header-anchor" href="#背景" aria-label="Permalink to &quot;背景&quot;">​</a></h2><p>同事离职了，于是我接手了他的h5项目，需求是在目前嵌套在我们公众号的h5页面中，用户订单支付后，公众号推一个消息提醒，其实这是一个很常见的需求。</p><h2 id="解决方案" tabindex="-1">解决方案 <a class="header-anchor" href="#解决方案" aria-label="Permalink to &quot;解决方案&quot;">​</a></h2><p>目前官方文档是有这个能力的,无非就是会有亿点细节而已</p><h3 id="_1-相关文档" tabindex="-1">1.相关文档 <a class="header-anchor" href="#_1-相关文档" aria-label="Permalink to &quot;1.相关文档&quot;">​</a></h3><ul><li><a href="https://developers.weixin.qq.com/doc/offiaccount/Message_Management/Template_Message_Interface.html" target="_blank" rel="noreferrer">模板消息接口</a></li><li><a href="https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html" target="_blank" rel="noreferrer">网页授权</a></li></ul><p>其中模板消息接口是可以发送模板消息，但是需要用户的<code>openId</code>，这个<code>openId</code>是用户关注公众号生成的一个唯一凭证，所以我们需要先进行网页授权来获取用户的<code>openId</code></p><p>模板发送接口我们后端已经二次封装好了，所以目前的难点就是获取用户的<code>openId</code></p><h3 id="_2-网页授权" tabindex="-1">2.网页授权 <a class="header-anchor" href="#_2-网页授权" aria-label="Permalink to &quot;2.网页授权&quot;">​</a></h3><p>微信授权目前有两种授权方式<code>scope=snsapi_base</code>(静默授权，用户无感知，不会出现授权弹窗)和<code>scope=snsapi_userinfo</code>(弹出授权页面，用户有感知，会出现授权弹窗)，由于我这边只需要<code>openId</code>，不需要用户的其他信息，所以我选择了<code>scope=snsapi_base</code></p><p>授权流程如下:</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">用户同意授权，获取code -&gt; 通过code调用接口拿到用户\`openId\`</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">用户同意授权，获取code -&gt; 通过code调用接口拿到用户\`openId\`</span></span></code></pre></div><h4 id="_2-1-用户同意授权-获取code" tabindex="-1">2.1 用户同意授权，获取code <a class="header-anchor" href="#_2-1-用户同意授权-获取code" aria-label="Permalink to &quot;2.1 用户同意授权，获取code&quot;">​</a></h4><p>刚开始的解决方案是进入页面时，直接跳转到授权地址</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&amp;redirect_uri=REDIRECT_URI&amp;response_type=code&amp;scope=SCOPE&amp;state=STATE#wechat_redirect</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">https://open.weixin.qq.com/connect/oauth2/authorize?appid=APPID&amp;redirect_uri=REDIRECT_URI&amp;response_type=code&amp;scope=SCOPE&amp;state=STATE#wechat_redirect</span></span></code></pre></div><p>但是这样会出现先进入默认地址，再跳转到回调地址，而我们这个回调地址其实就是默认地址，就会出现同一个页面闪屏两次，体验不好，于是我我们就想，既然是公众号，地址本来就是配置上去的，那为什么不直接配置的时候就配置授权地址呢，这样就可以解决跳转两次的问题。</p><div class="warning custom-block"><p class="custom-block-title">警告</p><p>注意：<code>redirect_uri</code>里面的回调地址需要编码一下，所以配置地址的时候需要配置编码之后的地址</p></div><p>由于回调地址如果路由是hash模式，会出现一个地址混乱的问题，如我们配置的回调地址是</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">http://192.168.7.103:8090/#/herdGoodsList/12101</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">http://192.168.7.103:8090/#/herdGoodsList/12101</span></span></code></pre></div><p>混乱之后会变成</p><div class="language-txt vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">txt</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#e1e4e8;">http://192.168.7.103:8090/?code=001d1b0002i58R193L100P5oKL0d1b0s&amp;state=#/herdGoodsList/12101</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#24292e;">http://192.168.7.103:8090/?code=001d1b0002i58R193L100P5oKL0d1b0s&amp;state=#/herdGoodsList/12101</span></span></code></pre></div><p>所以我们还需要对地址进行一次修改</p><div class="language-js vp-adaptive-theme"><button title="Copy Code" class="copy"></button><span class="lang">js</span><pre class="shiki github-dark vp-code-dark"><code><span class="line"><span style="color:#6A737D;">// 获取code</span></span>
<span class="line"><span style="color:#B392F0;">getWXCode</span><span style="color:#E1E4E8;"> () {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#6A737D;">// window.location.replace(\`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx79c95085a9eeb8c9&amp;redirect_uri=http://192.168.7.103:8090/#/herdGoodsList/12101&amp;response_type=code&amp;scope=snsapi_base#wechat_redirect\`)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">url</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">encodeURI</span><span style="color:#E1E4E8;">(window.location.href)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (url.</span><span style="color:#B392F0;">indexOf</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;/?code&#39;</span><span style="color:#E1E4E8;">) </span><span style="color:#F97583;">&gt;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">-</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">const</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">code</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">getUrlParam</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;code&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#79B8FF;">this</span><span style="color:#E1E4E8;">.</span><span style="color:#B392F0;">getOpenId</span><span style="color:#E1E4E8;">(code)</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">},</span></span>
<span class="line"><span style="color:#6A737D;">// 截取当前页面中code值</span></span>
<span class="line"><span style="color:#B392F0;">getUrlParam</span><span style="color:#E1E4E8;"> (name) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> reg </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">new</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">RegExp</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;(^|&amp;)&#39;</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> name </span><span style="color:#F97583;">+</span><span style="color:#E1E4E8;"> </span><span style="color:#9ECBFF;">&#39;=([^&amp;]*)(&amp;|$)&#39;</span><span style="color:#E1E4E8;">)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">let</span><span style="color:#E1E4E8;"> r </span><span style="color:#F97583;">=</span><span style="color:#E1E4E8;"> window.location.search.</span><span style="color:#B392F0;">substr</span><span style="color:#E1E4E8;">(</span><span style="color:#79B8FF;">1</span><span style="color:#E1E4E8;">).</span><span style="color:#B392F0;">match</span><span style="color:#E1E4E8;">(reg)</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (r </span><span style="color:#F97583;">!=</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span><span style="color:#E1E4E8;">) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#B392F0;">unescape</span><span style="color:#E1E4E8;">(r[</span><span style="color:#79B8FF;">2</span><span style="color:#E1E4E8;">])</span></span>
<span class="line"><span style="color:#E1E4E8;">    } </span><span style="color:#F97583;">else</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">return</span><span style="color:#E1E4E8;"> </span><span style="color:#79B8FF;">null</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">},</span></span>
<span class="line"><span style="color:#6A737D;">// 获取openId</span></span>
<span class="line"><span style="color:#B392F0;">getOpenId</span><span style="color:#E1E4E8;"> (code) {</span></span>
<span class="line"><span style="color:#E1E4E8;">    $http.</span><span style="color:#B392F0;">getOpenId</span><span style="color:#E1E4E8;">({ code }, mpkey).</span><span style="color:#B392F0;">then</span><span style="color:#E1E4E8;">(</span><span style="color:#FFAB70;">res</span><span style="color:#E1E4E8;"> </span><span style="color:#F97583;">=&gt;</span><span style="color:#E1E4E8;"> {</span></span>
<span class="line"><span style="color:#E1E4E8;">    </span><span style="color:#F97583;">if</span><span style="color:#E1E4E8;"> (res.succeed) {</span></span>
<span class="line"><span style="color:#E1E4E8;">        window.localStorage.</span><span style="color:#B392F0;">setItem</span><span style="color:#E1E4E8;">(</span><span style="color:#9ECBFF;">&#39;openId&#39;</span><span style="color:#E1E4E8;">, res.data.openId)</span></span>
<span class="line"><span style="color:#E1E4E8;">        history.</span><span style="color:#B392F0;">replaceState</span><span style="color:#E1E4E8;">(</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#9ECBFF;">&#39;&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#9ECBFF;">&#39;&#39;</span><span style="color:#E1E4E8;">,</span></span>
<span class="line"><span style="color:#E1E4E8;">        </span><span style="color:#9ECBFF;">\`\${</span><span style="color:#E1E4E8;">window</span><span style="color:#9ECBFF;">.</span><span style="color:#E1E4E8;">location</span><span style="color:#9ECBFF;">.</span><span style="color:#E1E4E8;">origin</span><span style="color:#9ECBFF;">}/#/herdGoodsList/12101\`</span></span>
<span class="line"><span style="color:#E1E4E8;">        )</span></span>
<span class="line"><span style="color:#E1E4E8;">    }</span></span>
<span class="line"><span style="color:#E1E4E8;">    })</span></span>
<span class="line"><span style="color:#E1E4E8;">},</span></span></code></pre><pre class="shiki github-light vp-code-light"><code><span class="line"><span style="color:#6A737D;">// 获取code</span></span>
<span class="line"><span style="color:#6F42C1;">getWXCode</span><span style="color:#24292E;"> () {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#6A737D;">// window.location.replace(\`https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx79c95085a9eeb8c9&amp;redirect_uri=http://192.168.7.103:8090/#/herdGoodsList/12101&amp;response_type=code&amp;scope=snsapi_base#wechat_redirect\`)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">url</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">encodeURI</span><span style="color:#24292E;">(window.location.href)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (url.</span><span style="color:#6F42C1;">indexOf</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;/?code&#39;</span><span style="color:#24292E;">) </span><span style="color:#D73A49;">&gt;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">-</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">const</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">code</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">getUrlParam</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;code&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#005CC5;">this</span><span style="color:#24292E;">.</span><span style="color:#6F42C1;">getOpenId</span><span style="color:#24292E;">(code)</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">},</span></span>
<span class="line"><span style="color:#6A737D;">// 截取当前页面中code值</span></span>
<span class="line"><span style="color:#6F42C1;">getUrlParam</span><span style="color:#24292E;"> (name) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> reg </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">new</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">RegExp</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;(^|&amp;)&#39;</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> name </span><span style="color:#D73A49;">+</span><span style="color:#24292E;"> </span><span style="color:#032F62;">&#39;=([^&amp;]*)(&amp;|$)&#39;</span><span style="color:#24292E;">)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">let</span><span style="color:#24292E;"> r </span><span style="color:#D73A49;">=</span><span style="color:#24292E;"> window.location.search.</span><span style="color:#6F42C1;">substr</span><span style="color:#24292E;">(</span><span style="color:#005CC5;">1</span><span style="color:#24292E;">).</span><span style="color:#6F42C1;">match</span><span style="color:#24292E;">(reg)</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (r </span><span style="color:#D73A49;">!=</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span><span style="color:#24292E;">) {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#6F42C1;">unescape</span><span style="color:#24292E;">(r[</span><span style="color:#005CC5;">2</span><span style="color:#24292E;">])</span></span>
<span class="line"><span style="color:#24292E;">    } </span><span style="color:#D73A49;">else</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">return</span><span style="color:#24292E;"> </span><span style="color:#005CC5;">null</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">},</span></span>
<span class="line"><span style="color:#6A737D;">// 获取openId</span></span>
<span class="line"><span style="color:#6F42C1;">getOpenId</span><span style="color:#24292E;"> (code) {</span></span>
<span class="line"><span style="color:#24292E;">    $http.</span><span style="color:#6F42C1;">getOpenId</span><span style="color:#24292E;">({ code }, mpkey).</span><span style="color:#6F42C1;">then</span><span style="color:#24292E;">(</span><span style="color:#E36209;">res</span><span style="color:#24292E;"> </span><span style="color:#D73A49;">=&gt;</span><span style="color:#24292E;"> {</span></span>
<span class="line"><span style="color:#24292E;">    </span><span style="color:#D73A49;">if</span><span style="color:#24292E;"> (res.succeed) {</span></span>
<span class="line"><span style="color:#24292E;">        window.localStorage.</span><span style="color:#6F42C1;">setItem</span><span style="color:#24292E;">(</span><span style="color:#032F62;">&#39;openId&#39;</span><span style="color:#24292E;">, res.data.openId)</span></span>
<span class="line"><span style="color:#24292E;">        history.</span><span style="color:#6F42C1;">replaceState</span><span style="color:#24292E;">(</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">&#39;&#39;</span><span style="color:#24292E;">,</span></span>
<span class="line"><span style="color:#24292E;">        </span><span style="color:#032F62;">\`\${</span><span style="color:#24292E;">window</span><span style="color:#032F62;">.</span><span style="color:#24292E;">location</span><span style="color:#032F62;">.</span><span style="color:#24292E;">origin</span><span style="color:#032F62;">}/#/herdGoodsList/12101\`</span></span>
<span class="line"><span style="color:#24292E;">        )</span></span>
<span class="line"><span style="color:#24292E;">    }</span></span>
<span class="line"><span style="color:#24292E;">    })</span></span>
<span class="line"><span style="color:#24292E;">},</span></span></code></pre></div><p>这里主要是用的<code>history.replaceState</code>方法</p><h4 id="_2-2-通过code调用接口拿到用户openid" tabindex="-1">2.2 通过code调用接口拿到用户<code>openId</code> <a class="header-anchor" href="#_2-2-通过code调用接口拿到用户openid" aria-label="Permalink to &quot;2.2 通过code调用接口拿到用户\`openId\`&quot;">​</a></h4><p>这步就很简单了，拿到code直接调接口就行</p><h2 id="总结" tabindex="-1">总结 <a class="header-anchor" href="#总结" aria-label="Permalink to &quot;总结&quot;">​</a></h2><p>微信h5公众号授权不难，但是会有一些坑，主要是地址混乱和回调闪屏的问题，这两点需要注意</p>`,29),e=[l];function c(t,r,E,y,i,d){return a(),n("div",null,e)}const u=s(o,[["render",c]]);export{F as __pageData,u as default};