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
            .then(res => {
                if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
                return res.text();
            })
            .then(data => {
                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(data, "application/xml");
                const items = xmlDoc.getElementsByTagName("item");

                console.log("Itens carregados do XML:", items.length);
                if (items.length === 0) {
                    respostaDiv.textContent = "Nenhum item encontrado no XML.";
                    return;
                }

                let melhorMatch = null;
                let maxPalavrasBatidas = 0;
                const palavrasInput = pergunta.split(/\s+/);

                for (let i = 0; i < items.length; i++) {
                    const perguntaXML = items[i].getElementsByTagName("pergunta")[0]?.textContent?.trim().toLowerCase() || "";
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
                    const resposta = melhorMatch.getElementsByTagName("resposta")[0]?.textContent || "Resposta vazia";
                    respostaDiv.textContent = resposta;
                    respostaDiv.classList.add("show");
                } else {
                    respostaDiv.textContent = "Desculpe, não encontrei uma resposta para sua pergunta.";
                }
            })
            .catch(err => {
                console.error("Erro no fetch ou parsing do XML:", err);
                respostaDiv.textContent = "Erro ao carregar a base de respostas.";
            });
    });
});
