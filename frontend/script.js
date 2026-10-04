// ============================================================
// GLÍDIA - JAVASCRIPT PRINCIPAL
// ============================================================

// ============================================================
// CONFIGURAÇÃO DA API
// ============================================================

const API_URL = "https://glidia-backend.vercel.app";


// ============================================================
// HEADER
// ============================================================

const header = document.getElementById("header");

if (header) {

    window.addEventListener("scroll", () => {

        header.classList.toggle(
            "header-scroll",
            window.scrollY > 40
        );

    });
}


// ============================================================
// ANIMAÇÕES REVEAL
// ============================================================

const reveals = document.querySelectorAll(".reveal");

if (reveals.length > 0) {

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach((entry) => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("active");

                }

            });

        },

        {
            threshold: 0.2
        }

    );

    reveals.forEach((item) => {

        observer.observe(item);

    });
}


// ============================================================
// MOVIMENTO DA IMAGEM DO HERO
// ============================================================

const heroImage =
    document.querySelector(".hero-image img");

if (heroImage) {

    window.addEventListener("mousemove", (e) => {

        const x =
            (window.innerWidth / 2 - e.clientX) / 60;

        const y =
            (window.innerHeight / 2 - e.clientY) / 60;

        heroImage.style.transform =
            `translate(${x}px, ${y}px)`;

    });
}


// ============================================================
// TEMA
// ============================================================

const themeBtn =
    document.getElementById("theme-toggle");

const images =
    document.querySelectorAll("img[data-light]");


// ============================================================
// APLICAR TEMA
// ============================================================

function aplicarTema(tema) {

    const dark =
        tema === "dark";

    document.body.classList.toggle(
        "dark-mode",
        dark
    );


    if (themeBtn) {

        themeBtn.classList.toggle(
            "fa-moon",
            !dark
        );

        themeBtn.classList.toggle(
            "fa-sun",
            dark
        );

    }


    images.forEach((img) => {

        if (dark && img.dataset.dark) {

            img.src = img.dataset.dark;

        } else if (!dark && img.dataset.light) {

            img.src = img.dataset.light;

        }

    });

}


// ============================================================
// CARREGAR TEMA SALVO
// ============================================================

const savedTheme =
    localStorage.getItem("theme") || "light";

aplicarTema(savedTheme);


// ============================================================
// BOTÃO DE TEMA
// ============================================================

if (themeBtn) {

    themeBtn.addEventListener("click", () => {

        const dark =
            document.body.classList.contains("dark-mode");

        const novoTema =
            dark ? "light" : "dark";

        aplicarTema(novoTema);

        localStorage.setItem(
            "theme",
            novoTema
        );

    });

}


// ============================================================
// LEITOR DE SITE
// ============================================================

const botao =
    document.getElementById("ler-site");

if (botao) {

    let lendo = false;


    botao.addEventListener("click", () => {

        // Verificar suporte
        if (
            !("speechSynthesis" in window) ||
            !("SpeechSynthesisUtterance" in window)
        ) {

            alert(
                "Seu navegador não suporta leitura de voz."
            );

            return;

        }


        // ----------------------------------------------------
        // PARAR LEITURA
        // ----------------------------------------------------

        if (lendo) {

            speechSynthesis.cancel();

            lendo = false;

            botao.classList.remove("lendo");
            botao.classList.remove("fa-stop");
            botao.classList.add("fa-volume-high");

            return;
        }


        // ----------------------------------------------------
        // INICIAR LEITURA
        // ----------------------------------------------------

        const texto =
            document.body.innerText.trim();


        if (!texto) {

            return;

        }


        const fala =
            new SpeechSynthesisUtterance(texto);


        fala.lang = "pt-BR";
        fala.rate = 1;
        fala.pitch = 1;
        fala.volume = 1;


        fala.onend = () => {

            lendo = false;

            botao.classList.remove("lendo");
            botao.classList.remove("fa-stop");
            botao.classList.add("fa-volume-high");

        };


        fala.onerror = () => {

            lendo = false;

            botao.classList.remove("lendo");
            botao.classList.remove("fa-stop");
            botao.classList.add("fa-volume-high");

        };


        speechSynthesis.cancel();

        speechSynthesis.speak(fala);

        lendo = true;

        botao.classList.add("lendo");
        botao.classList.remove("fa-volume-high");
        botao.classList.add("fa-stop");

    });

}


// ============================================================
// BOTÃO VOLTAR
// ============================================================

const backBtn =
    document.getElementById("back-btn");

if (backBtn) {

    backBtn.addEventListener("click", () => {

        window.location.href = "index.html";

    });

}


// ============================================================
// MOSTRAR / OCULTAR SENHA
// ============================================================

const passwordInput =
    document.getElementById("password");

const togglePassword =
    document.getElementById("togglePassword");

if (
    togglePassword &&
    passwordInput
) {

    togglePassword.addEventListener(
        "click",
        () => {

            const isPassword =
                passwordInput.type === "password";


            passwordInput.type =
                isPassword
                    ? "text"
                    : "password";


            togglePassword.innerHTML =
                isPassword
                    ? '<i class="fa-regular fa-eye-slash"></i>'
                    : '<i class="fa-regular fa-eye"></i>';

        }
    );

}


// ============================================================
// LOGIN
// ============================================================

const loginForm =
    document.querySelector(".login-card form");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const emailElement =
                document.getElementById("email");

            const senhaElement =
                document.getElementById("password");


            if (
                !emailElement ||
                !senhaElement
            ) {

                alert(
                    "Não foi possível encontrar os campos de login."
                );

                return;

            }


            const email =
                emailElement.value.trim();

            const senha =
                senhaElement.value;


            if (!email || !senha) {

                alert(
                    "Preencha o e-mail e a senha."
                );

                return;

            }


            console.log(
                "Tentando login..."
            );


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                email,
                                senha
                            })
                        }
                    );


                const dados =
                    await resposta.json();


                console.log(
                    "Resposta do login:",
                    dados
                );


                alert(
                    dados.mensagem ||
                    "Resposta recebida."
                );


                if (
                    resposta.ok &&
                    dados.usuario
                ) {

                    localStorage.setItem(
                        "usuarioLogado",
                        "true"
                    );


                    localStorage.setItem(
                        "nomeUsuario",
                        dados.usuario.nome || ""
                    );


                    localStorage.setItem(
                        "emailUsuario",
                        dados.usuario.email || ""
                    );


                    window.location.href =
                        "index.html";

                }

            } catch (erro) {

                console.error(
                    "Erro no login:",
                    erro
                );


                alert(
                    "Erro ao conectar ao servidor."
                );

            }

        }
    );

}


// ============================================================
// FORMULÁRIO DE CONTATO
// ============================================================

const formContato =
    document.getElementById("contatoForm");

if (formContato) {

    formContato.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const nome =
                formContato.elements["nome"]?.value.trim();

            const email =
                formContato.elements["email"]?.value.trim();

            const assunto =
                formContato.elements["assunto"]?.value.trim();

            const mensagem =
                formContato.elements["mensagem"]?.value.trim();


            if (
                !nome ||
                !email ||
                !assunto ||
                !mensagem
            ) {

                alert(
                    "Preencha todos os campos."
                );

                return;

            }


            const dados = {
                nome,
                email,
                assunto,
                mensagem
            };


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/contato`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(dados)
                        }
                    );


                const json =
                    await resposta.json();


                alert(
                    json.mensagem ||
                    "Mensagem processada."
                );


                if (resposta.ok) {

                    formContato.reset();

                }

            } catch (erro) {

                console.error(
                    "Erro no contato:",
                    erro
                );


                alert(
                    "Erro ao conectar com o servidor."
                );

            }

        }
    );

}


// ============================================================
// TELEFONE DE EMERGÊNCIA
// ============================================================

const telefoneInput =
    document.getElementById(
        "telefoneEmergencia"
    );

if (telefoneInput) {

    telefoneInput.addEventListener(
        "input",
        () => {

            let telefone =
                telefoneInput.value
                    .replace(/\D/g, "");


            if (telefone.length > 11) {

                telefone =
                    telefone.substring(
                        0,
                        11
                    );

            }


            if (telefone.length > 6) {

                telefone =
                    telefone.replace(
                        /^(\d{2})(\d{5})(\d{0,4}).*/,
                        "($1) $2-$3"
                    );

            } else if (
                telefone.length > 2
            ) {

                telefone =
                    telefone.replace(
                        /^(\d{2})(\d+)/,
                        "($1) $2"
                    );

            }


            telefoneInput.value =
                telefone;

        }
    );

}


// ============================================================
// CADASTRO
// ============================================================

const registerForm =
    document.getElementById(
        "registerForm"
    );

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const nomeElement =
                document.getElementById("nome");

            const emailElement =
                document.getElementById("email");

            const senhaElement =
                document.getElementById("password");

            const confirmarElement =
                document.getElementById(
                    "confirmPassword"
                );

            const telefoneElement =
                document.getElementById(
                    "telefoneEmergencia"
                );


            if (
                !nomeElement ||
                !emailElement ||
                !senhaElement ||
                !confirmarElement ||
                !telefoneElement
            ) {

                alert(
                    "Não foi possível encontrar todos os campos do cadastro."
                );

                return;

            }


            const nome =
                nomeElement.value.trim();

            const email =
                emailElement.value.trim();

            const senha =
                senhaElement.value;

            const confirmar =
                confirmarElement.value;

            const telefoneEmergencia =
                telefoneElement.value.trim();


            if (
                !nome ||
                !email ||
                !senha ||
                !confirmar ||
                !telefoneEmergencia
            ) {

                alert(
                    "Preencha todos os campos."
                );

                return;

            }


            if (senha !== confirmar) {

                alert(
                    "As senhas não coincidem."
                );

                return;

            }


            const cadastro = {

                nome,

                email,

                senha,

                telefone_emergencia:
                    telefoneEmergencia

            };


            console.log(
                "Dados enviados:",
                {
                    nome,
                    email,
                    telefone_emergencia:
                        telefoneEmergencia
                }
            );


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/cadastro`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(
                                    cadastro
                                )
                        }
                    );


                const dados =
                    await resposta.json();


                console.log(
                    "Resposta cadastro:",
                    dados
                );


                if (resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Cadastro realizado com sucesso!"
                    );


                    registerForm.reset();

                } else {

                    alert(
                        dados.mensagem ||
                        "Erro ao realizar cadastro."
                    );

                }

            } catch (erro) {

                console.error(
                    "Erro no cadastro:",
                    erro
                );


                alert(
                    "Erro ao conectar ao servidor."
                );

            }

        }
    );

}


// ============================================================
// BOTÃO FUNCIONALIDADES
// ============================================================

const btnFuncionalidades =
    document.getElementById(
        "btnFuncionalidades"
    );

const usuarioLogado =
    localStorage.getItem(
        "usuarioLogado"
    ) === "true";


if (
    btnFuncionalidades &&
    usuarioLogado
) {

    btnFuncionalidades.style.display =
        "block";

}


// ============================================================
// BOTÃO SAIR
// ============================================================

const btnSair =
    document.getElementById("btnSair");

if (btnSair) {

    if (usuarioLogado) {

        btnSair.style.display =
            "block";

    }


    btnSair.addEventListener(
        "click",
        (e) => {

            e.preventDefault();


            localStorage.removeItem(
                "usuarioLogado"
            );

            localStorage.removeItem(
                "nomeUsuario"
            );

            localStorage.removeItem(
                "emailUsuario"
            );


            window.location.href =
                "login.html";

        }
    );

}


// ============================================================
// LEMBRETES
// ============================================================

const reminderList =
    document.querySelector(
        ".reminder-list"
    );

const novoLembreteBtn =
    document.querySelector(
        ".dashboard-card .dashboard-btn"
    );


let lembretes = [];

try {

    lembretes =
        JSON.parse(
            localStorage.getItem(
                "lembretes"
            )
        ) || [];

    if (!Array.isArray(lembretes)) {

        lembretes = [];

    }

} catch (erro) {

    console.error(
        "Erro ao carregar lembretes:",
        erro
    );

    lembretes = [];

}


// ============================================================
// SALVAR LEMBRETES
// ============================================================

function salvarLembretes() {

    localStorage.setItem(
        "lembretes",
        JSON.stringify(lembretes)
    );

}


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHTML(texto) {

    const div =
        document.createElement("div");

    div.textContent =
        String(texto);

    return div.innerHTML;

}


// ============================================================
// MOSTRAR LEMBRETES
// ============================================================

function mostrarLembretes() {

    if (!reminderList) {

        return;

    }


    reminderList.innerHTML = "";


    if (lembretes.length === 0) {

        reminderList.innerHTML = `
            <p style="text-align:center;opacity:.7;">
                Nenhum lembrete cadastrado.
            </p>
        `;

        return;

    }


    lembretes.forEach(
        (item, index) => {

            const div =
                document.createElement(
                    "div"
                );


            div.className =
                "reminder";


            div.innerHTML = `

                <div>

                    <strong>
                        ${escaparHTML(
                            item.titulo || ""
                        )}
                    </strong>

                    <span>

                        <i class="fa-regular fa-calendar"></i>

                        ${escaparHTML(
                            item.data || ""
                        )}

                    </span>

                </div>

                <button
                    type="button"
                    data-id="${index}"
                    class="remover-lembrete"
                    aria-label="Excluir lembrete"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            `;


            reminderList.appendChild(
                div
            );

        }
    );

}


mostrarLembretes();


// ============================================================
// NOVO LEMBRETE
// ============================================================

if (novoLembreteBtn) {

    novoLembreteBtn.addEventListener(
        "click",
        () => {

            const titulo =
                prompt(
                    "Nome do lembrete:"
                );


            if (!titulo) {

                return;

            }


            const data =
                prompt(
                    "Data e horário\nEx: 28/07/2026 - 19:00"
                );


            if (!data) {

                return;

            }


            lembretes.push({

                titulo:
                    titulo.trim(),

                data:
                    data.trim()

            });


            salvarLembretes();

            mostrarLembretes();

        }
    );

}


// ============================================================
// EXCLUIR LEMBRETE
// ============================================================

document.addEventListener(
    "click",
    (e) => {

        const btn =
            e.target.closest(
                ".remover-lembrete"
            );


        if (!btn) {

            return;

        }


        const id =
            Number(btn.dataset.id);


        if (
            Number.isNaN(id) ||
            id < 0 ||
            id >= lembretes.length
        ) {

            return;

        }


        if (
            confirm(
                "Excluir lembrete?"
            )
        ) {

            lembretes.splice(
                id,
                1
            );

            salvarLembretes();

            mostrarLembretes();

        }

    }
);


// ============================================================
// CONFIGURAÇÕES
// ============================================================

const switches =
    document.querySelectorAll(
        ".settings-list input[type='checkbox']"
    );


let configuracoes = {

    notificacoes: true,

    voz: true,

    tema: false

};


try {

    const configuracoesSalvas =
        JSON.parse(
            localStorage.getItem(
                "configuracoes"
            )
        );


    if (
        configuracoesSalvas &&
        typeof configuracoesSalvas === "object"
    ) {

        configuracoes = {
            ...configuracoes,
            ...configuracoesSalvas
        };

    }

} catch (erro) {

    console.error(
        "Erro ao carregar configurações:",
        erro
    );

}


// ============================================================
// SALVAR CONFIGURAÇÕES
// ============================================================

function salvarConfiguracoes() {

    localStorage.setItem(
        "configuracoes",
        JSON.stringify(
            configuracoes
        )
    );

}


// ============================================================
// TEMA NAS CONFIGURAÇÕES
// ============================================================

const temaSwitch =
    switches[0];

if (temaSwitch) {

    temaSwitch.checked =
        document.body.classList.contains(
            "dark-mode"
        );


    temaSwitch.addEventListener(
        "change",
        () => {

            configuracoes.tema =
                temaSwitch.checked;


            salvarConfiguracoes();


            document.body.classList.toggle(
                "dark-mode",
                configuracoes.tema
            );


            localStorage.setItem(
                "theme",
                configuracoes.tema
                    ? "dark"
                    : "light"
            );

        }
    );

}


// ============================================================
// NOTIFICAÇÕES
// ============================================================

const notificacoesSwitch =
    switches[1];

if (notificacoesSwitch) {

    notificacoesSwitch.checked =
        configuracoes.notificacoes;


    notificacoesSwitch.addEventListener(
        "change",
        () => {

            configuracoes.notificacoes =
                notificacoesSwitch.checked;


            salvarConfiguracoes();

        }
    );

}


// ============================================================
// VOZ
// ============================================================

const vozSwitch =
    switches[2];

if (vozSwitch) {

    vozSwitch.checked =
        configuracoes.voz;


    vozSwitch.addEventListener(
        "change",
        () => {

            configuracoes.voz =
                vozSwitch.checked;


            salvarConfiguracoes();

        }
    );

}


// ============================================================
// IDIOMA
// ============================================================

const idiomaItem =
    document.querySelector(
        ".setting-item[data-setting='idioma']"
    );


if (idiomaItem) {

    idiomaItem.addEventListener(
        "click",
        () => {

            alert(
                "Em breve teremos mais idiomas."
            );

        }
    );

}


// ============================================================
// PRIVACIDADE
// ============================================================

const privacidadeItem =
    document.querySelector(
        ".setting-item[data-setting='privacidade']"
    );


if (privacidadeItem) {

    privacidadeItem.addEventListener(
        "click",
        () => {

            if (
                confirm(
                    "Deseja apagar todos os dados desta página?"
                )
            ) {

                localStorage.removeItem(
                    "lembretes"
                );

                localStorage.removeItem(
                    "configuracoes"
                );

                localStorage.removeItem(
                    "nomeUsuario"
                );

                localStorage.removeItem(
                    "emailUsuario"
                );

                localStorage.removeItem(
                    "usuarioLogado"
                );


                location.reload();

            }

        }
    );

}


// ============================================================
// SALVAR CONFIGURAÇÕES
// ============================================================

const salvar =
    document.getElementById(
        "salvarConfig"
    );


if (salvar) {

    salvar.addEventListener(
        "click",
        () => {

            salvarConfiguracoes();

            alert(
                "Configurações salvas com sucesso!"
            );

        }
    );

}


// ============================================================
// NOME DO USUÁRIO
// ============================================================

const nomeSalvo =
    localStorage.getItem(
        "nomeUsuario"
    );


if (nomeSalvo) {

    const spansNome =
        document.querySelectorAll(
            ".profile-card h2 span"
        );


    spansNome.forEach(
        (span) => {

            span.textContent =
                nomeSalvo;

        }
    );

}


// ============================================================
// MENU EXTRA
// ============================================================

const btnExtraNav =
    document.getElementById(
        "btn-extra-nav"
    );

const extraNav =
    document.getElementById(
        "extra-nav"
    );


if (
    btnExtraNav &&
    extraNav
) {

    btnExtraNav.addEventListener(
        "click",
        (e) => {

            e.preventDefault();

            extraNav.classList.toggle(
                "open"
            );

        }
    );

}


// ============================================================
// GLÍDIA - VOZ
// ============================================================

let ouvindo = false;

let glidiaFalando = false;

let voz = null;


// ============================================================
// STATUS
// ============================================================

function atualizarStatus(texto) {

    const status =
        document.getElementById(
            "status"
        );


    if (status) {

        status.textContent =
            texto;

    }

}


// ============================================================
// FALAR
// ============================================================

function glidiaFalar(
    texto,
    depois = null
) {

    if (
        !("speechSynthesis" in window)
    ) {

        if (depois) {

            depois();

        }

        return;

    }


    glidiaFalando = true;


    if (
        voz &&
        ouvindo
    ) {

        try {

            voz.stop();

        } catch (e) {

            console.log(
                "Erro ao parar reconhecimento:",
                e
            );

        }

    }


    ouvindo = false;


    speechSynthesis.cancel();


    const fala =
        new SpeechSynthesisUtterance(
            texto
        );


    fala.lang =
        "pt-BR";

    fala.rate =
        1;

    fala.pitch =
        1;

    fala.volume =
        1;


    fala.onend = () => {

        glidiaFalando =
            false;


        if (depois) {

            depois();

        }

    };


    fala.onerror = () => {

        glidiaFalando =
            false;


        if (depois) {

            depois();

        }

    };


    speechSynthesis.speak(
        fala
    );

}


// ============================================================
// RECONHECIMENTO DE VOZ
// ============================================================

const ReconhecimentoVoz =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;


if (ReconhecimentoVoz) {

    voz =
        new ReconhecimentoVoz();


    voz.lang =
        "pt-BR";


    voz.continuous =
        false;


    voz.interimResults =
        false;


    voz.maxAlternatives =
        1;


    voz.onstart = () => {

        ouvindo =
            true;


        atualizarStatus(
            "🎤 Estou ouvindo..."
        );

    };


    voz.onend = () => {

        ouvindo =
            false;

    };


    voz.onerror = (erro) => {

        console.log(
            "Erro voz:",
            erro
        );


        ouvindo =
            false;


        if (
            erro.error ===
            "no-speech"
        ) {

            atualizarStatus(
                "Pressione o botão para falar novamente."
            );

            return;

        }


        if (
            erro.error ===
            "not-allowed"
        ) {

            atualizarStatus(
                "Permissão do microfone bloqueada."
            );

            return;

        }


        if (
            erro.error ===
            "audio-capture"
        ) {

            atualizarStatus(
                "Nenhum microfone foi encontrado."
            );

            return;

        }


        atualizarStatus(
            "Não foi possível ouvir. Pressione o botão para tentar novamente."
        );

    };


    voz.onresult = (event) => {

        let comando =
            event.results[0][0]
                .transcript
                .toLowerCase()
                .trim();


        console.log(
            "Reconhecido:",
            comando
        );


        if (glidiaFalando) {

            return;

        }


        const palavrasSemSentido = [

            "",

            "hã",

            "hum",

            "aham",

            "é",

            "eh",

            "lalala",

            "la la la",

            "música",

            "musica",

            "milímetro",

            "milimetro"

        ];


        if (
            palavrasSemSentido.includes(
                comando
            ) ||
            comando.length < 2
        ) {

            atualizarStatus(
                "Pressione o botão para falar novamente."
            );

            return;

        }


        atualizarStatus(
            "🤖 Entendi: " +
            comando
        );


        processarComando(
            comando
        );

    };

}


// ============================================================
// BOTÃO DA GLÍDIA
// ============================================================

function botaoBengala() {

    iniciarGlidia();

}


// ============================================================
// INICIAR GLÍDIA
// ============================================================

function iniciarGlidia() {

    if (
        glidiaFalando ||
        ouvindo
    ) {

        return;

    }


    atualizarStatus(
        "🟢 Glídia ativada"
    );


    glidiaFalar(

        "Olá! Como posso te ajudar?",

        () => {

            iniciarEscuta();

        }

    );

}


// ============================================================
// INICIAR ESCUTA
// ============================================================

function iniciarEscuta() {

    if (!voz) {

        atualizarStatus(
            "Seu navegador não suporta reconhecimento de voz."
        );

        return;

    }


    if (glidiaFalando) {

        return;

    }


    if (ouvindo) {

        return;

    }


    try {

        voz.start();

    } catch (e) {

        console.log(
            "Erro ao iniciar reconhecimento:",
            e
        );

    }

}


// ============================================================
// PROCESSAR COMANDO
// ============================================================

function processarComando(
    comando
) {

    const texto =
        comando
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );


    // --------------------------------------------------------
    // GPS
    // --------------------------------------------------------

    if (

        texto.includes("gps") ||

        texto.includes("mapa") ||

        texto.includes("google maps") ||

        texto.includes("localizacao") ||

        texto.includes("navegacao")

    ) {

        abrirGPS();

        return;

    }


    // --------------------------------------------------------
    // UBER
    // --------------------------------------------------------

    if (

        texto.includes("uber") ||

        texto.includes("chamar um carro") ||

        texto.includes("chamar carro") ||

        texto.includes("quero um carro")

    ) {

        abrirUber();

        return;

    }


    // --------------------------------------------------------
    // OUTROS COMANDOS
    // --------------------------------------------------------

    enviarComando(
        comando
    );

}


// ============================================================
// ABRIR GPS
// ============================================================

function abrirGPS() {

    const url =
        "https://www.google.com/maps/search/?api=1&query=Google+Maps";


    atualizarStatus(
        "📍 Abrindo GPS..."
    );


    glidiaFalar(

        "Abrindo o GPS.",

        () => {

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        }

    );

}


// ============================================================
// ABRIR UBER
// ============================================================

function abrirUber() {

    const url =
        "https://m.uber.com/";


    atualizarStatus(
        "🚖 Abrindo Uber..."
    );


    glidiaFalar(

        "Abrindo o Uber.",

        () => {

            window.open(
                url,
                "_blank",
                "noopener,noreferrer"
            );

        }

    );

}


// ============================================================
// ENVIAR COMANDO PARA O BACKEND
// ============================================================

async function enviarComando(
    comando
) {

    try {

        const resposta =
            await fetch(
                `${API_URL}/comando`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        comando
                    })
                }
            );


        if (!resposta.ok) {

            throw new Error(
                `Erro HTTP: ${resposta.status}`
            );

        }


        const dados =
            await resposta.json();


        console.log(
            "Servidor respondeu:",
            dados
        );


        if (
            dados.resposta
        ) {

            atualizarStatus(
                "🤖 " +
                dados.resposta
            );


            glidiaFalar(
                dados.resposta
            );


            // ----------------------------------------------
            // Se o backend retornar uma URL
            // ----------------------------------------------

            if (dados.url) {

                setTimeout(() => {

                    window.open(
                        dados.url,
                        "_blank",
                        "noopener,noreferrer"
                    );

                }, 500);

            }


            return;

        }


        atualizarStatus(
            "Resposta inválida."
        );

    } catch (erro) {

        console.error(
            "Erro ao conectar com Glídia:",
            erro
        );


        atualizarStatus(
            "Erro de conexão com o sistema."
        );


        glidiaFalar(
            "Não consegui conectar ao sistema."
        );

    }

}
