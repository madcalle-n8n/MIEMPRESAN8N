
import { motion } from 'framer-motion';

const brands = [
    { name: "n8n", style: "font-mono font-bold tracking-tight" },
    { name: "AWS Amazon", style: "font-bold tracking-tight" },
    { name: "Google Cloud", style: "font-semibold tracking-normal" },
    { name: "Lovable", style: "font-bold italic" },
    { name: "Antigravity", style: "font-extrabold tracking-wide" },
    { name: "CloudShare", style: "font-medium" }
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
