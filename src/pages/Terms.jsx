import AnimatedPage from '../components/layout/AnimatedPage';

const TermsOfService = () => {
    return (
        <AnimatedPage title="Términos y Condiciones">
            <div className="pt-32 pb-20 min-h-screen bg-slate-950 relative">
                <div className="max-w-4xl mx-auto px-6">
                    <h1 className="text-4xl font-bold text-white mb-8 border-b border-white/10 pb-6">Términos y Condiciones</h1>

                    <div className="prose prose-invert prose-lg max-w-none text-slate-300">
                        <p>Última actualización: {new Date().toLocaleDateString()}</p>

                        <h3>1. Aceptación de los Términos</h3>
                        <p>Al acceder y utilizar este sitio web, usted acepta estar sujeto a estos Términos y Condiciones de uso, a todas las leyes y regulaciones aplicables, y acepta que es responsable del cumplimiento de las leyes locales aplicables.</p>

                        <h3>2. Licencia de Uso</h3>
                        <p>Se concede permiso para descargar temporalmente una copia de los materiales (información o software) en el sitio web de N8NIA solo para visualización transitoria personal y no comercial.</p>

                        <h3>3. Exención de Responsabilidad</h3>
                        <p>Los materiales en el sitio web de N8NIA se proporcionan &quot;tal cual&quot;. N8NIA no ofrece garantías, expresas o implícitas, y por la presente renuncia y niega todas las demás garantías, incluidas, entre otras, las garantías implícitas o las condiciones de comerciabilidad, idoneidad para un propósito particular o no infracción de la propiedad intelectual u otra violación de derechos.</p>

                        <h3>4. Limitaciones</h3>
                        <p>En ningún caso N8NIA o sus proveedores serán responsables de ningún daño (incluidos, entre otros, daños por pérdida de datos o ganancias, o debido a la interrupción del negocio) que surjan del uso o la incapacidad de usar los materiales en el sitio web.</p>

                        <h3>5. Modificaciones</h3>
                        <p>N8NIA puede revisar estos términos de servicio para su sitio web en cualquier momento sin previo aviso. Al utilizar este sitio web, usted acepta estar sujeto a la versión actual de estos términos de servicio.</p>
                    </div>
                </div>
            </div>
        </AnimatedPage>
    );
};

export default TermsOfService;
