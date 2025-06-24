document.addEventListener("DOMContentLoaded", () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBWvCRmCStncTELIO187xy_gTkfzdybN8s",
    authDomain: "iagnostico-424f5.firebaseapp.com",
    projectId: "iagnostico-424f5",
    storageBucket: "iagnostico-424f5.appspot.com",
    messagingSenderId: "533601973345",
    appId: "1:533601973345:web:3adfd031563a7ebd216620",
    measurementId: "G-3E0RPRBWV9",
  };

  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  /* ---------- Login ---------- */
  const loginBtn = document.getElementById("login-btn");
  loginBtn.addEventListener("click", () => {
    const email = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
      alert("Por favor, preencha todos os campos!");
      return;
    }

    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        toggle("login", false);
        toggle("aguardando", true);
      })
      .catch((error) => {
        const errorCode = error.code;
        let mensagem = "Erro ao fazer login.";

        if (errorCode === "auth/user-not-found")
          mensagem = "Usuário não encontrado.";
        else if (errorCode === "auth/wrong-password")
          mensagem = "Senha incorreta.";
        else if (errorCode === "auth/invalid-email")
          mensagem = "E-mail inválido.";

        alert(mensagem);
      });
  });

  /* ---------- Simulação de prontuário salvo ---------- */
  document
    .getElementById("simular-prontuario")
    .addEventListener("click", abrirPopup);

  /* ---------- Popup ---------- */
  document.getElementById("btn-sim").addEventListener("click", () => {
    // Fecha o primeiro popup
    fecharPopup();
    // Mostra o segundo
    document.getElementById("modal-input-overlay").classList.remove("hidden");
  });

  // Função para fechar o segundo popup e continuar o fluxo
  document.getElementById("btn-enviar").addEventListener("click", () => {
    const infoAdicional = document.getElementById("input-info").value.trim();

    if (!infoAdicional) {
      alert("Por favor, escreva algo antes de enviar.");
      return;
    }

    document.getElementById("modal-input-overlay").classList.add("hidden");
    toggle("aguardando", false);

    // Spinner de carregamento
    const main = document.querySelector("main");

    const loadingContainer = document.createElement("div");
    loadingContainer.id = "loading";

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    const texto = document.createElement("p");
    texto.textContent = "Processando com IA...";
    texto.style.textAlign = "center";
    texto.style.color = "#666";
    texto.style.fontStyle = "italic";

    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(texto);
    main.appendChild(loadingContainer);

    // Simular tempo de IA
    setTimeout(() => {
      loadingContainer.remove();
      mostrarTelaDiagnosticoFinal();
    }, 4000);
  });

  document.getElementById("btn-nao").addEventListener("click", () => {
    fecharPopup();
    toggle("aguardando", false);

    // Criar elemento de carregamento (spinner + texto)
    const main = document.querySelector("main");

    const loadingContainer = document.createElement("div");
    loadingContainer.id = "loading";

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    const texto = document.createElement("p");
    texto.textContent = "Processando com IA...";
    texto.style.textAlign = "center";
    texto.style.color = "#666";
    texto.style.fontStyle = "italic";

    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(texto);
    main.appendChild(loadingContainer);

    // Simular tempo de processamento e exibir tela final
    setTimeout(() => {
      loadingContainer.remove();
      mostrarTelaDiagnosticoFinal();
    }, 4000);
  });

  /* ---------- Helpers ---------- */
  function abrirPopup() {
    document.getElementById("modal-overlay").classList.remove("hidden");
  }

  function fecharPopup() {
    document.getElementById("modal-overlay").classList.add("hidden");
  }

  function toggle(id, show) {
    document.getElementById(id).classList[show ? "remove" : "add"]("hidden");
  }

  function aceitarDiagnostico() {
    alert("Diagnóstico aceito! Encaminhado para o prontuário.");
  }

  function revisarDiagnostico() {
    // Esconde a tela atual
    toggle("diagnostico", false);

    // Spinner de novo diagnóstico
    const main = document.querySelector("main");

    const loadingContainer = document.createElement("div");
    loadingContainer.id = "loading";

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    const texto = document.createElement("p");
    texto.textContent = "Gerando nova análise com IA...";
    texto.style.textAlign = "center";
    texto.style.color = "#666";
    texto.style.fontStyle = "italic";

    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(texto);
    main.appendChild(loadingContainer);

    // Simula novo diagnóstico após 4 segundos
    setTimeout(() => {
      loadingContainer.remove();

      // Nova versão do diagnóstico (simulada)
      mostrarTelaDiagnosticoFinal_v2(); // nova função que você vai criar abaixo
    }, 4000);
  }

  function mostrarTelaDiagnosticoFinal() {
    toggle("diagnostico", true);

    const diagnosticoDiv = document.getElementById("diagnostico");
    diagnosticoDiv.innerHTML = `
    <section class="ia-analysis">
      <h2>Análise por IA</h2>
      <h4 style="text-align: center;">Sugestões de Diagnóstico</h4>

      <div class="diagnostic-list">
        <div class="diagnostic-item">
          <div class="title-confidence">
            <strong class="diagnostic-rank">Dengue</strong>
            <span class="confidence">Confiança: <strong>85%</strong></span>
          </div>
          Justificativa:
          <ul class="contributing-factors">
            <li>Febre alta e cefaleia retro-orbital (Peso: Alto)</li>
            <li>Leucopenia e Plaquetopenia (Peso: Alto)</li>
            <li>Dados epidemiológicos para Fortaleza (Peso: Médio)</li>
          </ul>
        </div>

        <div class="diagnostic-item">
          <div class="title-confidence">
            <strong class="diagnostic-rank">Chikungunya</strong>
            <span class="confidence">Confiança: <strong>10%</strong></span>
          </div>
          Justificativa:
          <ul class="contributing-factors">
            <li>Dor articular intensa é comum, mas outros sinais são menos específicos. (Peso: Baixo)</li>
          </ul>
        </div>
      </div>

      <h3>Ações Recomendadas</h3>
      <ul class="recommended-actions">
        <li>Hemograma e plaquetas (urgente)</li>
        <li>Sorologia para Dengue (NS1)</li>
      </ul>

        <div class="decision-box">
          <p>Você aceita o diagnóstico sugerido pela IA?</p>
          <div class="decision-buttons">
            <button class="button" id="btn-aceitar">✅ Aceitar</button>
            <button class="button button-secondary" id="btn-revisar">🔄 Revisar</button>
          </div>
        </div>
      </section>

      `;
    // ✅ Registrando eventos após inserção do HTML
    document
      .getElementById("btn-aceitar")
      .addEventListener("click", aceitarDiagnostico);
    document
      .getElementById("btn-revisar")
      .addEventListener("click", revisarDiagnostico);
  }

  function mostrarTelaDiagnosticoFinal_v2() {
    toggle("diagnostico", true);

    const diagnosticoDiv = document.getElementById("diagnostico");
    diagnosticoDiv.innerHTML = `
    <section class="ia-analysis">
      <h2>Nova Análise por IA</h2>
      <h4 style="text-align: center;">Sugestões de Diagnóstico</h4>

      <div class="diagnostic-list">
        <div class="diagnostic-item">
          <div class="title-confidence">
            <strong class="diagnostic-rank">Zika Vírus</strong>
            <span class="confidence">Confiança: <strong>70%</strong></span>
          </div>
          Justificativa:
          <ul class="contributing-factors">
            <li>Exantema e conjuntivite (Peso: Alto)</li>
            <li>Leve febre e histórico de surtos na região (Peso: Médio)</li>
          </ul>
        </div>

        <div class="diagnostic-item">
          <div class="title-confidence">
            <strong class="diagnostic-rank">Dengue</strong>
            <span class="confidence">Confiança: <strong>20%</strong></span>
          </div>
          Justificativa:
          <ul class="contributing-factors">
            <li>Febre e dor de cabeça, porém sem sinais laboratoriais marcantes. (Peso: Baixo)</li>
          </ul>
        </div>
      </div>

      <h3>Novas Ações Recomendadas</h3>
      <ul class="recommended-actions">
        <li>Coleta de sorologia viral</li>
        <li>Encaminhamento para acompanhamento ambulatorial</li>
      </ul>

        <div class="decision-box">
          <p>Você aceita o novo diagnóstico sugerido pela IA?</p>
          <div class="decision-buttons">
            <button class="button" id="btn-aceitar">✅ Aceitar</button>
            <button class="button button-secondary" id="btn-revisar">🔄 Revisar</button>
          </div>
        </div>
      </section>
      
      `;
    // ✅ Novamente, registre os eventos depois de inserir o HTML
    document
      .getElementById("btn-aceitar")
      .addEventListener("click", aceitarDiagnostico);
    document
      .getElementById("btn-revisar")
      .addEventListener("click", revisarDiagnostico);
  }
});
