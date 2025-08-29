// =========================
// Importa CSS
// =========================
const styleMain = document.createElement("link");
styleMain.rel = "stylesheet";
styleMain.href = "styles.css";
document.head.appendChild(styleMain);

const styleConsulta = document.createElement("link");
styleConsulta.rel = "stylesheet";
styleConsulta.href = "styles2.css";
document.head.appendChild(styleConsulta);

// =========================
// Importa Font Awesome
// =========================
const faLink = document.createElement("link");
faLink.rel = "stylesheet";
faLink.href = "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css";
document.head.appendChild(faLink);

// =========================
// Importa jQuery
// =========================
const jqScript = document.createElement("script");
jqScript.src = "https://code.jquery.com/jquery-3.7.1.min.js";
document.head.appendChild(jqScript);

// =========================
// Importa Axios
// =========================
const axiosScript = document.createElement("script");
axiosScript.src = "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";
document.head.appendChild(axiosScript);

// =========================
// Importa Responsive JS
// =========================
const responsiveScript = document.createElement("script");
responsiveScript.src = "responsive.js";
document.head.appendChild(responsiveScript);

// =========================
// Importa Consulta JS
// =========================
const consultaScript = document.createElement("script");
consultaScript.src = "consulta.js";
document.head.appendChild(consultaScript);