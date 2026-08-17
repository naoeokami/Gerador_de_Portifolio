// ========================================
// INICIALIZAÇÃO DE DADOS MOCK (DEMONSTRAÇÃO)
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initDemoStorage();
});

function initDemoStorage() {
    // Inicializar Usuários Demo se não existirem
    if (!localStorage.getItem('foliolabs_users')) {
        const initialUsers = [
            {
                id: 'user_demo_1',
                email: 'demo@foliolabs.com',
                password: '123456',
                name: 'Usuário Demo'
            },
            {
                id: 'user_2',
                email: 'ana.silva@example.com',
                password: '123456',
                name: 'Ana Silva'
            },
            {
                id: 'user_3',
                email: 'carlos.ux@example.com',
                password: '123456',
                name: 'Carlos Eduardo'
            }
        ];
        localStorage.setItem('foliolabs_users', JSON.stringify(initialUsers));
    }

    // Inicializar Portfólios Demo se não existirem
    if (!localStorage.getItem('foliolabs_portfolios')) {
        const initialPortfolios = [
            {
                id: 'port_demo_1',
                user_id: 'user_2',
                created_at: new Date('2026-08-01T10:00:00.000Z').toISOString(),
                data: {
                    template: 'template1',
                    nome: 'Ana Silva',
                    profissao: 'Desenvolvedora Full Stack',
                    sobre: 'Desenvolvedora apaixonada por construir produtos modernos, focada em ecossistemas React, Node.js e arquiteturas de alta performance.',
                    email: 'ana.silva@example.com',
                    telefone: '(11) 98765-4321',
                    linkedin: 'https://linkedin.com/in/anasilvadev',
                    profile_image_url: '',
                    conhecimentos: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker'],
                    habilidades: ['Resolução de Problemas', 'Trabalho em Equipe', 'Metodologias Ágeis', 'Comunicação'],
                    experiencias: [
                        {
                            cargo: 'Desenvolvedora Senior',
                            empresa: 'Tech Solutions Ltd.',
                            inicio: '2023-01',
                            fim: '',
                            descricao: 'Arquitetura de microsserviços, liderança técnica de time frontend e integração com APIs REST.'
                        },
                        {
                            cargo: 'Desenvolvedora Web',
                            empresa: 'Inovação Digital',
                            inicio: '2020-05',
                            fim: '2022-12',
                            descricao: 'Desenvolvimento de sistemas web responsivos com React e Node.js.'
                        }
                    ],
                    formacoes: [
                        {
                            curso: 'Engenharia de Software',
                            instituicao: 'Universidade de São Paulo (USP)',
                            inicio: '2016-02',
                            fim: '2020-12'
                        }
                    ],
                    trabalhos: [
                        {
                            titulo: 'Plataforma E-Commerce SaaS',
                            url: 'https://github.com',
                            descricao: 'Sistema completo de vendas online com suporte a pagamentos e gestão de estoque.'
                        },
                        {
                            titulo: 'Gerenciador de Tarefas Inteligente',
                            url: 'https://github.com',
                            descricao: 'App web PWA para produtividade pessoal com notificações.'
                        }
                    ]
                }
            },
            {
                id: 'port_demo_2',
                user_id: 'user_3',
                created_at: new Date('2026-08-05T14:30:00.000Z').toISOString(),
                data: {
                    template: 'template2',
                    nome: 'Carlos Eduardo',
                    profissao: 'Designer UX/UI & Product Designer',
                    sobre: 'Especialista em design de sistemas, prototipagem de alta fidelidade e pesquisas com usuários para criar interfaces intuitivas e memoráveis.',
                    email: 'carlos.ux@example.com',
                    telefone: '(21) 99887-6655',
                    linkedin: 'https://linkedin.com/in/carloseduardoux',
                    profile_image_url: '',
                    conhecimentos: ['Figma', 'UI Design', 'UX Research', 'Design Systems', 'Wireframing', 'Prototipagem'],
                    habilidades: ['Pensamento Crítico', 'Empatia', 'Design Centrado no Usuário', 'Facilitação de Workshops'],
                    experiencias: [
                        {
                            cargo: 'Lead Product Designer',
                            empresa: 'Studio Criativo',
                            inicio: '2022-08',
                            fim: '',
                            descricao: 'Criação e padronização do Design System da empresa e mentoria de novos designers.'
                        }
                    ],
                    formacoes: [
                        {
                            curso: 'Design Gráfico e Mídias Digitais',
                            instituicao: 'PUC-Rio',
                            inicio: '2017-03',
                            fim: '2021-07'
                        }
                    ],
                    trabalhos: [
                        {
                            titulo: 'Redesign do App de Finanças',
                            url: 'https://figma.com',
                            descricao: 'Redesign completo da jornada de investimentos e painel financeiro.'
                        }
                    ]
                }
            }
        ];
        localStorage.setItem('foliolabs_portfolios', JSON.stringify(initialPortfolios));
    }
}

