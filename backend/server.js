
// ============================================================
// GLÍDIA - BACKEND
// ============================================================

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();


// ============================================================
// CONFIGURAÇÃO DO EXPRESS
// ============================================================

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// ============================================================
// PORTA
// ============================================================

const PORT = process.env.PORT || 3000;


// ============================================================
// CONEXÃO COM MYSQL
// ============================================================

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});


// ============================================================
// TESTAR CONEXÃO COM O BANCO
// ============================================================

connection.connect((err) => {

    if (err) {

        console.error("=================================");
        console.error("ERRO AO CONECTAR NO BANCO");
        console.error("=================================");
        console.error(err);

        return;
    }

    console.log("=================================");
    console.log("BANCO CONECTADO!");
    console.log("=================================");
});


// ============================================================
// CONFIGURAÇÃO DO NODEMAILER
// ============================================================

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",

    port: 465,

    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


// ============================================================
// TESTAR SMTP
// ============================================================

transporter.verify((erro) => {

    if (erro) {

        console.error("=================================");
        console.error("ERRO SMTP");
        console.error("=================================");
        console.error(erro);

    } else {

        console.log("=================================");
        console.log("SMTP CONECTADO!");
        console.log("=================================");
    }
});


// ============================================================
// ROTA PRINCIPAL
// ============================================================

app.get("/", (req, res) => {

    res.status(200).json({
        sucesso: true,
        mensagem: "API da Glídia funcionando corretamente!",
        status: "online"
    });
});


// ============================================================
// ROTA DE TESTE
// ============================================================

app.get("/teste", (req, res) => {

    res.status(200).json({
        sucesso: true,
        mensagem: "Servidor funcionando corretamente!"
    });
});


// ============================================================
// CONTATO
// ============================================================

app.post("/contato", (req, res) => {

    console.log("");
    console.log("=================================");
    console.log("NOVA MENSAGEM DE CONTATO");
    console.log("=================================");

    console.log(req.body);


    const {
        nome,
        email,
        assunto,
        mensagem
    } = req.body;


    // --------------------------------------------------------
    // VALIDAR CAMPOS
    // --------------------------------------------------------

    if (
        !nome ||
        !email ||
        !assunto ||
        !mensagem
    ) {

        return res.status(400).json({

            sucesso: false,

            mensagem: "Preencha todos os campos."
        });
    }


    // --------------------------------------------------------
    // VALIDAR E-MAIL
    // --------------------------------------------------------

    const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


    if (!emailValido) {

        return res.status(400).json({

            sucesso: false,

            mensagem: "Digite um e-mail válido."
        });
    }


    // --------------------------------------------------------
    // SQL
    // --------------------------------------------------------

    const sql = `
        INSERT INTO contatos
        (
            nome,
            email,
            assunto,
            mensagem
        )
        VALUES (?, ?, ?, ?)
    `;


    // --------------------------------------------------------
    // SALVAR NO BANCO
    // --------------------------------------------------------

    connection.query(

        sql,

        [
            nome,
            email,
            assunto,
            mensagem
        ],

        async (err, resultado) => {

            if (err) {

                console.error(
                    "ERRO AO SALVAR CONTATO:"
                );

                console.error(err);

                return res.status(500).json({

                    sucesso: false,

                    mensagem:
                        "Erro ao salvar no banco."
                });
            }


            console.log(
                "CONTATO SALVO NO BANCO!"
            );

            console.log(
                "ID:",
                resultado.insertId
            );


            // ------------------------------------------------
            // ENVIAR E-MAIL
            // ------------------------------------------------

            try {

                const info =
                    await transporter.sendMail({

                        from:
                            `"Glídia" <${process.env.EMAIL_USER}>`,

                        to:
                            process.env.EMAIL_USER,

                        replyTo:
                            email,

                        subject:
                            `Novo contato - ${assunto}`,

                        html: `

                            <div
                                style="
                                    font-family:
                                    Arial, sans-serif;
                                    line-height: 1.6;
                                "
                            >

                                <h2>
                                    Novo contato recebido
                                </h2>

                                <hr>

                                <p>
                                    <strong>
                                        Nome:
                                    </strong>

                                    ${nome}
                                </p>

                                <p>
                                    <strong>
                                        Email:
                                    </strong>

                                    ${email}
                                </p>

                                <p>
                                    <strong>
                                        Assunto:
                                    </strong>

                                    ${assunto}
                                </p>

                                <p>
                                    <strong>
                                        Mensagem:
                                    </strong>
                                </p>

                                <p>
                                    ${mensagem}
                                </p>

                            </div>

                        `
                    });


                console.log(
                    "EMAIL ENVIADO!"
                );

                console.log(
                    "Message ID:",
                    info.messageId
                );


                return res.status(200).json({

                    sucesso: true,

                    mensagem:
                        "Email enviado com sucesso!"
                });


            } catch (erro) {

                console.error(
                    "ERRO AO ENVIAR EMAIL:"
                );

                console.error(erro);


                // O contato já foi salvo.
                return res.status(200).json({

                    sucesso: true,

                    mensagem:
                        "Mensagem salva, mas o email não foi enviado."
                });
            }
        }
    );
});


// ============================================================
// LISTAR CONTATOS
// ============================================================

app.get("/contatos", (req, res) => {

    const sql = `
        SELECT *
        FROM contatos
        ORDER BY data_envio DESC
    `;


    connection.query(
        sql,

        (err, resultado) => {

            if (err) {

                console.error(
                    "ERRO AO BUSCAR CONTATOS:"
                );

                console.error(err);

                return res.status(500).json({

                    sucesso: false,

                    mensagem:
                        "Erro ao buscar contatos."
                });
            }


            return res.status(200).json(
                resultado
            );
        }
    );
});


// ============================================================
// LOGIN
// ============================================================

app.post("/login", (req, res) => {

    console.log("");
    console.log("=================================");
    console.log("LOGIN RECEBIDO");
    console.log("=================================");

    console.log(req.body);


    const {
        email,
        senha
    } = req.body;


    // --------------------------------------------------------
    // VALIDAR
    // --------------------------------------------------------

    if (!email || !senha) {

        return res.status(400).json({

            sucesso: false,

            mensagem:
                "Informe o e-mail e a senha."
        });
    }


    // --------------------------------------------------------
    // CONSULTAR USUÁRIO
    // --------------------------------------------------------

    const sql = `
        SELECT *
        FROM usuarios
        WHERE email = ?
        AND senha = ?
        LIMIT 1
    `;


    connection.query(

        sql,

        [
            email,
            senha
        ],

        (err, resultado) => {

            if (err) {

                console.error(
                    "ERRO NO LOGIN:"
                );

                console.error(err);

                return res.status(500).json({

                    sucesso: false,

                    mensagem:
                        "Erro no servidor."
                });
            }


            // ------------------------------------------------
            // USUÁRIO NÃO ENCONTRADO
            // ------------------------------------------------

            if (resultado.length === 0) {

                return res.status(401).json({

                    sucesso: false,

                    mensagem:
                        "E-mail ou senha incorretos."
                });
            }


            console.log(
                "LOGIN REALIZADO COM SUCESSO!"
            );


            return res.status(200).json({

                sucesso: true,

                mensagem:
                    "Login realizado com sucesso!",

                usuario:
                    resultado[0]
            });
        }
    );
});


// ============================================================
// CADASTRO
// ============================================================

app.post("/cadastro", (req, res) => {

    console.log("");
    console.log("=================================");
    console.log("CADASTRO RECEBIDO");
    console.log("=================================");

    console.log(req.body);


    const {
        nome,
        email,
        senha,
        telefone_emergencia
    } = req.body;


    // --------------------------------------------------------
    // VALIDAR CAMPOS
    // --------------------------------------------------------

    if (
        !nome ||
        !email ||
        !senha ||
        !telefone_emergencia
    ) {

        return res.status(400).json({

            sucesso: false,

            mensagem:
                "Preencha todos os campos."
        });
    }


    // --------------------------------------------------------
    // VALIDAR E-MAIL
    // --------------------------------------------------------

    const emailValido =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


    if (!emailValido) {

        return res.status(400).json({

            sucesso: false,

            mensagem:
                "Digite um e-mail válido."
        });
    }


    // --------------------------------------------------------
    // VERIFICAR E-MAIL EXISTENTE
    // --------------------------------------------------------

    connection.query(

        `
            SELECT *
            FROM usuarios
            WHERE email = ?
            LIMIT 1
        `,

        [email],

        (err, resultado) => {

            if (err) {

                console.error(
                    "ERRO AO VERIFICAR USUÁRIO:"
                );

                console.error(err);

                return res.status(500).json({

                    sucesso: false,

                    mensagem:
                        "Erro no servidor."
                });
            }


            // ------------------------------------------------
            // E-MAIL JÁ CADASTRADO
            // ------------------------------------------------

            if (resultado.length > 0) {

                return res.status(400).json({

                    sucesso: false,

                    mensagem:
                        "Este e-mail já está cadastrado."
                });
            }


            // ------------------------------------------------
            // INSERIR USUÁRIO
            // ------------------------------------------------

            const sql = `

                INSERT INTO usuarios

                (
                    nome,
                    email,
                    senha,
                    telefone_emergencia
                )

                VALUES (?, ?, ?, ?)

            `;


            connection.query(

                sql,

                [
                    nome,
                    email,
                    senha,
                    telefone_emergencia
                ],

                (erro, resultadoCadastro) => {

                    if (erro) {

                        console.error(
                            "ERRO AO CADASTRAR:"
                        );

                        console.error(erro);

                        return res.status(500).json({

                            sucesso: false,

                            mensagem:
                                "Erro ao cadastrar."
                        });
                    }


                    console.log(
                        "USUÁRIO CADASTRADO!"
                    );

                    console.log(
                        "ID:",
                        resultadoCadastro.insertId
                    );


                    return res.status(201).json({

                        sucesso: true,

                        mensagem:
                            "Cadastro realizado com sucesso!",

                        usuario: {

                            id:
                                resultadoCadastro.insertId,

                            nome:
                                nome,

                            email:
                                email,

                            telefone_emergencia:
                                telefone_emergencia
                        }
                    });
                }
            );
        }
    );
});


// ============================================================
// GLÍDIA - FUNÇÃO DE RESPOSTA
// ============================================================

function responder(texto, url = null) {

    const resposta = {
        resposta: texto
    };


    if (url) {

        resposta.url = url;
    }


    return resposta;
}


// ============================================================
// NORMALIZAR TEXTO
// ============================================================

function normalizarTexto(texto) {

    return String(texto)

        .toLowerCase()

        .normalize("NFD")

        .replace(
            /[\u0300-\u036f]/g,
            ""
        )

        .replace(
            /[?!.,;:]/g,
            ""
        )

        .replace(
            /\s+/g,
            " "
        )

        .trim();
}


// ============================================================
// LINKS
// ============================================================

const URL_UBER =
    "https://m.uber.com/";

const URL_GPS =
    "https://www.google.com/maps";


// ============================================================
// COMANDO DA GLÍDIA
// ============================================================

app.post("/comando", (req, res) => {

    console.log("");
    console.log("=================================");
    console.log("COMANDO RECEBIDO");
    console.log("=================================");


    let comando =
        req.body.comando;


    // --------------------------------------------------------
    // COMANDO VAZIO
    // --------------------------------------------------------

    if (!comando) {

        return res.status(200).json(

            responder(
                "Não recebi nenhum comando."
            )

        );
    }


    // --------------------------------------------------------
    // NORMALIZAR
    // --------------------------------------------------------

    comando =
        normalizarTexto(comando);


    console.log(
        "Pessoa:",
        comando
    );


    // ========================================================
    // PALAVRAS GPS
    // ========================================================

    const palavrasGPS = [

        "gps",

        "mapa",

        "maps",

        "localizacao",

        "abrir gps",

        "abrindo gps",

        "abra o gps",

        "abre o gps",

        "quero gps",

        "quero abrir gps",

        "abrir mapa",

        "abrindo mapa",

        "abra o mapa",

        "abre o mapa",

        "quero mapa"
    ];


    // ========================================================
    // PALAVRAS UBER
    // ========================================================

    const palavrasUber = [

        "uber",

        "abrir uber",

        "abrindo uber",

        "abra o uber",

        "abre o uber",

        "quero uber",

        "quero abrir uber"
    ];


    // ========================================================
    // VERIFICAR GPS
    // ========================================================

    const pediuGPS =
        palavrasGPS.some(

            palavra =>
                comando.includes(palavra)

        );


    // ========================================================
    // VERIFICAR UBER
    // ========================================================

    const pediuUber =
        palavrasUber.some(

            palavra =>
                comando.includes(palavra)

        );


    // ========================================================
    // GPS
    // ========================================================

    if (pediuGPS) {

        console.log(
            "GPS SOLICITADO."
        );


        return res.status(200).json(

            responder(
                "Abrindo o GPS.",
                URL_GPS
            )

        );
    }


    // ========================================================
    // UBER
    // ========================================================

    if (pediuUber) {

        console.log(
            "UBER SOLICITADO."
        );


        return res.status(200).json(

            responder(
                "Abrindo o Uber.",
                URL_UBER
            )

        );
    }


    // ========================================================
    // NÃO RECONHECIDO
    // ========================================================

    return res.status(200).json(

        responder(

            "Posso abrir o GPS ou o Uber. Diga, por exemplo, abrir GPS ou abrir Uber."

        )

    );
});


// ============================================================
// ROTA 404
// ============================================================

app.use((req, res) => {

    return res.status(404).json({

        sucesso: false,

        mensagem:
            "Rota não encontrada."
    });
});


// ============================================================
// TRATAMENTO DE ERRO
// ============================================================

app.use(
    (erro, req, res, next) => {

        console.error(
            "ERRO INTERNO:"
        );

        console.error(erro);


        if (res.headersSent) {

            return next(erro);
        }


        return res.status(500).json({

            sucesso: false,

            mensagem:
                "Erro interno do servidor."
        });
    }
);


// ============================================================
// INICIAR SERVIDOR
// ============================================================

app.listen(
    PORT,

    () => {

        console.log("");
        console.log(
            "========================================"
        );

        console.log(
            "       GLÍDIA INICIADA"
        );

        console.log(
            "========================================"
        );

        console.log(
            "Porta:",
            PORT
        );

        console.log(
            `API: http://localhost:${PORT}`
        );

        console.log(
            "GPS: ATIVO"
        );

        console.log(
            "UBER: ATIVO"
        );

        console.log(
            "MYSQL: CONFIGURADO"
        );

        console.log(
            "SMTP: CONFIGURADO"
        );

        console.log(
            "========================================"
        );

        console.log("");
    }
);

