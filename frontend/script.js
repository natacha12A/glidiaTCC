const header = document.getElementById("header");

if (header) {
    window.addEventListener("scroll", () => {
        header.classList.toggle("header-scroll", window.scrollY > 40);
    });
}


const reveals = document.querySelectorAll(".reveal");

if (reveals.length) {

    const observer = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {
                entry.target.classList.add("active");
            }

        });

    }, {
        threshold: 0.2
    });

    reveals.forEach(item => observer.observe(item));

}


const heroImage = document.querySelector(".hero-image img");

if (heroImage) {

    window.addEventListener("mousemove", (e) => {

        const x = (window.innerWidth / 2 - e.clientX) / 60;
        const y = (window.innerHeight / 2 - e.clientY) / 60;

        heroImage.style.transform = `translate(${x}px, ${y}px)`;

    });

}


const themeBtn = document.getElementById("theme-toggle");
const images = document.querySelectorAll("img[data-light]");

if (themeBtn) {

    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");
        themeBtn.textContent = "☀️";

        images.forEach(img => {

            if (img.dataset.dark) {
                img.src = img.dataset.dark;
            }

        });

    }

    themeBtn.addEventListener("click", () => {

        document.body.classList.toggle("dark-mode");

        const dark = document.body.classList.contains("dark-mode");

        images.forEach(img => {

            if (dark && img.dataset.dark) {
                img.src = img.dataset.dark;
            } else if (img.dataset.light) {
                img.src = img.dataset.light;
            }

        });

        themeBtn.textContent = dark ? "☀️" : "🌙";

        localStorage.setItem("theme", dark ? "dark" : "light");

    });

}

const botao = document.getElementById("ler-site");

if (botao) {

    let lendo = false;

    botao.addEventListener("click", () => {

        if (!lendo) {

            const fala = new SpeechSynthesisUtterance(document.body.innerText);

            fala.lang = "pt-BR";
            fala.rate = 1;
            fala.pitch = 1;
            fala.volume = 1;

            fala.onend = () => {

                lendo = false;
                botao.classList.remove("lendo");
                botao.innerHTML = "🔊";

            };

            speechSynthesis.cancel();
            speechSynthesis.speak(fala);

            lendo = true;

            botao.classList.add("lendo");
            botao.innerHTML = "⏹";

        } else {

            speechSynthesis.cancel();

            lendo = false;

            botao.classList.remove("lendo");
            botao.innerHTML = "🔊";

        }

    });

}


const backBtn = document.getElementById("back-btn");

if (backBtn) {
    backBtn.addEventListener("click", () => {
        window.location.href = "index.html";
    });
}


const loginForm = document.querySelector(".login-card form");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");


if (togglePassword && passwordInput) {

    togglePassword.addEventListener("click", () => {

        const isPassword = passwordInput.type === "password";

        passwordInput.type = isPassword ? "text" : "password";

        togglePassword.innerHTML = isPassword
            ? '<i class="fa-regular fa-eye-slash"></i>'
            : '<i class="fa-regular fa-eye"></i>';

    });

}
if (loginForm) {

    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;

        console.log("Tentando login...");
        console.log({ email, senha });

        try {

            const resposta = await fetch("http://localhost:3000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    senha
                })
            });

            const dados = await resposta.json();

            console.log(dados);

            alert(dados.mensagem);

            if (resposta.ok) {

            localStorage.setItem("usuarioLogado", "true");

            localStorage.setItem("nomeUsuario", dados.usuario.nome);

            localStorage.setItem("emailUsuario", dados.usuario.email);

            window.location.href = "index.html";

        }

        } catch (erro) {

            console.error(erro);
            alert("Erro ao conectar ao servidor.");

        }

        
    });

}

const formContato = document.getElementById("contatoForm");

if (formContato) {

    formContato.addEventListener("submit", async (e) => {

        e.preventDefault();

        const dados = {
            nome: formContato.nome.value,
            email: formContato.email.value,
            assunto: formContato.assunto.value,
            mensagem: formContato.mensagem.value
        };

        try {

            const resposta = await fetch("http://localhost:3000/contato", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            const json = await resposta.json();

            alert(json.mensagem);

            if (resposta.ok) {
                formContato.reset();
            }

        } catch (erro) {

            console.log(erro);
            alert("Erro ao conectar com o servidor.");

        }

    });

}

const telefoneInput = document.getElementById("telefoneEmergencia");

if (telefoneInput) {

    telefoneInput.addEventListener("input", () => {

        let telefone = telefoneInput.value.replace(/\D/g, "");

        if (telefone.length > 11) {

            telefone = telefone.substring(0, 11);

        }

        if (telefone.length > 6) {

            telefone = telefone.replace(
                /^(\d{2})(\d{5})(\d{0,4}).*/,
                "($1) $2-$3"
            );

        } else if (telefone.length > 2) {

            telefone = telefone.replace(
                /^(\d{2})(\d+)/,
                "($1) $2"
            );

        }

        telefoneInput.value = telefone;

    });

}


const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async (e) => {

        e.preventDefault();

        const nome = document.getElementById("nome").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;
        const confirmar = document.getElementById("confirmPassword").value;
        const telefoneEmergencia = document.getElementById("telefoneEmergencia").value;

        if (senha !== confirmar) {

            alert("As senhas não coincidem.");
            return;

        }

        const cadastro = {

            nome: nome,
            email: email,
            senha: senha,
            telefone_emergencia: telefoneEmergencia

        };


        console.log("Dados enviados:", cadastro);


        try {

            const resposta = await fetch("http://localhost:3000/cadastro", {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(cadastro)

            });


            const dados = await resposta.json();

            console.log(dados);


            if (resposta.ok) {

                alert("Cadastro realizado com sucesso!");

                registerForm.reset();

            } else {

                alert(dados.mensagem || "Erro ao realizar cadastro.");

            }


        } catch (erro) {

            console.error("Erro:", erro);

            alert("Erro ao conectar ao servidor.");

        }

    });

}


const btnFuncionalidades = document.getElementById("btnFuncionalidades");

if (
    btnFuncionalidades &&
    localStorage.getItem("usuarioLogado") === "true"
) {
    btnFuncionalidades.style.display = "block";
}


const btnSair = document.getElementById("btnSair");

if (
    btnSair &&
    localStorage.getItem("usuarioLogado") === "true"
) {
    btnSair.style.display = "block";

    btnSair.addEventListener("click", (e) => {
        e.preventDefault();

        localStorage.removeItem("usuarioLogado");

        window.location.href = "login.html";
    });
}

const reminderList = document.querySelector(".reminder-list");
const novoLembreteBtn = document.querySelector(".dashboard-card .dashboard-btn");

let lembretes = JSON.parse(localStorage.getItem("lembretes")) || [];

function salvarLembretes() {
    localStorage.setItem("lembretes", JSON.stringify(lembretes));
}

function mostrarLembretes() {

    if (!reminderList) return;

    reminderList.innerHTML = "";

    if (lembretes.length === 0) {

        reminderList.innerHTML =
        `<p style="text-align:center;opacity:.7;">
            Nenhum lembrete cadastrado.
        </p>`;

        return;
    }

    lembretes.forEach((item, index) => {

        const div = document.createElement("div");
        div.className = "reminder";

        div.innerHTML = `
            <div>
                <strong>${item.titulo}</strong>
                <span>
                    <i class="fa-regular fa-calendar"></i>
                    ${item.data}
                </span>
            </div>

            <button data-id="${index}" class="remover-lembrete">
                <i class="fa-solid fa-trash"></i>
            </button>
        `;

        reminderList.appendChild(div);

    });

}

mostrarLembretes();

if (novoLembreteBtn) {

    novoLembreteBtn.addEventListener("click", () => {

        const titulo = prompt("Nome do lembrete:");

        if (!titulo) return;

        const data = prompt("Data e horário\nEx: 28/07/2026 - 19:00");

        if (!data) return;

        lembretes.push({
            titulo,
            data
        });

        salvarLembretes();
        mostrarLembretes();

    });

}

document.addEventListener("click", (e)=>{

    const btn = e.target.closest(".remover-lembrete");

    if(!btn) return;

    const id = btn.dataset.id;

    if(confirm("Excluir lembrete?")){

        lembretes.splice(id,1);

        salvarLembretes();

        mostrarLembretes();

    }

});

const switches = document.querySelectorAll(".settings-list input[type='checkbox']");

let configuracoes = JSON.parse(localStorage.getItem("configuracoes")) || {

    notificacoes:true,
    voz:true,
    tema:false

};

function salvarConfiguracoes(){

    localStorage.setItem(
        "configuracoes",
        JSON.stringify(configuracoes)
    );

}

const temaSwitch = switches[0];

if(temaSwitch){

    temaSwitch.checked = configuracoes.tema;

    if(configuracoes.tema){

        document.body.classList.add("dark-mode");

    }

    temaSwitch.addEventListener("change",()=>{

        configuracoes.tema = temaSwitch.checked;

        salvarConfiguracoes();

        document.body.classList.toggle(
            "dark-mode",
            configuracoes.tema
        );

        localStorage.setItem(
            "theme",
            configuracoes.tema ? "dark":"light"
        );

    });

}

const notificacoesItem = document.querySelectorAll(".setting-item")[1];

if(notificacoesItem){

    notificacoesItem.addEventListener("click",()=>{

        configuracoes.notificacoes =
        !configuracoes.notificacoes;

        salvarConfiguracoes();

        alert(
            configuracoes.notificacoes
            ? "Notificações ativadas."
            : "Notificações desativadas."
        );

    });

}

const perfil = document.querySelectorAll(".setting-item")[0];



const nomeSalvo = localStorage.getItem("nomeUsuario");

if(nomeSalvo){

    const span = document.querySelector(".profile-card h2 span");

    if(span){

        span.textContent = nomeSalvo;

    }

}

const idioma = document.querySelectorAll(".setting-item")[3];

if(idioma){

    idioma.addEventListener("click",()=>{

        alert("Em breve teremos mais idiomas.");

    });

}

const privacidade = document.querySelectorAll(".setting-item")[4];

if(privacidade){

    privacidade.addEventListener("click",()=>{

        if(confirm("Deseja apagar todos os dados desta página?")){

            localStorage.removeItem("lembretes");
            localStorage.removeItem("configuracoes");
            localStorage.removeItem("nomeUsuario");

            location.reload();

        }

    });

}

const salvar = document.getElementById("salvarConfig");

if(salvar){

    salvar.addEventListener("click",()=>{

        salvarConfiguracoes();

        alert("Configurações salvas com sucesso!");

    });

}



const spanNome = document.querySelector(".profile-card h2 span");

const nome = localStorage.getItem("nomeUsuario");

if (spanNome && nome) {
    spanNome.textContent = nome;
}

//A PARTIR DAQUI É SOBRE A IA ACRE//

let ouvindo = false;


// ==========================================
// STATUS
// ==========================================

function atualizarStatus(texto){

    const status = document.getElementById("status");

    if(status){
        status.innerHTML = texto;
    }

}



// ==========================================
// VOZ DA GLIDIA
// ==========================================

function glidiaFalar(texto, depois){

    // Garante que o reconhecimento pare antes da fala
    if(voz && ouvindo){

        try{

            voz.stop();

        }catch(e){

            console.log("Erro ao parar reconhecimento:", e);

        }

    }

    speechSynthesis.cancel();

    const fala = new SpeechSynthesisUtterance(texto);

    fala.lang = "pt-BR";
    fala.rate = 1;
    fala.pitch = 1;

    fala.onend = function(){

        // Pequena pausa para evitar que a Glidia
        // reconheça a própria voz
        setTimeout(()=>{

            if(depois){
                depois();
            }

        },500);

    };

    speechSynthesis.speak(fala);

}




// ==========================================
// RECONHECIMENTO DE VOZ
// ==========================================

const ReconhecimentoVoz =
window.SpeechRecognition ||
window.webkitSpeechRecognition;


let voz = null;



if(ReconhecimentoVoz){

    voz = new ReconhecimentoVoz();

    voz.lang = "pt-BR";
    voz.continuous = false;
    voz.interimResults = false;
    voz.maxAlternatives = 1;



    voz.onstart = function(){

        ouvindo = true;

        atualizarStatus(
            "🎤 Estou ouvindo..."
        );

    };



    voz.onend = function(){

        ouvindo = false;

    };



    voz.onerror = function(erro){

        console.log(
            "Erro voz:",
            erro
        );

        ouvindo = false;

        atualizarStatus(
            "❌ Não consegui ouvir"
        );

    };
    // ==========================================
// RESULTADO DO RECONHECIMENTO DE VOZ
// ==========================================

voz.onresult = function(event){

    let comando = event.results[0][0]
        .transcript
        .toLowerCase()
        .trim();

    console.log(
        "Reconhecido:",
        comando
    );


    // ==========================================
    // IGNORAR A PRÓPRIA VOZ DA GLIDIA
    // ==========================================

    const frasesDaGlidia = [

        "olá",
        "ola",
        "como posso te ajudar",
        "você quer que eu abra",
        "voce quer que eu abra",
        "abrindo uber",
        "abrindo o uber",
        "abrindo gps",
        "abrindo o gps",
        "uber cancelado",
        "gps cancelado",
        "pronto",
        "não consegui conectar",
        "nao consegui conectar"

    ];


    const falouAGlidia = frasesDaGlidia.some(frase =>
        comando.includes(frase)
    );


    if(falouAGlidia){

        console.log(
            "Ignorando fala da Glidia:",
            comando
        );

        iniciarEscuta();

        return;

    }


    // ==========================================
    // FILTRO DE RUÍDOS
    // ==========================================

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


    if(

        palavrasSemSentido.includes(comando) ||

        comando.length < 2

    ){

        atualizarStatus(
            "🎤 Não entendi. Pode repetir?"
        );

        iniciarEscuta();

        return;

    }


    // ==========================================
    // STATUS
    // ==========================================

    atualizarStatus(
        "🤖 Entendi: " + comando
    );


    // ==========================================
    // ENVIA PARA O BACKEND
    // ==========================================

    enviarComando(comando);

};
// ==========================================
// BOTÃO DA BENGALA
// ==========================================

function botaoBengala(){

    iniciarGlidia();

}



// ==========================================
// INICIAR GLIDIA
// ==========================================

function iniciarGlidia(){

    atualizarStatus(
        "🟢 Glidia ativada"
    );

    glidiaFalar(

        "Olá! Como posso te ajudar?",

        function(){

            iniciarEscuta();

        }

    );

}



// ==========================================
// COMEÇAR ESCUTA
// ==========================================

function iniciarEscuta(){

    if(!voz){

        glidiaFalar(
            "Seu navegador não suporta reconhecimento de voz."
        );

        return;

    }

    if(ouvindo){

        return;

    }

    try{

        voz.start();

    }catch(e){

        console.log(
            "Erro ao iniciar reconhecimento:",
            e
        );

    }

}
// ==========================================
// ENVIA PARA BACKEND
// ==========================================

async function enviarComando(comando){

    try{

        const resposta = await fetch(
            "http://localhost:3000/comando",
            {

                method:"POST",

                headers:{

                    "Content-Type":"application/json"

                },

                body:JSON.stringify({

                    comando: comando

                })

            }

        );


        // ===============================
        // VERIFICA SE O SERVIDOR RESPONDEU
        // ===============================

        if(!resposta.ok){

            throw new Error(

                "Erro HTTP: " +

                resposta.status

            );

        }


        const dados = await resposta.json();


        console.log(

            "Servidor respondeu:",

            dados

        );


        // ===============================
        // RECEBEU UMA RESPOSTA
        // ===============================

        if(dados.resposta){

            atualizarStatus(

                "🤖 " + dados.resposta

            );

            glidiaFalar(

                dados.resposta,

                function(){

                    iniciarEscuta();

                }

            );

            return;

        }


        // ===============================
        // NÃO VEIO RESPOSTA
        // ===============================

        atualizarStatus(

            "❌ Resposta inválida"

        );

        glidiaFalar(

            "O sistema não retornou uma resposta.",

            function(){

                iniciarEscuta();

            }

        );

    }

    catch(erro){

        console.log(

            "Erro ao conectar com Glidia:",

            erro

        );


        atualizarStatus(

            "❌ Erro de conexão"

        );


        glidiaFalar(

            "Não consegui conectar ao sistema.",

            function(){

                iniciarEscuta();

            }

        );

    }

}}