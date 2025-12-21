/**
 * ============================================================================
 * 🏆 COMPONENTE: TrustSection (Sección de Confianza)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Muestra los logos/nombres de las tecnologías y partners certificados
 * para generar confianza en los visitantes (social proof).
 * 
 * Para agregar más marcas, edita el array 'brands' debajo.
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/components/TrustSection.jsx
 * 🔗 USADO EN: Home.jsx (página principal)
 * ============================================================================
 */

import { motion } from 'framer-motion';

// Lista de tecnologías/partners certificados
// Para agregar una nueva: { name: "Nombre", style: "clases Tailwind" }
const brands = [
    { name: "n8n", style: "font-bold" },
    { name: "AWS Amazon", style: "font-bold" },
    { name: "Google Cloud", style: "font-bold" },
    { name: "Supabase", style: "font-bold" },
    { name: "Lovable", style: "font-bold" },
    { name: "Antigravity", style: "font-bold" },
    { name: "CloudShare", style: "font-bold" }
];

const TrustSection = () => {
    return (
        <section className="py-12 border-y border-white/5 bg-white/[0.02]">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-xs font-bold text-slate-500 mb-8 uppercase tracking-[0.2em]">
                    Tecnología Certificada
                </p>
                <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
                    {brands.map((brand, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1 }}
                            className={`text-xl md:text-2xl text-slate-500 hover:text-white transition-colors cursor-default ${brand.style}`}
                        >
                            {brand.name}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default TrustSection;
