/**
 * ============================================================================
 * 🔍 COMPONENTE: SEO (Optimización para Buscadores)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Gestiona todos los meta tags necesarios para SEO y redes sociales.
 * Incluye Open Graph (Facebook/WhatsApp), Twitter Cards y Schema.org.
 * 
 * USO:
 * <SEO 
 *   title="Título de la página" 
 *   description="Descripción para buscadores"
 * />
 * 
 * PROPS:
 * - title: Título de la página (se agrega " | N8NIADUSTRIA")
 * - description: Meta description para SEO
 * - type: Tipo de contenido (default: 'website')
 * - name: Nombre del sitio (default: 'N8NIADUSTRIA')
 * 
 * Para mejorar SEO:
 * - Cada página debe tener title y description únicos
 * - Las descripciones deben tener 150-160 caracteres
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/components/SEO.jsx
 * 🔗 USADO EN: Todas las páginas que necesitan meta tags personalizados
 * ============================================================================
 */

import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEO = ({ title, description, type = 'website', name = 'N8NIADUSTRIA' }) => {
    const location = useLocation();
    const canonicalUrl = `${window.location.origin}${location.pathname}`;

    const defaultTitle = "N8NIADUSTRIA | Innovación y Automatización";
    const defaultDescription = "Transformamos tu negocio con desarrollo web avanzado, automatizaciones n8n y agentes de IA diseñados para escalar operaciones.";

    const finalTitle = title ? `${title} | N8NIADUSTRIA` : defaultTitle;
    const finalDescription = description || defaultDescription;

    // Structured Data (JSON-LD) for Local Business / Organization
    const schemaData = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "name": "N8NIADUSTRIA",
        "url": "https://miempresan-8-n.vercel.app",
        "logo": "https://miempresan-8-n.vercel.app/logo.png",
        "description": "Agencia de desarrollo web, automatización n8n e Inteligencia Artificial.",
        "address": {
            "@type": "PostalAddress",
            "addressLocality": "Online",
            "addressCountry": "Global"
        },
        "sameAs": [
            "https://linkedin.com/company/n8niadustria",
            "https://twitter.com/n8niadustria"
        ]
    };

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{finalTitle}</title>
            <meta name="description" content={finalDescription} />
            <link rel="canonical" href={canonicalUrl} />

            {/* Open Graph / Facebook / WhatsApp */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={finalTitle} />
            <meta property="og:description" content={finalDescription} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:site_name" content={name} />

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={finalTitle} />
            <meta name="twitter:description" content={finalDescription} />

            {/* Schema.org Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(schemaData)}
            </script>
        </Helmet>
    );
};

export default SEO;
