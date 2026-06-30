window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// very important, if you don't know what it is, don't touch it
// 非常重要，不懂代码不要动，这里可以解决80%的问题，也可以生产1000+的bug
history.pushState = ()=>{};
history.replaceState = ()=>{};

const hookClick = (e) => {
    const origin = e.target.closest('a')
    const isBaseTargetBlank = document.querySelector(
        'head base[target="_blank"]'
    )
    console.log('origin', origin, isBaseTargetBlank)
    if (
        (origin && origin.href && origin.target === '_blank') ||
        (origin && origin.href && isBaseTargetBlank)
    ) {
        e.preventDefault()
        console.log('handle origin', origin)
        location.href = origin.href
    } else {
        console.log('not handle origin', origin)
    }
}

window.open = function (url, target, features) {
    console.log('open', url, target, features)
    location.href = url
}

document.addEventListener('click', hookClick, { capture: true })


//以下为新添加
document.addEventListener('click', function(e) {
  // 获取被点击的链接元素（处理点击链接内部子元素的情况）
  const link = e.target.closest('a');
  
  // 基础校验：确保存在链接且含有 href
  if (!link || !link.href) return;

  // 判断是否为 http 或 https 协议的外部链接
  const isHttpLink = link.href.startsWith('http://') || link.href.startsWith('https://');

  if (isHttpLink) {
    // 阻止 WebView 内部的默认跳转行为
    e.preventDefault();
    
    // 安全调用 Tauri Shell API 在外部浏览器打开
    if (window.__TAURI__ && window.__TAURI__.shell) {
      window.__TAURI__.shell.open(link.href).catch(err => {
        console.error('Failed to open link in external browser:', err);
      });
    } else {
      // 非 Tauri 环境（如普通浏览器调试）的降级处理
      window.open(link.href, '_blank');
    }
  }
}, true); // 使用捕获阶段监听，确保优先于页面其他脚本执行

