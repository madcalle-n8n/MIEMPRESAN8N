import { Helmet } from 'react-helmet-async';

const SecurityHead = () => {
    return (
        <Helmet>
            <meta http-equiv="X-Content-Type-Options" content="nosniff" />
            <meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
            <meta http-equiv="Permissions-Policy" content="camera=(), microphone=(), geolocation=()" />

            {/* 
              Content-Security-Policy:
              - Restringe scripts a 'self' y 'unsafe-inline' (necesario para Vite/React en dev).
              - En producción, idealmente se usarían nonces o hashes, pero esto es una capa base.
            */}
            <meta
                http-equiv="Content-Security-Policy"
                content="default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' https: data:;"
            />
        </Helmet>
    );
};

export default SecurityHead;
