const express = require('express');
const router = express.Router();
const { validateContactForm, handleValidationErrors } = require('../middleware/validation');
const { sendContactEmail } = require('../controllers/contact');
const { csrfProtection } = require('../middleware/security');

// Rota para obter token CSRF
router.get('/csrf-token', csrfProtection, (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
});

// Rota para envio de contato
router.post('/contact', 
    csrfProtection,
    validateContactForm,
    handleValidationErrors,
    sendContactEmail
);

module.exports = router;
