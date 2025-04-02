const nodemailer = require('nodemailer');

// Configurar transporte de email
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Controller para envio de email
const sendContactEmail = async (req, res) => {
    try {
        const { name, email, phone, projectType, message } = req.body;

        // Template do email
        const mailOptions = {
            from: process.env.SMTP_FROM,
            to: process.env.CONTACT_EMAIL,
            subject: `Novo contato - ${projectType}`,
            html: `
                <h2>Novo contato através do site</h2>
                <p><strong>Nome:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Telefone:</strong> ${phone}</p>
                <p><strong>Tipo de Projeto:</strong> ${projectType}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${message}</p>
            `
        };

        // Enviar email
        await transporter.sendMail(mailOptions);

        // Email de confirmação para o cliente
        const confirmationOptions = {
            from: process.env.SMTP_FROM,
            to: email,
            subject: 'Recebemos sua mensagem - Mont Cruz Engenharia',
            html: `
                <h2>Olá ${name},</h2>
                <p>Recebemos sua mensagem e retornaremos em breve.</p>
                <p>Detalhes do seu contato:</p>
                <ul>
                    <li>Tipo de Projeto: ${projectType}</li>
                    <li>Mensagem: ${message}</li>
                </ul>
                <p>Atenciosamente,<br>Equipe Mont Cruz Engenharia</p>
            `
        };

        await transporter.sendMail(confirmationOptions);

        res.status(200).json({ 
            message: 'Mensagem enviada com sucesso' 
        });

    } catch (error) {
        console.error('Erro ao enviar email:', error);
        res.status(500).json({ 
            error: 'Erro ao enviar mensagem' 
        });
    }
};

module.exports = {
    sendContactEmail
};
