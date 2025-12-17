
import { Globe, Workflow, Bot, Layout, Users } from 'lucide-react';

export const servicesData = [
    {
        id: 'web-full-stack',
        title: 'Web Full Stack',
        icon: Globe,
        color: "text-blue-400",
        bg: "bg-blue-500/20",
        shortDesc: 'React, Python & Dashboards interactivos.',
        fullDesc: 'Desarrollamos aplicaciones web de alto rendimiento diseñadas para escalar. No solo creamos páginas, construimos herramientas digitales que optimizan tus operaciones.',
        features: [
            'Desarrollo Frontend con React y TailwindCSS para interfaces modernas y rápidas.',
            'Backend robusto en Python (Django/FastAPI) o Node.js.',
            'Integración de Dashboards interactivos para visualización de datos en tiempo real.',
            'Optimización SEO técnica y accesibilidad web garantizada.',
            'Arquitectura PWA (Progressive Web App) para funcionamiento offline.'
        ],
        benefits: [
            'Experiencia de usuario fluida y premium.',
            'Código limpio y mantenible.',
            'Velocidad de carga optimizada.'
        ]
    },
    {
        id: 'automatizacion-n8n',
        title: 'Automatización n8n',
        icon: Workflow,
        color: "text-pink-400",
        bg: "bg-pink-500/20",
        shortDesc: 'Flujos de trabajo que eliminan tareas repetitivas.',
        fullDesc: 'Recupera horas de tu equipo automatizando procesos manuales. Conectamos tus herramientas favoritas mediante n8n para crear flujos de trabajo inteligentes y autónomos.',
        features: [
            'Sincronización bidireccional entre CRM, Email y Hojas de Cálculo.',
            'Automatización de lead nurturing y seguimiento de ventas.',
            'Generación y envío automático de reportes PDF/Excel.',
            'Webhooks personalizados para conectar servicios sin API nativa.',
            'Limpieza y enriquecimiento automático de bases de datos.'
        ],
        benefits: [
            'Reducción de errores humanos.',
            'Ahorro de +20 horas semanales por empleado.',
            'Procesos estandarizados y auditables.'
        ]
    },
    {
        id: 'agentes-ia',
        title: 'Agentes IA',
        icon: Bot,
        color: "text-purple-400",
        bg: "bg-purple-500/20",
        shortDesc: 'Chatbots entrenados con tus datos empresariales.',
        fullDesc: 'Implementamos asistentes virtuales que realmente entienden tu negocio. Utilizamos modelos LLM avanzados (GPT-4, Claude) conectados a tu propia base de conocimiento.',
        features: [
            'Chatbots de Atención al Cliente 24/7 con tono humano.',
            'Sistemas RAG (Retrieval-Augmented Generation) para responder sobre tus PDFs y Docs.',
            'Agentes de ventas capaces de calificar leads y agendar reuniones.',
            'Análisis de sentimiento en tiempo real de las interacciones.',
            'Integración directa en WhatsApp, Web y Slack.'
        ],
        benefits: [
            'Soporte inmediato sin tiempos de espera.',
            'Respuestas precisas basadas en TU información.',
            'Escalabilidad infinita en picos de demanda.'
        ]
    },
    {
        id: 'infraestructura-aws',
        title: 'Infraestructura AWS',
        icon: Layout,
        color: "text-green-400",
        bg: "bg-green-500/20",
        shortDesc: 'VPS, Dominios y escalabilidad segura.',
        fullDesc: 'Construimos los cimientos digitales de tu empresa. Infraestructura cloud sólida, segura y lista para crecer contigo sin complicaciones técnicas.',
        features: [
            'Configuración y mantenimiento de Servidores VPS (EC2, Lightsail).',
            'Gestión completa de dominios, DNS y certificados SSL.',
            'Implementación de estrategias de Backup y Disaster Recovery.',
            'Arquitecturas Serverless para optimización de costos.',
            'Seguridad perimetral y protección contra ataques DDoS.'
        ],
        benefits: [
            'Uptime garantizado del 99.9%.',
            'Seguridad de grado empresarial.',
            'Costos predecibles y optimizados.'
        ]
    },
    {
        id: 'crm-simple',
        title: 'Gestión de Clientes (CRM)',
        icon: Users,
        color: "text-orange-400",
        bg: "bg-orange-500/20",
        shortDesc: 'Registro de clientes, seguimiento y comunicación automatizada.',
        fullDesc: 'Centraliza toda la información de tus clientes en un solo lugar. Nuestro CRM simple te permite gestionar contactos, historial de compras y comunicaciones de forma eficiente sin la complejidad de los CRM tradicionales.',
        features: [
            'Registro completo de clientes con datos de contacto, empresa y notas personalizadas.',
            'Historial de compras y transacciones por cliente con exportación a Excel.',
            'Recordatorios automáticos de seguimiento, renovaciones y fechas importantes.',
            'Envío de mensajes personalizados vía Email y WhatsApp integrado.',
            'Dashboard con métricas de clientes, ventas y rendimiento del equipo.'
        ],
        benefits: [
            'Nunca pierdas una oportunidad de venta.',
            'Mejora la retención de clientes hasta un 40%.',
            'Comunicación personalizada y oportuna.'
        ]
    }
];
