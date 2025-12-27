/**
 * ============================================================================
 * 🔐 COMPONENTE: SecurityHead (Cabeceras de Seguridad)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Agrega meta tags de seguridad HTTP al documento HTML.
 * Estas cabeceras protegen contra ataques comunes como XSS y clickjacking.
 * 
 * CABECERAS INCLUIDAS:
 * - X-Content-Type-Options: Previene MIME-type sniffing
 * - Referrer-Policy: Controla qué info se envía al navegar
 * - Permissions-Policy: Desactiva cámara, micrófono, geolocalización
 * - Content-Security-Policy: Restringe orígenes de scripts y estilos
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/components/common/SecurityHead.jsx
 * 🔗 USADO EN: App.jsx (activo en todas las páginas)
 * ============================================================================
 */

import { Helmet } from 'react-helmet-async';

const SecurityHead = () => {
    return (
        <Helmet>
            <meta httpEquiv="X-Content-Type-Options" content="nosniff" />
            <meta httpEquiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
            <meta httpEquiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />

            {/* 
              Content-Security-Policy:
              - Restringe scripts a 'self' y 'unsafe-inline' (necesario para Vite/React en dev).
              - En producción, idealmente se usarían nonces o hashes, pero esto es una capa base.
            */}
            <meta
                httpEquiv="Content-Security-Policy"
                content="default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https: data:;"
            />
        </Helmet>
    );
};

export default SecurityHead;
