const API = "https://governodoapolistao.pythonanywhere.com";
let TOKEN = ""; // guarda o token do usuário

// Função fetch global
async function apiFetch(url, options = {}) {
  if (!options.headers) options.headers = {};
  options.headers["Content-Type"] = "application/json";

  // Só adiciona token se tiver e não for registrar/login
  if (TOKEN && !["/registrar", "/login"].includes(url)) {
    options.headers["Authorization"] = `Bearer ${TOKEN}`;
  }

  console.log("Tentando fetch:", `${API}${url}`);
  console.log("Payload enviado:", options.body);

  try {
    const res = await fetch(`${API}${url}`, options);
    console.log("Status fetch:", res.status);
    return res;
  } catch (e) {
    console.error("Erro no fetch:", e);
    throw e;
  }
}

// Registrar usuário
async function registrar() {
  const username = document.getElementById("username").value;
  const senha = document.getElementById("senha").value;

  try {
    const r = await apiFetch("/registrar", {
      method: "POST",
      body: JSON.stringify({ username, senha })
    });

    const data = await r.json();

    if (!r.ok) {
      await login(username, senha);
      return;
    }

    TOKEN = data.token;
    msg(`Conta criada com código: ${data.codigo}`);
    entrarHome(username);

  } catch (e) {
    msg("Erro: " + e.message);
  }
}

// Login
async function login(username, senha) {
  try {
    const r = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({ username, senha })
    });

    const data = await r.json();

    if (r.ok) {
      TOKEN = data.token;
      entrarHome(username);
    } else {
      msg(data.erro || "Login falhou.");
    }
  } catch (e) {
    msg("Erro: " + e.message);
  }
}

// Entrar na home
function entrarHome(username) {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("home-section").classList.remove("hidden");
  document.getElementById("bemvindo").innerText = `Bem-vindo, ${username}`;
  verSaldo();
  verCodigo();
}

// Ver saldo
async function verSaldo() {
  try {
    const r = await apiFetch("/saldo");
    if (r.ok) {
      const data = await r.json();
      document.getElementById("saldo").innerText = data.saldo.toFixed(2) + " G$";
    }
  } catch (e) {
    msg("Erro ao buscar saldo: " + e.message);
  }
}

// Ver código do usuário
async function verCodigo() {
  try {
    const r = await apiFetch("/vercodigo");
    if (r.ok) {
      const data = await r.json();
      document.getElementById("codigo_usuario").innerText = data.codigo;
    }
  } catch (e) {
    msg("Erro ao buscar código: " + e.message);
  }
}

// Transferir
async function transferir() {
  const codigo = document.getElementById("codigo").value;
  const valor = document.getElementById("valor").value;

  try {
    const r = await apiFetch("/iniciartransferencia", {
      method: "POST",
      body: JSON.stringify({ codigo, valor })
    });
    const data = await r.json();
    msg(data.msg || data.erro);
    verSaldo();
  } catch (e) {
    msg("Erro na transferência: " + e.message);
  }
}

// Reembolsar
async function reembolsar() {
  const codigo = document.getElementById("codigo_reembolso").value;
  const valor = document.getElementById("valor_reembolso").value;

  try {
    const r = await apiFetch("/reembolso", {
      method: "POST",
      body: JSON.stringify({ codigo, valor })
    });
    const data = await r.json();
    msg(data.msg || data.erro);
    verSaldo();
  } catch (e) {
    msg("Erro no reembolso: " + e.message);
  }
}

// Excluir conta
async function excluirConta() {
  try {
    const r = await apiFetch("/excluirconta", { method: "POST" });
    const data = await r.json();
    msg(data.msg || data.erro);
    document.getElementById("home-section").classList.add("hidden");
    document.getElementById("auth-section").classList.remove("hidden");
    TOKEN = "";
  } catch (e) {
    msg("Erro ao excluir conta: " + e.message);
  }
}

// Mostrar mensagem
function msg(text) {
  document.getElementById("msg").innerText = text;
}
