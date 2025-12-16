import AnimatedPage from '../components/layout/AnimatedPage';

const PrivacyPolicy = () => {
    return (
        <AnimatedPage title="Política de Privacidad">
            <div className="pt-32 pb-20 min-h-screen bg-slate-950 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-6">Política de Privacidad</h1>

                    <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                        <p>Última actualización: {new Date().toLocaleDateString()}</p>

                        <h3>1. Introducción</h3>
                        <p>En N8NIA (en adelante, "nosotros"), respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos personales cuando visita nuestro sitio web y le informará sobre sus derechos de privacidad.</p>

                        <h3>2. Los datos que recopilamos</h3>
                        <p>Podemos recopilar, utilizar, almacenar y transferir diferentes tipos de datos personales sobre usted, que hemos agrupado de la siguiente manera:</p>
                        <ul>
                            <li><strong>Datos de Identidad:</strong> incluye nombre y apellidos.</li>
                            <li><strong>Datos de Contacto:</strong> incluye dirección de correo electrónico y números de teléfono.</li>
                            <li><strong>Datos Técnicos:</strong> incluye dirección IP, tipo y versión del navegador, configuración y ubicación de la zona horaria, tipos y versiones de complementos del navegador, sistema operativo y plataforma.</li>
                        </ul>

                        <h3>3. Cómo usamos sus datos</h3>
                        <p>Solo utilizaremos sus datos personales cuando la ley nos lo permita. Lo más habitual es que utilicemos sus datos personales en las siguientes circunstancias:</p>
                        <ul>
                            <li>Para responder a sus consultas o solicitudes de servicio.</li>
                            <li>Para mejorar nuestro sitio web y servicios.</li>
                            <li>Para enviarle comunicaciones de marketing (si ha dado su consentimiento).</li>
                        </ul>

                        <h3>4. Seguridad de los datos</h3>
                        <p>Hemos implementado medidas de seguridad adecuadas para evitar que sus datos personales se pierdan accidentalmente, se utilicen o se acceda a ellos de forma no autorizada, se modifiquen o se divulguen.</p>

                        <h3>5. Contacto</h3>
                        <p>Si tiene alguna pregunta sobre esta política de privacidad, contáctenos a través de nuestro formulario de contacto.</p>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default PrivacyPolicy;
