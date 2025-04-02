const { body, validationResult } = require('express-validator');
const axios = require('axios');

// Validação do reCAPTCHA
const verifyRecaptcha = async (token) => {
    try {
        const response = await axios.post(
            `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`
        );
        return response.data.success && response.data.score >= 0.5;
    } catch (error) {
        console.error('Erro ao verificar reCAPTCHA:', error);
        return false;
    }
};

// Validação do formulário de contato
const validateContactForm = [
    body('name')
        .trim()
        .isLength({ min: 3 })
        .withMessage('Nome deve ter pelo menos 3 caracteres')
        .escape(),
    body('email')
        .isEmail()
        .withMessage('Email inválido')
        .normalizeEmail(),
    body('phone')
        .matches(/^\(\d{2}\)\s\d\s\d{4}-\d{4}$/)
        .withMessage('Telefone inválido'),
    body('projectType')
        .isIn(['arquitetura', 'estrutural-concreto', 'estrutural-metalico', 'hidrossanitario', 'fotovoltaico', 'consultoria', 'orcamentos'])
        .withMessage('Tipo de projeto inválido'),
    body('message')
        .trim()
        .isLength({ min: 10 })
        .withMessage('Mensagem muito curta')
        .escape(),
    body('recaptchaToken')
        .custom(async (token) => {
            const isValid = await verifyRecaptcha(token);
            if (!isValid) {
                throw new Error('Verificação de reCAPTCHA falhou');
            }
            return true;
        })
];

// Middleware de validação
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            error: 'Dados inválidos',
            details: errors.array() 
        });
    }
    next();
};

module.exports = {
    validateContactForm,
    handleValidationErrors
};
