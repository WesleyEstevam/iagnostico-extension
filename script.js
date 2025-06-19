document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Login ---------- */
  const loginBtn = document.getElementById("login-btn");
  loginBtn.addEventListener("click", () => {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();

    if (user && pass) {
      toggle("login", false);
      toggle("aguardando", true);
    } else {
      alert("Por favor, preencha todos os campos!");
    }
  });

  /* ---------- Simulação de prontuário salvo ---------- */
  document
    .getElementById("simular-prontuario")
    .addEventListener("click", abrirPopup);

  /* ---------- Popup ---------- */
  document.getElementById("btn-sim").addEventListener("click", () => {
    // Aqui você pode abrir um formulário extra ou chamar outra tela
    alert("Fluxo para acrescentar informações ainda não implementado.");
    fecharPopup();
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
          <button class="button" onclick="aceitarDiagnostico()">✅ Aceitar</button>
          <button class="button button-secondary" onclick="revisarDiagnostico()">🔄 Revisar</button>
        </div>
      </div>
    </section>
  `;
  }
  function aceitarDiagnostico() {
    alert("Diagnóstico aceito! Encaminhado para o prontuário.");
    reiniciar();
  }

  function revisarDiagnostico() {
    alert(
      "Modo de revisão ativado. Redirecionando para interface de edição..."
    );
    // Aqui você pode trocar por redirecionamento ou abrir um formulário.
    reiniciar();
  }
});
