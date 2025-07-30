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
  /*
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
*/
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

    // 🧠 Buscando prontuário via HTTP (novo back-end)
    fetch("http://localhost:3001/prontuario")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar prontuário.");
        return res.json();
      })
      .then((prontuario) => {
        console.log("Prontuário recebido do back-end:", prontuario);

        const payload = {
          sintomas: prontuario.sintomas?.trim() || "",
          contextoClinico: prontuario.contextoClinico?.trim() || "",
          queixaPrincipal: prontuario.queixaPrincipal?.trim() || "",
          examesRealizados: prontuario.examesRealizados?.trim() || "",
        };

        console.log(
          "Payload enviado para IA:",
          JSON.stringify(payload, null, 2)
        );

        return fetch("http://localhost:3000/api/gerar-diagnostico", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      })
      .then((res) => res.json())
      .then((data) => {
        console.log("Resposta do backend:", data);

        const resultado = data.resultado;
        loadingContainer.remove();

        if (!resultado) throw new Error("Resposta vazia da IA");

        mostrarTelaDiagnosticoFinal(resultado);
        diagnosticoAnterior = resultado;
      })
      .catch((err) => {
        loadingContainer.remove();
        alert("Erro ao gerar diagnóstico com IA.");
        console.error(err);
      });
  });

  /* Função para apresentar os diagnósticos */

  function mostrarTelaDiagnosticoFinal(resultado, alertaHTML = "") {
    if (!resultado?.diagnosticos || !resultado?.recomendacoes) {
      document.getElementById("diagnostico").innerHTML = `
      <p>Erro ao processar diagnóstico. A IA não retornou um conteúdo válido.</p>
    `;
      return;
    }
    toggle("diagnostico", true);
    const diagnosticoDiv = document.getElementById("diagnostico");

    const diagnosticos = resultado?.diagnosticos || [];
    const recomendacoes = resultado?.recomendacoes || [];

    const diagnosticosHTML = diagnosticos
      .map((diag) => {
        const justificativas = diag.justificativas.slice(0, 2);
        const justificativasHTML = justificativas
          .map((j) => `<li>${j}</li>`)
          .join("");

        return `
        <div class="diagnostic-item">
          <div class="title-confidence">
            <strong class="diagnostic-rank">${diag.nome}</strong>
            <span class="confidence">Confiança: <strong>${diag.confianca}%</strong></span>
          </div>
          Justificativa:
          <ul class="contributing-factors" style="margin-top: 0.5rem;">
            ${justificativasHTML}
          </ul>
        </div>
      `;
      })
      .join("");

    const recomendacoesHTML = recomendacoes
      .map((r) => `<li>${r}</li>`)
      .join("");

    diagnosticoDiv.innerHTML = `
    <section class="ia-analysis">
    ${alertaHTML}
      <h2>Análise por IA</h2>
      <h4 style="text-align: center;">Sugestões de Diagnóstico</h4>

      <div class="diagnostic-list">
        ${diagnosticosHTML}
      </div>

      <h3>Ações Recomendadas</h3>
      <ul class="recommended-actions">
        ${recomendacoesHTML}
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

    document
      .getElementById("btn-aceitar")
      .addEventListener("click", aceitarDiagnostico);
    document
      .getElementById("btn-revisar")
      .addEventListener("click", revisarDiagnostico);

    // Evento para o botão de retornar ao diagnóstico anterior (se existir)
    const btnVoltarAnterior = document.getElementById("btn-voltar-anterior");
    if (btnVoltarAnterior) {
      btnVoltarAnterior.addEventListener("click", () => {
        mostrarTelaDiagnosticoFinal(diagnosticoAnterior);
      });
    }
  }

  function revisarDiagnostico() {
    toggle("aguardando", false);

    const main = document.querySelector("main");

    const loadingContainer = document.createElement("div");
    loadingContainer.id = "loading";

    const spinner = document.createElement("div");
    spinner.classList.add("spinner");

    const texto = document.createElement("p");
    texto.textContent = "Reprocessando com IA...";
    texto.style.textAlign = "center";
    texto.style.color = "#666";
    texto.style.fontStyle = "italic";

    loadingContainer.appendChild(spinner);
    loadingContainer.appendChild(texto);
    main.appendChild(loadingContainer);

    // 🔁 Buscar prontuário novamente do back-end
    fetch("http://localhost:3001/prontuario")
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar prontuário.");
        return res.json();
      })
      .then((prontuario) => {
        const payload = {
          sintomas: prontuario.sintomas?.trim() || "",
          contextoClinico: prontuario.contextoClinico?.trim() || "",
          queixaPrincipal: prontuario.queixaPrincipal?.trim() || "",
          examesRealizados: prontuario.examesRealizados?.trim() || "",
        };

        return fetch("http://localhost:3000/api/gerar-diagnostico", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      })
      .then((res) => res.json())
      .then((data) => {
        loadingContainer.remove();

        const novoDiagnostico = data.resultado;

        const diagnosticoAtualBackup = diagnosticoAnterior;

        const confiancaAnterior =
          diagnosticoAnterior?.diagnosticos?.[0]?.confianca || 0;
        const confiancaNova =
          novoDiagnostico?.diagnosticos?.[0]?.confianca || 0;

        const alertaHTML =
          confiancaNova < confiancaAnterior
            ? `
      <div style="
        background-color: #fff3cd;
        color: #856404;
        border: 1px solid #ffeeba;
        padding: 10px;
        border-radius: 8px;
        margin-bottom: 16px;
      ">
        A nova sugestão da IA tem menor probabilidade de acerto que a anterior.
        <br><strong>Considere manter o diagnóstico anterior.</strong>
        <br><button class="button button-small" id="btn-voltar-anterior" style="margin-top: 10px;">🔙 Voltar para diagnóstico anterior</button>
      </div>
    `
            : "";

        mostrarTelaDiagnosticoFinal(novoDiagnostico, alertaHTML);

        setTimeout(() => {
          const btnVoltar = document.getElementById("btn-voltar-anterior");
          if (btnVoltar) {
            btnVoltar.addEventListener("click", () => {
              if (diagnosticoAtualBackup) {
                mostrarTelaDiagnosticoFinal(diagnosticoAtualBackup);
              } else {
                alert("Não há diagnóstico anterior disponível.");
              }
            });
          }
        }, 100);

        diagnosticoAnterior = novoDiagnostico;
      })
      .catch((err) => {
        loadingContainer.remove();
        alert("Erro ao reprocessar diagnóstico.");
        console.error(err);
      });
  }

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
});
