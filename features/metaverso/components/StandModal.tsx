'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Layers, Mic, MicOff, Play, X } from 'lucide-react';

import { useGeminiVoice } from '../hooks/useGeminiVoice';
import { useMetaversoStore } from '../hooks/useMetaversoStore';

export default function StandModal() {
  const isModalOpen = useMetaversoStore((state) => state.isModalOpen);
  const setIsModalOpen = useMetaversoStore((state) => state.setIsModalOpen);
  const activeStand = useMetaversoStore((state) => state.activeStand);
  const standContext = activeStand
    ? `${activeStand.title}: ${activeStand.longDescription}. Tecnologias: ${activeStand.resources.join(', ')}`
    : '';
  const { isListening, transcript, aiResponse, toggleListening } = useGeminiVoice(standContext);

  return (
    <AnimatePresence>
      {isModalOpen && activeStand ? (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 text-white backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex h-[85vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/50 p-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-sky-400">
                  {activeStand.shortDescription}
                </span>
                <h2 className="mt-1 flex items-center gap-3 text-2xl font-black text-white">
                  {activeStand.title}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-full bg-slate-800 p-2 transition-colors hover:bg-red-500/20 hover:text-red-400"
                aria-label="Cerrar modal del stand"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-6 overflow-y-auto p-6 md:grid-cols-2">
              <div className="flex flex-col gap-4">
                <div className="group relative aspect-video w-full overflow-hidden rounded-xl border border-slate-800 bg-black">
                  {activeStand.videoUrl ? (
                    <video
                      className="h-full w-full object-cover"
                      controls
                      src={activeStand.videoUrl}
                      title={`Video demostrativo de ${activeStand.title}`}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950">
                      <Play
                        size={48}
                        className="cursor-pointer text-sky-500 transition-transform group-hover:scale-110"
                      />
                      <p className="absolute bottom-4 left-4 text-xs text-slate-400">
                        Video demostrativo del proyecto
                      </p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {activeStand.images.length > 0
                    ? activeStand.images.map((imageUrl, index) => (
                        <img
                          key={`${imageUrl}-${index}`}
                          src={imageUrl}
                          alt={`Galeria ${index + 1} de ${activeStand.title}`}
                          className="aspect-video rounded-lg border border-slate-700 bg-slate-800 object-cover transition-colors hover:border-sky-500"
                        />
                      ))
                    : Array.from({ length: 3 }).map((_, index) => (
                        <div
                          key={index}
                          className="aspect-video rounded-lg border border-slate-700 bg-slate-800"
                          aria-label={`Imagen pendiente ${index + 1}`}
                        />
                      ))}
                </div>
              </div>

              <div className="flex flex-col justify-between gap-6">
                <div>
                  <h4 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Sobre el Proyecto
                  </h4>
                  <p className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 text-sm leading-relaxed text-slate-300">
                    {activeStand.longDescription}
                  </p>

                  <div className="mt-4">
                    <h5 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-slate-400">
                      <Layers size={14} /> Tecnologias Utilizadas
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {activeStand.resources.map((resource) => (
                        <span
                          key={resource}
                          className="rounded-md border border-slate-700 bg-slate-800 px-2.5 py-1 text-xs text-sky-400"
                        >
                          {resource}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4 rounded-2xl border border-sky-900/50 bg-gradient-to-b from-sky-950/30 to-slate-950 p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${
                          isListening ? 'animate-pulse bg-emerald-500' : 'bg-sky-500'
                        }`}
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">ARI - ASISTENTE IA</h4>
                        <p className="text-xs text-slate-400">Haz clic para hablar</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={toggleListening}
                      className={`rounded-full p-4 font-bold shadow-md transition-all ${
                        isListening
                          ? 'animate-pulse bg-red-500 text-white shadow-red-500/20'
                          : 'bg-sky-500 text-slate-950 shadow-sky-500/10 hover:bg-sky-400'
                      }`}
                      aria-label={isListening ? 'Detener reconocimiento de voz' : 'Iniciar reconocimiento de voz'}
                    >
                      {isListening ? <MicOff size={20} /> : <Mic size={20} />}
                    </button>
                  </div>

                  <div className="min-h-[60px] space-y-2 rounded-lg border border-slate-800 bg-slate-900/80 p-3 text-xs">
                    {transcript ? <p className="italic text-slate-400">Tu: &quot;{transcript}&quot;</p> : null}
                    {aiResponse ? (
                      <p className="font-medium text-sky-300">ARI: {aiResponse}</p>
                    ) : (
                      <p className="pt-2 text-center text-slate-500">
                        Preguntame lo que quieras sobre el stand...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
