function openSection(sectionId) {
  // esconde todas as seções “filhas” do main
  document.getElementById("home-section").classList.add("hidden");
  document.getElementById("transfer-section").classList.add("hidden");
  document.getElementById("info-section").classList.add("hidden");

  // mostra a seção que foi clicada
  document.getElementById(sectionId).classList.remove("hidden");
}

function goHome() {
  // esconde as seções de detalhe
  document.getElementById("transfer-section").classList.add("hidden");
  document.getElementById("info-section").classList.add("hidden");
  // mostra a home
  document.getElementById("home-section").classList.remove("hidden");
}