const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {

    if (err) {
        console.error("Erro ao conectar no banco:");
        console.error(err);
        return;
    }

    console.log("Banco conectado!");

});

const transporter = nodemailer.createTransport({

    host: "smtp.gmail.com",
    port: 465,
    secure: true,

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }

});

transporter.verify((erro) => {

    if (erro) {

        console.error("ERRO SMTP");
        console.error(erro);

    } else {

        console.log("SMTP CONECTADO!");

    }

});

app.post("/contato", (req, res) => {

    console.log("Nova mensagem recebida:");
    console.log(req.body);

    const { nome, email, assunto, mensagem } = req.body;

    if (!nome || !email || !assunto || !mensagem) {

        return res.status(400).json({
            mensagem: "Preencha todos os campos."
        });

    }

    const sql = `
        INSERT INTO contatos
        (nome,email,assunto,mensagem)
        VALUES (?,?,?,?)
    `;

    connection.query(
    sql,
    [nome, email, assunto, mensagem],
    async (err, resultado) => {

        if (err) {
            console.error(err);
            return res.status(500).json({
                mensagem: "Erro ao salvar no banco."
            });
        }

        console.log("SALVOU NO BANCO!");
        console.log(resultado);

        try {
            const info = await transporter.sendMail({
                from: `"Glidia" <${process.env.EMAIL_USER}>`,
                to: process.env.EMAIL_USER,
                replyTo: email,
                subject: `Novo contato - ${assunto}`,
                html: `
                    <h2>Novo contato recebido</h2>
                    <p><strong>Nome:</strong> ${nome}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Assunto:</strong> ${assunto}</p>
                    <p>${mensagem}</p>
                `
            });

            console.log(info);

            res.json({
                mensagem: "Email enviado com sucesso!"
            });

        } catch (erro) {
            console.error(erro);

            res.status(500).json({
                mensagem: "Mensagem salva, mas email não enviado."
            });
        }
    }
);

    connection.query(
        sql,
        [nome, email, assunto, mensagem],
        async (err) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    mensagem: "Erro ao salvar no banco."
                });

            }

            try {

                const info = await transporter.sendMail({

                    from: `"Glidia" <${process.env.EMAIL_USER}>`,

                    to: process.env.EMAIL_USER,

                    replyTo: email,

                    subject: `Novo contato - ${assunto}`,

                    html: `
                        <h2>Novo contato recebido</h2>

                        <hr>

                        <p><strong>Nome:</strong> ${nome}</p>

                        <p><strong>Email:</strong> ${email}</p>

                        <p><strong>Assunto:</strong> ${assunto}</p>

                        <p><strong>Mensagem:</strong></p>

                        <p>${mensagem}</p>
                    `

                });

                console.log("EMAIL ENVIADO!");
                console.log(info);

                return res.status(200).json({
                    mensagem: "Email enviado com sucesso!"
                });

            } catch (erro) {

                console.error("ERRO AO ENVIAR EMAIL:");
                console.error(erro);

                return res.status(500).json({
                    mensagem: "Mensagem salva, mas o email não foi enviado."
                });

            }

        }

    );

});

app.get("/contatos", (req, res) => {

    connection.query(
        "SELECT * FROM contatos ORDER BY data_envio DESC",
        (err, resultado) => {

            if (err) {

                return res.status(500).json(err);

            }

            res.json(resultado);

        }

    );

});


app.post("/login", (req, res) => {

    console.log("LOGIN RECEBIDO");
    console.log(req.body);

    const { email, senha } = req.body;

    connection.query(

        "SELECT * FROM usuarios WHERE email=? AND senha=?",

        [email, senha],

        (err, resultado) => {

            if (err) {

                return res.status(500).json({
                    mensagem: "Erro no servidor."
                });

            }

            if (resultado.length === 0) {

                return res.status(401).json({
                    mensagem: "E-mail ou senha incorretos."
                });

            }

            res.json({
                mensagem: "Login realizado com sucesso!",
                usuario: resultado[0]
            });

        }

    );

});

app.post("/cadastro", (req, res) => {

    console.log("CADASTRO RECEBIDO");
    console.log(req.body);

    const {
        nome,
        email,
        senha,
        telefone_emergencia
    } = req.body;


    if (
        !nome ||
        !email ||
        !senha ||
        !telefone_emergencia
    ) {

        return res.status(400).json({
            mensagem: "Preencha todos os campos."
        });

    }


    connection.query(

        "SELECT * FROM usuarios WHERE email=?",

        [email],

        (err, resultado) => {

            if (err) {

                console.error(err);

                return res.status(500).json({
                    mensagem: "Erro no servidor."
                });

            }


            if (resultado.length > 0) {

                return res.status(400).json({
                    mensagem: "Este e-mail já está cadastrado."
                });

            }

            connection.query(

                `INSERT INTO usuarios
                (nome, email, senha, telefone_emergencia)
                VALUES (?, ?, ?, ?)`,

                [
                    nome,
                    email,
                    senha,
                    telefone_emergencia
                ],

                (erro) => {

                    if (erro) {

                        console.error(erro);

                        return res.status(500).json({
                            mensagem: "Erro ao cadastrar."
                        });

                    }


                    console.log("USUÁRIO CADASTRADO!");
                    console.log("Telefone de emergência:",
                        telefone_emergencia
                    );


                    res.status(201).json({

                        mensagem:
                            "Cadastro realizado com sucesso!"

                    });

                }

            );

        }

    );

});


app.listen(process.env.PORT, () => {

    console.log(`Servidor rodando na porta ${process.env.PORT}`);

});