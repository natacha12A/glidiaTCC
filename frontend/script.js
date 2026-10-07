// GLÍDIA - JAVASCRIPT PRINCIPAL

const API_URL = "https://glidia-backend.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
    inicializarTema();
    inicializarMenu();
    inicializarScroll();
    inicializarAnimacoes();
    inicializarLeitura();
    inicializarLogin();
    inicializarCadastro();
    inicializarContato();
    inicializarComandoVoz();
    inicializarGPS();
    inicializarUber();
    inicializarConfiguracoes();
    inicializarLembretes();
    inicializarLogout();
});

function inicializarTema() {
    const themeBtn = document.getElementById("theme-btn");

    if (!themeBtn) return;

    const temaSalvo = localStorage.getItem("tema");

    if (temaSalvo === "dark") {
        document.body.classList.add("dark-mode");
    }

    atualizarIconeTema();

    themeBtn.addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");

        const temaAtual = document.body.classList.contains("dark-mode")
            ? "dark"
            : "light";

        localStorage.setItem("tema", temaAtual);
        atualizarIconeTema();
    });
}

function atualizarIconeTema() {
    const themeBtn = document.getElementById("theme-btn");

    if (!themeBtn) return;

    const darkMode = document.body.classList.contains("dark-mode");

    themeBtn.innerHTML = darkMode
        ? '<i class="fas fa-sun"></i>'
        : '<i class="fas fa-moon"></i>';
}

function inicializarMenu() {
    const menuBtn = document.querySelector(".menu-btn");
    const menu = document.querySelector(".menu");

    if (!menuBtn || !menu) return;

    menuBtn.addEventListener("click", () => {
        menu.classList.toggle("active");
        menuBtn.classList.toggle("active");
    });

    menu.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            menuBtn.classList.remove("active");
        });
    });
}

function inicializarScroll() {
    const header = document.querySelector("header");

    if (!header) return;

    window.addEventListener("scroll", () => {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    });
}

function inicializarAnimacoes() {
    const elementos = document.querySelectorAll(
        ".reveal, .card, .section-title, .produto-card, .instrucao-card"
    );

    if (!elementos.length) return;

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                }
            });
        },
        {
            threshold: 0.1
        }
    );

    elementos.forEach(elemento => observer.observe(elemento));
}

function inicializarLeitura() {
    const botao = document.getElementById("ler-site");

    if (!botao || !("speechSynthesis" in window)) return;

    let lendo = false;

    botao.addEventListener("click", () => {
        if (lendo) {
            window.speechSynthesis.cancel();
            lendo = false;
            botao.classList.remove("lendo");
            botao.innerHTML = '<i class="fas fa-volume-up"></i>';
            return;
        }

        const texto = document.body.innerText;

        if (!texto.trim()) return;

        const fala = new SpeechSynthesisUtterance(texto);

        fala.lang = "pt-BR";
        fala.rate = 0.9;
        fala.pitch = 1;
        fala.volume = 1;

        fala.onstart = () => {
            lendo = true;
            botao.classList.add("lendo");
            botao.innerHTML = '<i class="fas fa-stop"></i>';
        };

        fala.onend = () => {
            lendo = false;
            botao.classList.remove("lendo");
            botao.innerHTML = '<i class="fas fa-volume-up"></i>';
        };

        fala.onerror = () => {
            lendo = false;
            botao.classList.remove("lendo");
            botao.innerHTML = '<i class="fas fa-volume-up"></i>';
        };

        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(fala);
    });
}

function mostrarMensagem(mensagem, tipo = "info") {
    const antiga = document.querySelector(".mensagem-glidia");

    if (antiga) antiga.remove();

    const div = document.createElement("div");

    div.className = `mensagem-glidia ${tipo}`;
    div.textContent = mensagem;

    document.body.appendChild(div);

    setTimeout(() => {
        div.classList.add("mostrar");
    }, 10);

    setTimeout(() => {
        div.classList.remove("mostrar");

        setTimeout(() => {
            div.remove();
        }, 300);
    }, 4000);
}

async function fazerRequisicao(url, opcoes = {}) {
    try {
        const resposta = await fetch(url, {
            ...opcoes,
            headers: {
                "Content-Type": "application/json",
                ...(opcoes.headers || {})
            }
        });

        const texto = await resposta.text();

        let dados = {};

        if (texto) {
            try {
                dados = JSON.parse(texto);
            } catch {
                dados = {
                    mensagem: texto
                };
            }
        }

        if (!resposta.ok) {
            throw new Error(
                dados.mensagem ||
                dados.message ||
                `Erro do servidor: ${resposta.status}`
            );
        }

        return dados;
    } catch (erro) {
        console.error("Erro na requisição:", erro);

        if (
            erro.name === "TypeError" ||
            erro.message.toLowerCase().includes("failed to fetch")
        ) {
            throw new Error(
                "Não foi possível conectar ao servidor."
            );
        }

        throw erro;
    }
}

function inicializarLogin() {
    const formulario = document.getElementById("login-form");

    if (!formulario) return;

    formulario.addEventListener("submit", async evento => {
        evento.preventDefault();

        const emailInput =
            formulario.querySelector('input[type="email"]');

        const senhaInput =
            formulario.querySelector('input[type="password"]');

        if (!emailInput || !senhaInput) return;

        const email = emailInput.value.trim();
        const senha = senhaInput.value;

        if (!email || !senha) {
            mostrarMensagem(
                "Preencha todos os campos.",
                "erro"
            );
            return;
        }

        const botao =
            formulario.querySelector('button[type="submit"]');

        if (botao) {
            botao.disabled = true;
        }

        try {
            const dados = await fazerRequisicao(
                `${API_URL}/login`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        email,
                        senha
                    })
                }
            );

            if (dados.usuario) {
                localStorage.setItem(
                    "usuario",
                    JSON.stringify(dados.usuario)
                );
            }

            if (dados.token) {
                localStorage.setItem(
                    "token",
                    dados.token
                );
            }

            mostrarMensagem(
                dados.mensagem || "Login realizado com sucesso!",
                "sucesso"
            );

            setTimeout(() => {
                if (dados.redirect) {
                    window.location.href = dados.redirect;
                }
            }, 1000);

        } catch (erro) {
            mostrarMensagem(
                erro.message || "Erro ao realizar login.",
                "erro"
            );
        } finally {
            if (botao) {
                botao.disabled = false;
            }
        }
    });
}

function inicializarCadastro() {
    const formulario =
        document.getElementById("cadastro-form") ||
        document.getElementById("register-form");

    if (!formulario) return;

    formulario.addEventListener("submit", async evento => {
        evento.preventDefault();

        const inputs = formulario.querySelectorAll("input");

        const dadosFormulario = {};

        inputs.forEach(input => {
            if (input.name) {
                dadosFormulario[input.name] = input.value.trim();
            }
        });

        const nomeInput =
            formulario.querySelector(
                'input[name="nome"], input[name="name"]'
            );

        const emailInput =
            formulario.querySelector(
                'input[name="email"], input[type="email"]'
            );

        const senhaInput =
            formulario.querySelector(
                'input[name="senha"], input[name="password"]'
            );

        const nome = nomeInput
            ? nomeInput.value.trim()
            : "";

        const email = emailInput
            ? emailInput.value.trim()
            : "";

        const senha = senhaInput
            ? senhaInput.value
            : "";

        if (!nome || !email || !senha) {
            mostrarMensagem(
                "Preencha todos os campos.",
                "erro"
            );
            return;
        }

        const botao =
            formulario.querySelector('button[type="submit"]');

        if (botao) {
            botao.disabled = true;
        }

        try {
            const dados = await fazerRequisicao(
                `${API_URL}/cadastro`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        ...dadosFormulario,
                        nome,
                        email,
                        senha
                    })
                }
            );

            mostrarMensagem(
                dados.mensagem ||
                "Cadastro realizado com sucesso!",
                "sucesso"
            );

            formulario.reset();

        } catch (erro) {
            mostrarMensagem(
                erro.message || "Erro ao realizar cadastro.",
                "erro"
            );
        } finally {
            if (botao) {
                botao.disabled = false;
            }
        }
    });
}

function inicializarContato() {
    const formulario =
        document.getElementById("contato-form");

    if (!formulario) return;

    formulario.addEventListener("submit", async evento => {
        evento.preventDefault();

        const nomeInput =
            formulario.querySelector(
                'input[name="nome"], input[name="name"]'
            );

        const emailInput =
            formulario.querySelector(
                'input[name="email"], input[type="email"]'
            );

        const mensagemInput =
            formulario.querySelector(
                "textarea"
            );

        const nome = nomeInput
            ? nomeInput.value.trim()
            : "";

        const email = emailInput
            ? emailInput.value.trim()
            : "";

        const mensagem = mensagemInput
            ? mensagemInput.value.trim()
            : "";

        if (!nome || !email || !mensagem) {
            mostrarMensagem(
                "Preencha todos os campos.",
                "erro"
            );
            return;
        }

        const botao =
            formulario.querySelector('button[type="submit"]');

        if (botao) {
            botao.disabled = true;
        }

        try {
            const dados = await fazerRequisicao(
                `${API_URL}/contato`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        nome,
                        email,
                        mensagem
                    })
                }
            );

            mostrarMensagem(
                dados.mensagem ||
                "Mensagem enviada com sucesso!",
                "sucesso"
            );

            formulario.reset();

        } catch (erro) {
            mostrarMensagem(
                erro.message ||
                "Erro ao enviar mensagem.",
                "erro"
            );
        } finally {
            if (botao) {
                botao.disabled = false;
            }
        }
    });
}

function inicializarComandoVoz() {
    const botao =
        document.getElementById("comando-voz") ||
        document.getElementById("voice-command");

    const campo =
        document.getElementById("comando") ||
        document.getElementById("voice-text");

    if (!botao) return;

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        botao.addEventListener("click", () => {
            mostrarMensagem(
                "Seu navegador não possui suporte ao reconhecimento de voz.",
                "erro"
            );
        });

        return;
    }

    const reconhecimento = new SpeechRecognition();

    reconhecimento.lang = "pt-BR";
    reconhecimento.continuous = false;
    reconhecimento.interimResults = false;
    reconhecimento.maxAlternatives = 1;

    reconhecimento.onstart = () => {
        botao.classList.add("ouvindo");

        if (campo) {
            campo.placeholder = "Estou ouvindo...";
        }
    };

    reconhecimento.onresult = async evento => {
        const texto =
            evento.results[0][0].transcript;

        if (campo) {
            campo.value = texto;
        }

        try {
            const dados = await fazerRequisicao(
                `${API_URL}/comando`,
                {
                    method: "POST",
                    body: JSON.stringify({
                        comando: texto
                    })
                }
            );

            if (dados.resposta) {
                falarTexto(dados.resposta);
            }

            if (dados.mensagem) {
                mostrarMensagem(
                    dados.mensagem,
                    "sucesso"
                );
            }

        } catch (erro) {
            mostrarMensagem(
                erro.message ||
                "Não foi possível enviar o comando.",
                "erro"
            );
        }
    };

    reconhecimento.onerror = evento => {
        console.error(
            "Erro no reconhecimento de voz:",
            evento.error
        );

        mostrarMensagem(
            "Não foi possível reconhecer sua voz.",
            "erro"
        );
    };

    reconhecimento.onend = () => {
        botao.classList.remove("ouvindo");

        if (campo) {
            campo.placeholder =
                "Diga um comando...";
        }
    };

    botao.addEventListener("click", () => {
        try {
            reconhecimento.start();
        } catch {
            reconhecimento.stop();

            setTimeout(() => {
                reconhecimento.start();
            }, 300);
        }
    });
}

function falarTexto(texto) {
    if (!("speechSynthesis" in window)) return;

    window.speechSynthesis.cancel();

    const fala =
        new SpeechSynthesisUtterance(texto);

    fala.lang = "pt-BR";
    fala.rate = 0.9;
    fala.pitch = 1;
    fala.volume = 1;

    window.speechSynthesis.speak(fala);
}

function inicializarGPS() {
    const botoes =
        document.querySelectorAll(
            "[data-gps], #gps-btn, .gps-btn"
        );

    if (!botoes.length) return;

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const url =
                "https://www.google.com/maps/search/?api=1&query=Google+Maps";

            if (
                navigator.geolocation &&
                !botao.dataset.semLocalizacao
            ) {
                navigator.geolocation.getCurrentPosition(
                    posicao => {
                        const latitude =
                            posicao.coords.latitude;

                        const longitude =
                            posicao.coords.longitude;

                        const mapa =
                            `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

                        window.open(
                            mapa,
                            "_blank",
                            "noopener,noreferrer"
                        );
                    },
                    () => {
                        window.open(
                            url,
                            "_blank",
                            "noopener,noreferrer"
                        );
                    }
                );
            } else {
                window.open(
                    url,
                    "_blank",
                    "noopener,noreferrer"
                );
            }
        });
    });
}

function inicializarUber() {
    const botoes =
        document.querySelectorAll(
            "[data-uber], #uber-btn, .uber-btn"
        );

    if (!botoes.length) return;

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            const url =
                "https://m.uber.com/";

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );
        });
    });
}

function inicializarConfiguracoes() {
    const formulario =
        document.getElementById("config-form");

    if (!formulario) return;

    const campos =
        formulario.querySelectorAll(
            "input, select, textarea"
        );

    campos.forEach(campo => {
        const chave =
            `glidia_${campo.name || campo.id}`;

        const valorSalvo =
            localStorage.getItem(chave);

        if (
            valorSalvo !== null &&
            campo.type !== "checkbox"
        ) {
            campo.value = valorSalvo;
        }

        if (
            valorSalvo !== null &&
            campo.type === "checkbox"
        ) {
            campo.checked =
                valorSalvo === "true";
        }

        const salvar = () => {
            if (campo.type === "checkbox") {
                localStorage.setItem(
                    chave,
                    campo.checked
                );
            } else {
                localStorage.setItem(
                    chave,
                    campo.value
                );
            }
        };

        campo.addEventListener(
            "change",
            salvar
        );

        campo.addEventListener(
            "input",
            salvar
        );
    });
}

function inicializarLembretes() {
    const formulario =
        document.getElementById("lembrete-form");

    const lista =
        document.getElementById("lista-lembretes");

    if (!formulario || !lista) return;

    let lembretes =
        JSON.parse(
            localStorage.getItem(
                "glidia_lembretes"
            ) || "[]"
        );

    function renderizar() {
        lista.innerHTML = "";

        if (!lembretes.length) {
            lista.innerHTML =
                "<p>Nenhum lembrete cadastrado.</p>";

            return;
        }

        lembretes.forEach(
            (lembrete, index) => {
                const item =
                    document.createElement("div");

                item.className =
                    "lembrete-item";

                item.innerHTML = `
                    <div>
                        <strong>${escapeHTML(lembrete.titulo)}</strong>
                        <span>${escapeHTML(lembrete.data)}</span>
                    </div>
                    <button type="button" data-index="${index}">
                        <i class="fas fa-trash"></i>
                    </button>
                `;

                const remover =
                    item.querySelector("button");

                remover.addEventListener(
                    "click",
                    () => {
                        lembretes.splice(
                            index,
                            1
                        );

                        salvar();
                        renderizar();
                    }
                );

                lista.appendChild(item);
            }
        );
    }

    function salvar() {
        localStorage.setItem(
            "glidia_lembretes",
            JSON.stringify(lembretes)
        );
    }

    formulario.addEventListener(
        "submit",
        evento => {
            evento.preventDefault();

            const titulo =
                formulario.querySelector(
                    '[name="titulo"], [name="lembrete"]'
                );

            const data =
                formulario.querySelector(
                    '[name="data"], input[type="datetime-local"], input[type="date"]'
                );

            if (!titulo || !titulo.value.trim()) {
                mostrarMensagem(
                    "Digite um lembrete.",
                    "erro"
                );

                return;
            }

            lembretes.push({
                titulo: titulo.value.trim(),
                data: data
                    ? data.value
                    : ""
            });

            salvar();
            renderizar();
            formulario.reset();

            mostrarMensagem(
                "Lembrete adicionado!",
                "sucesso"
            );
        }
    );

    renderizar();
}

function inicializarLogout() {
    const botoes =
        document.querySelectorAll(
            "#logout, .logout, [data-logout]"
        );

    if (!botoes.length) return;

    botoes.forEach(botao => {
        botao.addEventListener("click", () => {
            localStorage.removeItem("usuario");
            localStorage.removeItem("token");

            mostrarMensagem(
                "Sessão encerrada.",
                "sucesso"
            );

            setTimeout(() => {
                window.location.href =
                    "index.html";
            }, 800);
        });
    });
}

function escapeHTML(texto) {
    const div =
        document.createElement("div");

    div.textContent =
        texto ?? "";

    return div.innerHTML;
}

function formatarTelefone(valor) {
    let numero =
        valor.replace(/\D/g, "");

    numero =
        numero.substring(0, 11);

    if (numero.length <= 2) {
        return `(${numero}`;
    }

    if (numero.length <= 7) {
        return `(${numero.substring(0, 2)}) ${numero.substring(2)}`;
    }

    return `(${numero.substring(0, 2)}) ${numero.substring(2, 7)}-${numero.substring(7, 11)}`;
}

document.addEventListener(
    "input",
    evento => {
        const elemento =
            evento.target;

        if (
            elemento.matches(
                'input[type="tel"], input[name="telefone"], input[name="phone"]'
            )
        ) {
            elemento.value =
                formatarTelefone(
                    elemento.value
                );
        }
    }
);

window.addEventListener(
    "beforeunload",
    () => {
        if ("speechSynthesis" in window) {
            window.speechSynthesis.cancel();
        }
    }
);