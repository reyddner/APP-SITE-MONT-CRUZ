/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.resolve(__dirname, '../contato.html'), 'utf8');

describe('Formulário de Contato', () => {
    beforeEach(() => {
        document.documentElement.innerHTML = html;
        require('../js/contact.js');
    });

    test('Deve ter todos os campos obrigatórios', () => {
        const form = document.getElementById('contactForm');
        expect(form).toBeTruthy();
        
        const requiredFields = ['name', 'phone', 'email', 'projectType', 'message'];
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            expect(field).toBeTruthy();
            expect(field.required).toBeTruthy();
        });
    });

    test('Deve validar email corretamente', () => {
        const { validateEmail } = require('../js/contact.js');
        
        expect(validateEmail('test@example.com')).toBeTruthy();
        expect(validateEmail('invalid-email')).toBeFalsy();
        expect(validateEmail('test@.com')).toBeFalsy();
        expect(validateEmail('@example.com')).toBeFalsy();
    });

    test('Deve formatar telefone corretamente', () => {
        const { phoneMask } = require('../js/contact.js');
        
        expect(phoneMask('6282497981')).toBe('(62) 8249-7981');
        expect(phoneMask('62982497981')).toBe('(62) 98249-7981');
        expect(phoneMask('abc')).toBe('');
    });

    test('Deve ter link do Instagram correto', () => {
        const instagramLink = document.querySelector('.social-links a[href*="instagram"]');
        expect(instagramLink).toBeTruthy();
        expect(instagramLink.href).toBe('https://www.instagram.com/montcruzeng/');
        expect(instagramLink.target).toBe('_blank');
        expect(instagramLink.rel).toBe('noopener noreferrer');
    });

    test('Não deve ter links visíveis para LinkedIn e Twitter', () => {
        const socialLinks = document.querySelectorAll('.social-links a');
        const visibleLinks = Array.from(socialLinks).filter(link => 
            !link.parentElement.innerHTML.includes('<!--') &&
            (link.textContent.includes('LinkedIn') || link.textContent.includes('X (Twitter)'))
        );
        expect(visibleLinks.length).toBe(0);
    });
});
