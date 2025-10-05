"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export function ComingSoonIA() {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
    const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
    const windowWidth = typeof window !== "undefined" ? window.innerWidth : 1920;
    const windowHeight = typeof window !== "undefined" ? window.innerHeight : 1080;

    const features = [
        {
            icon: "🧠",
            title: "Deep Learning Agrícola",
            description: "Redes neuronales entrenadas con millones de datos satelitales para predecir rendimientos con 95% de precisión",
            color: "from-purple-500 to-pink-500",
            progress: 75
        },
        {
            icon: "🔮",
            title: "Predicción Temporal",
            description: "Algoritmos de series temporales que anticipan plagas y enfermedades 2-3 semanas antes de su aparición",
            color: "from-cyan-500 to-blue-500",
            progress: 65
        },
        {
            icon: "🎯",
            title: "Optimización Automática",
            description: "IA que toma decisiones en tiempo real sobre riego, fertilización y control de plagas",
            color: "from-green-500 to-emerald-500",
            progress: 70
        },
        {
            icon: "📊",
            title: "Análisis Predictivo",
            description: "Modelos de machine learning que calculan ROI y sugieren los cultivos más rentables por temporada",
            color: "from-orange-500 to-red-500",
            progress: 60
        }
    ];

    const timeline = [
        { phase: "Fase 1", title: "Recopilación de Datos", status: "completed", date: "Q1 2025" },
        { phase: "Fase 2", title: "Entrenamiento de Modelos", status: "active", date: "Q2 2025" },
        { phase: "Fase 3", title: "Pruebas Beta", status: "upcoming", date: "Q3 2025" },
        { phase: "Fase 4", title: "Lanzamiento Público", status: "upcoming", date: "Q4 2025" }
    ];

    return (
        <div ref={containerRef} className="min-h-screen bg-gray-900 relative overflow-hidden">
            {/* Fondo animado con partículas */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-cyan-400 rounded-full"
                        initial={{
                            x: Math.random() * windowWidth,
                            y: Math.random() * windowHeight,
                            opacity: 0
                        }}
                        animate={{
                            y: [null, Math.random() * windowHeight],
                            opacity: [0, 1, 0]
                        }}
                        transition={{
                            duration: Math.random() * 10 + 10,
                            repeat: Infinity,
                            delay: Math.random() * 5
                        }}
                    />
                ))}
            </div>

            {/* Grid de fondo */}
            <div className="fixed inset-0 bg-[linear-gradient(rgba(6,182,212,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.05)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

            {/* Hero Section */}
            <motion.div
                className="relative min-h-screen flex items-center justify-center px-8"
                style={{ opacity, scale }}
            >
                <div className="max-w-6xl mx-auto text-center">
                    {/* Logo animado */}
                    <motion.div
                        className="relative inline-block mb-8"
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 1, type: "spring" }}
                    >
                        <motion.div
                            className="text-9xl"
                            animate={{
                                rotateY: [0, 360],
                                filter: ["hue-rotate(0deg)", "hue-rotate(360deg)"]
                            }}
                            transition={{
                                rotateY: { duration: 4, repeat: Infinity, ease: "linear" },
                                filter: { duration: 8, repeat: Infinity, ease: "linear" }
                            }}
                        >
                            🤖
                        </motion.div>

                        {/* Anillos orbitales */}
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                className="absolute inset-0 border-2 border-cyan-500/30 rounded-full"
                                style={{
                                    width: `${140 + i * 40}%`,
                                    height: `${140 + i * 40}%`,
                                    top: `${-20 - i * 20}%`,
                                    left: `${-20 - i * 20}%`
                                }}
                                animate={{ rotate: 360 }}
                                transition={{
                                    duration: 10 + i * 5,
                                    repeat: Infinity,
                                    ease: "linear"
                                }}
                            />
                        ))}
                    </motion.div>

                    {/* Título principal */}
                    <motion.h1
                        className="text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                    >
                        IA Predictiva
                    </motion.h1>

                    <motion.div
                        className="inline-block mb-8"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-400/50 rounded-2xl px-8 py-4 backdrop-blur-sm">
                            <p className="text-2xl font-bold text-cyan-400">
                                El Futuro de la Agricultura Inteligente
                            </p>
                        </div>
                    </motion.div>

                    <motion.p
                        className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        Estamos construyendo el sistema de inteligencia artificial más avanzado para agricultura,
                        combinando datos satelitales NASA, machine learning y computación en la nube para
                        revolucionar cómo se cultiva alrededor del mundo.
                    </motion.p>

                    {/* Estadísticas impactantes */}
                    <motion.div
                        className="grid grid-cols-4 gap-6 max-w-4xl mx-auto mb-12"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.9 }}
                    >
                        {[
                            { value: "95%", label: "Precisión Predictiva" },
                            { value: "2-3", label: "Semanas Anticipación" },
                            { value: "24/7", label: "Monitoreo Continuo" },
                            { value: "∞", label: "Aprendizaje Constante" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 backdrop-blur-sm"
                                whileHover={{ scale: 1.05, borderColor: "rgb(34, 211, 238)" }}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1 + i * 0.1 }}
                            >
                                <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                                    {stat.value}
                                </div>
                                <div className="text-gray-400 text-sm">{stat.label}</div>
                            </motion.div>
                        ))}
                    </motion.div>

                    {/* Scroll indicator */}
                    <motion.div
                        className="flex flex-col items-center gap-2 text-cyan-400"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                    >
                        <span className="text-sm">Descubre más</span>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </div>
            </motion.div>

            {/* Features Section */}
            <div className="relative py-32 px-8">
                <div className="max-w-7xl mx-auto">
                    <motion.h2
                        className="text-5xl font-bold text-center mb-16 text-white"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Tecnologías del Futuro
                    </motion.h2>

                    <div className="grid grid-cols-2 gap-8">
                        {features.map((feature, i) => (
                            <motion.div
                                key={i}
                                className="group relative bg-gray-800/50 border border-gray-700 rounded-2xl p-8 overflow-hidden backdrop-blur-sm"
                                initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.2 }}
                                whileHover={{ scale: 1.02, borderColor: "rgb(34, 211, 238)" }}
                            >
                                {/* Efecto de brillo en hover */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                                <div className="relative">
                                    <motion.div
                                        className={`text-6xl mb-4 inline-block bg-gradient-to-r ${feature.color} bg-clip-text text-transparent`}
                                        whileHover={{ scale: 1.2, rotate: 5 }}
                                    >
                                        {feature.icon}
                                    </motion.div>

                                    <h3 className="text-2xl font-bold text-white mb-3">
                                        {feature.title}
                                    </h3>

                                    <p className="text-gray-400 leading-relaxed mb-6">
                                        {feature.description}
                                    </p>

                                    {/* Progress bar */}
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Desarrollo</span>
                                            <span className="text-cyan-400 font-bold">{feature.progress}%</span>
                                        </div>
                                        <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full bg-gradient-to-r ${feature.color}`}
                                                initial={{ width: 0 }}
                                                whileInView={{ width: `${feature.progress}%` }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 1, delay: i * 0.2 }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Timeline Section */}
            <div className="relative py-32 px-4 sm:px-8 bg-gradient-to-b from-transparent via-gray-800/30 to-transparent">
                <div className="max-w-6xl mx-auto text-center">
                    <motion.h2
                        className="text-4xl sm:text-5xl font-bold text-white mb-20"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        Roadmap de Desarrollo
                    </motion.h2>

                    {/* Timeline container */}
                    <div className="relative">
                        {/* Línea central */}
                        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 via-blue-500 to-purple-500 rounded-full" />

                        {/* Items del timeline */}
                        <div className="space-y-20">
                            {timeline.map((item, i) => (
                                <motion.div
                                    key={i}
                                    className={`relative flex flex-col sm:flex-row sm:items-center sm:justify-between ${i % 2 === 0 ? 'sm:flex-row-reverse' : ''
                                        }`}
                                    initial={{ opacity: 0, y: 50 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.2 }}
                                >
                                    {/* Contenedor de texto */}
                                    <div
                                        className={`w-full sm:w-5/12 text-center sm:text-${i % 2 === 0 ? 'left' : 'right'
                                            }`}
                                    >
                                        <motion.div
                                            className={`bg-gray-800 border-2 rounded-2xl p-6 sm:p-8 inline-block text-left shadow-lg ${item.status === 'completed'
                                                ? 'border-green-500'
                                                : item.status === 'active'
                                                    ? 'border-cyan-500'
                                                    : 'border-gray-700'
                                                }`}
                                            whileHover={{ scale: 1.05 }}
                                        >
                                            <div className="text-sm text-gray-400 mb-2">{item.phase}</div>
                                            <h3 className="text-2xl font-bold text-white mb-1">{item.title}</h3>
                                            <div className="text-cyan-400 font-semibold mb-2">{item.date}</div>

                                            {item.status === 'completed' && (
                                                <div className="text-green-400 text-sm">✓ Completado</div>
                                            )}
                                            {item.status === 'active' && (
                                                <motion.div
                                                    className="text-cyan-400 text-sm"
                                                    animate={{ opacity: [0.5, 1, 0.5] }}
                                                    transition={{ duration: 2, repeat: Infinity }}
                                                >
                                                    ● En progreso
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    </div>

                                    {/* Punto central */}
                                    <motion.div
                                        className={`absolute left-1/2 transform -translate-x-1/2 w-8 h-8 rounded-full border-4 border-gray-900 z-10 ${item.status === 'completed'
                                            ? 'bg-green-500'
                                            : item.status === 'active'
                                                ? 'bg-cyan-500'
                                                : 'bg-gray-600'
                                            }`}
                                        whileInView={{ scale: [0, 1.2, 1] }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.2 }}
                                    />
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* CTA Final */}
            <div className="relative py-32 px-4 sm:px-8 text-center">
                <motion.div
                    className="max-w-3xl mx-auto"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/30 rounded-3xl p-10 sm:p-12 backdrop-blur-sm">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                            Sé parte de la revolución agrícola
                        </h2>
                        <p className="text-lg sm:text-xl text-gray-300 mb-8">
                            Regístrate para ser notificado cuando lancemos la IA Predictiva
                        </p>

                        <motion.button
                            className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold px-8 sm:px-12 py-3 sm:py-4 rounded-xl text-lg shadow-2xl"
                            whileHover={{
                                scale: 1.05,
                                boxShadow: "0 0 40px rgba(6, 182, 212, 0.6)"
                            }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Notificarme del Lanzamiento
                        </motion.button>

                        <motion.div
                            className="mt-8 text-gray-400"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            <motion.span
                                className="text-cyan-400 font-bold text-2xl"
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                1,247
                            </motion.span>{" "}
                            agricultores ya están en la lista de espera
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}