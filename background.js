// Lista de URLs onde a sidebar deve abrir automaticamente
const autoInjectHosts = [
  "https://prontuarioeletronico-exemplo.vercel.app/*",
  "https://chatgpt.com/*",
  "http://127.0.0.1:5500/index.html/*",
];

// Verifica se a URL corresponde a algum domínio da lista
function shouldAutoInject(url) {
  return autoInjectHosts.some((host) => {
    if (host.includes("*")) {
      // Match com wildcard
      const regex = new RegExp("^" + host.replace(/\*/g, ".*"));
      return regex.test(url);
    } else {
      return url.startsWith(host);
    }
  });
}

// Injeção segura (sem chrome://, etc.)
function inject(tabId, url) {
  if (!url || url.startsWith("chrome://")) return;
  chrome.scripting.executeScript({
    target: { tabId },
    files: ["injectSidebar.js"],
  });
}

// 1. Ao clicar manualmente na extensão
chrome.action.onClicked.addListener((tab) => {
  inject(tab.id, tab.url);
});

// 2. Ao atualizar a aba (somente se for prontuário)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete" && shouldAutoInject(tab.url)) {
    inject(tabId, tab.url);
  }

  chrome.runtime.onMessageExternal.addListener(
    (message, sender, sendResponse) => {
      if (message.type === "PRONTUARIO_SALVO") {
        console.log("Prontuário recebido:", message.payload);

        // Armazena no localStorage da extensão
        chrome.storage.local.set({ prontuario: message.payload }, () => {
          sendResponse({
            status: "OK",
            message: "Dados armazenados na extensão.",
          });
        });

        return true; // necessário para usar sendResponse async
      }
    }
  );
});
