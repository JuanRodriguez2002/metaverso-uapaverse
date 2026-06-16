import type { StandData } from '../types';

export const defaultStands: StandData[] = [
  {
    id: 'ari-ai',
    title: 'Asistente ARI',
    shortType: 'ia',
    companyLogo: '',
    shortDescription: 'Asistente de inteligencia artificial',
    longDescription:
      'ARI es un asistente conversacional para orientar a los visitantes dentro de la feria virtual y responder preguntas sobre cada proyecto.',
    videoUrl: '',
    images: [],
    resources: ['Next.js', 'React', 'Gemini', 'Web Speech API'],
    position: [-8, 1.5, -8]
  },
  {
    id: 'uapaverse',
    title: 'UAPAVERSE',
    shortType: 'metaverso',
    companyLogo: '',
    shortDescription: 'Entorno 3D interactivo',
    longDescription:
      'UAPAVERSE presenta una experiencia 3D donde los visitantes pueden recorrer stands, explorar recursos y hablar con una IA contextual.',
    videoUrl: '',
    images: [],
    resources: ['Three.js', '@react-three/fiber', '@react-three/drei', 'Zustand'],
    position: [0, 1.5, -14]
  },
  {
    id: 'webgl-stand',
    title: 'Stand WebGL',
    shortType: '3d',
    companyLogo: '',
    shortDescription: 'Visualizacion inmersiva',
    longDescription:
      'Este stand demuestra como WebGL permite construir escenarios interactivos directamente en el navegador con buen rendimiento.',
    videoUrl: '',
    images: [],
    resources: ['WebGL', 'React', 'TypeScript'],
    position: [8, 1.5, -8]
  }
];
