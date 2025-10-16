require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();

// Middlewares
app.use(cors({
    origin: ['https://seu-site.netlify.app', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Configuração do Pool de conexão Neon
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Testar conexão com o banco
pool.connect((err, client, release) => {
    if (err) {
        console.error('Erro ao conectar com o banco:', err);
    } else {
        console.log('✅ Conectado ao Neon PostgreSQL!');
        release();
    }
});

// Rota de saúde da API
app.get('/api/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API FolioLabs está funcionando!',
        timestamp: new Date().toISOString()
    });
});

// Rota para cadastro
app.post('/api/cadastro', async (req, res) => {
    try {
        const { nome, email, senha } = req.body;
        
        console.log('Tentando cadastrar:', { nome, email });
        
        // Verificar se email já existe
        const usuarioExistente = await pool.query(
            'SELECT id FROM "User" WHERE Email = $1',
            [email]
        );
        
        if (usuarioExistente.rows.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Email já cadastrado'
            });
        }
        
        // Criptografar senha
        const saltRounds = 10;
        const senhaCriptografada = await bcrypt.hash(senha, saltRounds);
        
        // Inserir usuário
        const result = await pool.query(
            `INSERT INTO "User" (Nome, Email, Senha, Type_User) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, Nome, Email, Type_User`,
            [nome, email, senhaCriptografada, 2]
        );
        
        console.log('Usuário cadastrado com sucesso:', result.rows[0]);
        
        res.json({
            success: true,
            usuario: result.rows[0]
        });
        
    } catch (error) {
        console.error('Erro no cadastro:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Rota para login
app.post('/api/login', async (req, res) => {
    try {
        const { email, senha } = req.body;
        
        console.log('Tentando login:', { email });
        
        // Buscar usuário
        const result = await pool.query(
            'SELECT id, Nome, Email, Senha, Type_User FROM "User" WHERE Email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Usuário não encontrado'
            });
        }
        
        const usuario = result.rows[0];
        
        // Verificar senha
        const senhaValida = await bcrypt.compare(senha, usuario.senha);
        
        if (!senhaValida) {
            return res.status(400).json({
                success: false,
                error: 'Senha incorreta'
            });
        }
        
        // Remover senha do retorno
        const { senha: _, ...usuarioSemSenha } = usuario;
        
        console.log('Login bem-sucedido:', usuarioSemSenha);
        
        res.json({
            success: true,
            usuario: usuarioSemSenha
        });
        
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({
            success: false,
            error: 'Erro interno do servidor'
        });
    }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
    console.log(`📧 Health check: http://localhost:${PORT}/api/health`);
});