/**
 * ============================================================================
 * ✨ COMPONENTE: AnimatedPage (Wrapper de Animación)
 * ============================================================================
 * 
 * PROPÓSITO:
 * Envuelve cada página para aplicar animaciones de entrada/salida
 * suaves cuando el usuario navega entre páginas.
 * 
 * USO:
 * Envuelve el contenido de una página:
 * <AnimatedPage title="Nombre de Página">
 *   ...contenido...
 * </AnimatedPage>
 * 
 * Props:
 * - title: Título que aparece en la pestaña del navegador
 * - children: Contenido de la página
 * 
 * ============================================================================
 * 📁 UBICACIÓN: src/components/layout/AnimatedPage.jsx
 * 🔗 USADO EN: Todas las páginas (Home, Services, Contact, etc.)
 * ============================================================================
 */

import { useEffect } from 'react';
import { motion } from 'framer-motion';

// Configuración de animación para transiciones entre páginas
const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 1.02 }
};

const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5
};

const AnimatedPage = ({ children, title }) => {
    useEffect(() => {
        if (title) {
            document.title = `${title} | N8NIADUSTRIA`;
        }
    }, [title]);

    return (
        <motion.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            {children}
        </motion.div>
    );
};

export default AnimatedPage;
