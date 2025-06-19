(() => {
  const SIDEBAR_ID = "iagnostico-sidebar";
  const SIDEBAR_WIDTH = 400; // px
  const existing = document.getElementById(SIDEBAR_ID);
  const body = document.body;

  // ---------- FECHAR (se já existe) ----------
  if (existing) {
    existing.remove();

    // Restaura a margem original, se tivermos salvo
    if (body.dataset.iagOriginalMr !== undefined) {
      body.style.marginRight = body.dataset.iagOriginalMr;
      delete body.dataset.iagOriginalMr;
    }
    return;
  }

  // ---------- ABRIR ----------
  // Salva a margem original apenas na primeira abertura
  if (body.dataset.iagOriginalMr === undefined) {
    body.dataset.iagOriginalMr = getComputedStyle(body).marginRight;
  }

  // Aplica recuo para não sobrepor conteúdo
  body.style.transition = "margin-right 0.3s ease";
  body.style.marginRight = `${SIDEBAR_WIDTH}px`;

  // Cria o iframe da sidebar
  const iframe = document.createElement("iframe");
  iframe.id = SIDEBAR_ID;
  iframe.src = chrome.runtime.getURL("index.html");
  iframe.style.cssText = `
    position: fixed;
    top: 0;
    right: 0;
    width: ${SIDEBAR_WIDTH}px;
    height: 100%;
    border: none;
    z-index: 999999;
    box-shadow: -2px 0 8px rgba(0,0,0,.2);
  `;

  document.documentElement.appendChild(iframe);
})();
