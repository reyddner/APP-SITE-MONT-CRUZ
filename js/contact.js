// Máscaras e validações
const phoneMask = (value) => {
    return value
        .replace(/\D/g, '')
        .replace(/^(\d{2})(\d)/g, '($1) $2')
        .replace(/(\d)(\d{4})$/, '$1-$2');
};

const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
};

// Feedback visual
const showFeedback = (inputElement, isValid, message) => {
    const feedback = inputElement.parentElement.querySelector('.feedback-message');
    if (!feedback) {
        const feedbackDiv = document.createElement('div');
        feedbackDiv.className = `feedback-message ${isValid ? 'valid' : 'invalid'}`;
        feedbackDiv.textContent = message;
        inputElement.parentElement.appendChild(feedbackDiv);
    } else {
        feedback.className = `feedback-message ${isValid ? 'valid' : 'invalid'}`;
        feedback.textContent = message;
    }
    inputElement.classList.toggle('invalid-input', !isValid);
};

// Manipulação do formulário
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const submitButton = form.querySelector('button[type="submit"]');
    const loadingSpinner = form.querySelector('.loading-spinner');
    let isSubmitting = false;

    // Aplicar máscara ao telefone
    phoneInput.addEventListener('input', (e) => {
        e.target.value = phoneMask(e.target.value);
    });

    // Validar email em tempo real
    emailInput.addEventListener('blur', () => {
        const isValid = validateEmail(emailInput.value);
        showFeedback(emailInput, isValid, isValid ? 'Email válido' : 'Email inválido');
    });

    // Validar formulário no envio
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (isSubmitting) return;

        const name = form.querySelector('#name').value;
        const phone = phoneInput.value;
        const email = emailInput.value;
        const projectType = form.querySelector('#projectType').value;
        const message = form.querySelector('#message').value;

        // Validações
        let isValid = true;
        if (name.length < 3) {
            showFeedback(form.querySelector('#name'), false, 'Nome deve ter pelo menos 3 caracteres');
            isValid = false;
        }
        if (!validateEmail(email)) {
            showFeedback(emailInput, false, 'Email inválido');
            isValid = false;
        }
        if (phone.replace(/\D/g, '').length < 11) {
            showFeedback(phoneInput, false, 'Telefone inválido');
            isValid = false;
        }
        if (!projectType) {
            showFeedback(form.querySelector('#projectType'), false, 'Selecione um tipo de projeto');
            isValid = false;
        }
        if (message.length < 10) {
            showFeedback(form.querySelector('#message'), false, 'Mensagem muito curta');
            isValid = false;
        }

        if (!isValid) return;

        try {
            isSubmitting = true;
            submitButton.disabled = true;
            loadingSpinner.style.display = 'block';
            submitButton.textContent = 'Enviando...';

            // Obter token do reCAPTCHA
            const recaptchaToken = await grecaptcha.execute('RECAPTCHA_SITE_KEY', {action: 'submit'});

            // Obter CSRF token
            const csrfResponse = await fetch('/api/csrf-token');
            const { csrfToken } = await csrfResponse.json();

            // Enviar dados para o backend
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'CSRF-Token': csrfToken
                },
                body: JSON.stringify({
                    name,
                    phone,
                    email,
                    projectType,
                    message,
                    recaptchaToken
                }),
                credentials: 'include'
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao enviar mensagem');
            }

            // Feedback de sucesso
            form.innerHTML = `
                <div class="success-message">
                    <h3>Mensagem enviada com sucesso!</h3>
                    <p>Agradecemos seu contato. Retornaremos em breve.</p>
                </div>
            `;

            // Registrar evento no Analytics
            gtag('event', 'form_submission', {
                'event_category': 'Contact',
                'event_label': projectType
            });

        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao enviar mensagem. Por favor, tente novamente.');
        } finally {
            isSubmitting = false;
            submitButton.disabled = false;
            loadingSpinner.style.display = 'none';
            submitButton.textContent = 'Enviar Solicitação';
        }
    });
});
