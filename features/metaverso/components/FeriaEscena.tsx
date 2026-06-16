'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

import { useMetaversoStore } from '../hooks/useMetaversoStore';
import StandModal from './StandModal';

const CanvasMetaverso = dynamic(() => import('./CanvasMetaverso'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-sm font-medium tracking-wide text-white">
      Inicializando motores WebGL...
    </div>
  )
});

export default function FeriaEscena() {
  const activeStand = useMetaversoStore((state) => state.activeStand);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
        Cargando Entorno Virtual 3D...
      </div>
    );
  }

  return (
    <div className="relative h-screen w-full bg-black">
      <CanvasMetaverso />
      <StandModal />

      <div className="pointer-events-none absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-md border border-blue-400 bg-blue-600/90 px-12 py-3 text-lg font-bold uppercase tracking-wider text-white backdrop-blur-sm">
        Feria Tecnologica Virtual
      </div>

      {activeStand && (
        <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2 animate-bounce rounded-xl border border-sky-500 bg-slate-900/90 px-6 py-4 text-center text-white shadow-lg backdrop-blur-md">
          <p className="text-sm font-semibold uppercase text-sky-400">Estas frente a:</p>
          <h3 className="text-xl font-bold">{activeStand.title}</h3>
          <p className="mt-1 text-xs text-slate-400">
            Presiona{' '}
            <span className="pointer-events-auto rounded bg-sky-500 px-2 py-0.5 font-bold text-slate-950">
              E
            </span>{' '}
            para interactuar y hablar con la IA
          </p>
        </div>
      )}
    </div>
  );
}
