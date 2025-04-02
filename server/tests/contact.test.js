const request = require('supertest');
const app = require('../index');
const nodemailer = require('nodemailer');

// Mock do nodemailer
jest.mock('nodemailer');

describe('Contact API', () => {
    let mockTransporter;
    let csrfToken;

    beforeAll(() => {
        // Mock do transporter do nodemailer
        mockTransporter = {
            sendMail: jest.fn().mockResolvedValue(true)
        };
        nodemailer.createTransport.mockReturnValue(mockTransporter);
    });

    beforeEach(async () => {
        // Obter CSRF token antes de cada teste
        const response = await request(app)
            .get('/api/csrf-token')
            .expect(200);
        csrfToken = response.body.csrfToken;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('deve retornar token CSRF', async () => {
        const response = await request(app)
            .get('/api/csrf-token')
            .expect(200);
        expect(response.body).toHaveProperty('csrfToken');
    });

    it('deve enviar mensagem de contato com sucesso', async () => {
        const validData = {
            name: 'João Silva',
            email: 'joao@example.com',
            phone: '(62) 9 9999-9999',
            projectType: 'arquitetura',
            message: 'Preciso de um projeto residencial',
            recaptchaToken: 'valid-token'
        };

        const response = await request(app)
            .post('/api/contact')
            .set('csrf-token', csrfToken)
            .send(validData)
            .expect(200);

        expect(response.body).toHaveProperty('message', 'Mensagem enviada com sucesso');
        expect(mockTransporter.sendMail).toHaveBeenCalledTimes(2); // Email para empresa e confirmação
    });

    it('deve rejeitar dados inválidos', async () => {
        const invalidData = {
            name: 'Jo', // Nome muito curto
            email: 'email-invalido',
            phone: '999999999',
            projectType: 'tipo-invalido',
            message: 'curta',
            recaptchaToken: 'valid-token'
        };

        const response = await request(app)
            .post('/api/contact')
            .set('csrf-token', csrfToken)
            .send(invalidData)
            .expect(400);

        expect(response.body).toHaveProperty('error', 'Dados inválidos');
        expect(mockTransporter.sendMail).not.toHaveBeenCalled();
    });

    it('deve rejeitar requisições sem CSRF token', async () => {
        const validData = {
            name: 'João Silva',
            email: 'joao@example.com',
            phone: '(62) 9 9999-9999',
            projectType: 'arquitetura',
            message: 'Preciso de um projeto residencial',
            recaptchaToken: 'valid-token'
        };

        await request(app)
            .post('/api/contact')
            .send(validData)
            .expect(403);
    });
});
