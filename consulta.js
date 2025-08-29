document.addEventListener("DOMContentLoaded", () => {
    const input = document.getElementById("consultaInput");
    const btn = document.getElementById("consultaBtn");
    const respostaDiv = document.getElementById("consultaResposta");

    btn.addEventListener("click", () => {
        const pergunta = input.value.trim().toLowerCase();
        if (!pergunta) {
            respostaDiv.textContent = "Por favor, digite uma pergunta.";
            return;
        }

        fetch("respostas.xml")
            .then(res => res.text())
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "application/xml");
                const items = xmlDoc.getElementsByTagName("item");
                let melhorMatch = null;
                let maxPalavrasBatidas = 0;

                // Procurar pelo item que tem mais palavras em comum
                for (let i = 0; i < items.length; i++) {
                    const perguntaXML = items[i].getElementsByTagName("pergunta")[0].textContent.toLowerCase();
                    const palavrasInput = pergunta.split(/\s+/);
                    const palavrasXML = perguntaXML.split(/\s+/);

                    let count = 0;
                    palavrasInput.forEach(palavra => {
                        if (palavrasXML.includes(palavra)) count++;
                    });

                    if (count > maxPalavrasBatidas) {
                        maxPalavrasBatidas = count;
                        melhorMatch = items[i];
                    }
                }

                if (melhorMatch && maxPalavrasBatidas > 0) {
                    const resposta = melhorMatch.getElementsByTagName("resposta")[0].textContent;
                    respostaDiv.textContent = resposta;
                    respostaDiv.classList.add("show"); // animação se quiser
                } else {
                    respostaDiv.textContent = "Desculpe, não encontrei uma resposta para sua pergunta.";
                }
            })
            .catch(err => {
                respostaDiv.textContent = "Erro ao carregar a base de respostas.";
                console.error(err);
            });
    });
});
