window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});document.addEventListener('click', (e) => { 
  
  const anchor = e.target.closest('a');
  if (!anchor || anchor.target !== '_blank') return;

  e.preventDefault();
  const url = anchor.href;

  // 动态创建新窗口
  const { WebviewWindow } = window.__TAURI__.webviewWindow;
  const label = `window_${Date.now()}`; // 确保每个窗口 label 唯一
  const webview = new WebviewWindow(label, {
    url: url,
    width: 1000,
    height: 800,
    center: true,
    resizable: true,
    title: anchor.textContent || '新窗口',
    // 其他可选项参考官方文档
  });

  // 可选：监听创建错误
  webview.once('tauri://error', (e) => {
    console.error('创建窗口失败:', e);
  });
});

