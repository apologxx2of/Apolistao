const API = "https://governodoapolistao.pythonanywhere.com/";
let TOKEN = ""; // guarda o token do usuário

async function apiFetch(url, options = {}) {
  if (!options.headers) options.headers = {};
  if (TOKEN) options.headers["Authorization"] = `Bearer ${TOKEN}`;
  return fetch(`${API}${url}`, options);
}

async function registrar() {
  const username = document.getElementById("username").value;
  const senha = document.getElementById("senha").value;

  try {
    let r = await apiFetch("/registrar", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ username, senha })
    });

    let data = await r.json();
    if (!r.ok) {
      await login(username, senha);
      return;
    }

    TOKEN = data.token;
    msg(`Conta criada com código: ${data.codigo}`);
    entrarHome(username);

  } catch(e) {
    msg("Erro: " + e);
  }
}

async function login(username, senha) {
  let r = await apiFetch("/login", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ username, senha })
  });

  let data = await r.json();
  if (r.ok) {
    TOKEN = data.token;
    entrarHome(username);
  } else {
    msg(data.erro || "Login falhou.");
  }
}

function entrarHome(username) {
  document.getElementById("auth-section").classList.add("hidden");
  document.getElementById("home-section").classList.remove("hidden");
  document.getElementById("bemvindo").innerText = `Bem-vindo, ${username}`;
  verSaldo();
  verCodigo();
}

async function verSaldo() {
  let r = await apiFetch("/saldo");
  if (r.ok) {
    let data = await r.json();
    document.getElementById("saldo").innerText = data.saldo.toFixed(2) + " G$";
  }
}

async function verCodigo() {
  let r = await apiFetch("/vercodigo");
  if (r.ok) {
    let data = await r.json();
    document.getElementById("codigo_usuario").innerText = data.codigo;
  }
}

async function transferir() {
  const codigo = document.getElementById("codigo").value;
  const valor = document.getElementById("valor").value;

  let r = await apiFetch("/iniciartransferencia", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ codigo, valor })
  });

  let data = await r.json();
  msg(data.msg || data.erro);
  verSaldo();
}

async function reembolsar() {
  const codigo = document.getElementById("codigo_reembolso").value;
  const valor = document.getElementById("valor_reembolso").value;

  let r = await apiFetch("/reembolso", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({ codigo, valor })
  });

  let data = await r.json();
  msg(data.msg || data.erro);
  verSaldo();
}

async function excluirConta() {
  let r = await apiFetch("/excluirconta", { method: "POST" });
  let data = await r.json();
  msg(data.msg || data.erro);
  document.getElementById("home-section").classList.add("hidden");
  document.getElementById("auth-section").classList.remove("hidden");
  TOKEN = "";
}

function msg(text) {
  document.getElementById("msg").innerText = text;
}