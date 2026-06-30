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
// 确保在 DOM 加载后执行
document.addEventListener('DOMContentLoaded', function() {
  // 1. 定义打开外部链接的方法（优先使用 PakePlus 的 API，其次 Tauri 的 shell）
  function openExternal(url) {
    // 尝试 PakePlus 的全局方法（如果有）
    if (window.pake && typeof window.pake.openExternal === 'function') {
      window.pake.openExternal(url);
      return;
    }
    // 尝试 Tauri 的 shell (需要 @tauri-apps/api)
    if (window.__TAURI__ && window.__TAURI__.shell) {
      window.__TAURI__.shell.open(url);
      return;
    }
    // 尝试 invoke 自定义命令
    if (window.__TAURI__ && window.__TAURI__.core) {
      window.__TAURI__.core.invoke('open_url', { url: url }).catch(err => {
        console.error('invoke open_url failed:', err);
        // 如果失败，回退到默认行为（新窗口，但可能还是应用内）
        window.open(url, '_blank');
      });
      return;
    }
    // 最后的回退：使用 window.open
    window.open(url, '_blank');
  }

  // 2. 拦截所有点击事件（捕获阶段）
  document.addEventListener('click', function(e) {
    const anchor = e.target.closest('a');
    if (!anchor) return;
    const href = anchor.href;
    if (!href) return;
    // 判断是否应该外部打开：target="_blank" 或 base[target="_blank"] 或带有特定类（可选）
    const isBlank = (anchor.target === '_blank') || 
                    document.querySelector('head base[target="_blank"]');
    if (isBlank) {
      e.preventDefault();
      e.stopPropagation(); // 阻止其他监听器
      openExternal(href);
    }
  }, { capture: true });

  // 3. 覆盖 window.open（作为第二道防线）
  const originalOpen = window.open;
  window.open = function(url, target, features) {
    // 如果 target 是 _blank 或者未指定，则视为外部打开
    if (target === '_blank' || target === undefined) {
      openExternal(url);
      return null;
    }
    // 否则调用原生的 window.open
    return originalOpen.call(this, url, target, features);
  };
});