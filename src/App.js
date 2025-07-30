import React, { useState, useMemo } from 'react';

// Main App Component
export default function App() {
  // --- STATE MANAGEMENT ---
  const [path, setPath] = useState([]);

  // --- PRICING CONFIGURATION ---
  const BASE_PRICES = {
    snack: 370000,
    storytelling: 910000,
  };

  // --- FLOW CONFIGURATION ---
  const budgetFlow = {
    start: {
      question: "Elegí el tipo de contenido",
      type: 'radio',
      options: {
        snack: { label: "Snack Content", description: "Contenido rápido y directo.", next: "snack_cantidad" },
        storytelling: { label: "Storytelling", description: "Historias más elaboradas.", next: "story_duracion" }
      }
    },

    snack_cantidad: {
      question: "Cantidad de piezas",
      type: 'radio',
      options: {
        snack_cantidad_1: { label: "1 pieza", percentage: 0, next: "snack_entrega" },
        snack_cantidad_2: { label: "2 piezas", percentage: -0.07, next: "snack_entrega" },
        snack_cantidad_3: { label: "3 piezas", percentage: -0.10, next: "snack_entrega" },
        snack_cantidad_4: { label: "4 piezas", percentage: -0.12, next: "snack_entrega" }
      }
    },

    snack_entrega: {
      question: "Formato de entrega",
      type: 'radio',
      options: {
        snack_entrega_una: { label: "Misma fecha", percentage: 0, next: "snack_duracion" },
        snack_entrega_periodos: { label: "Por períodos", percentage: 0, next: "snack_duracion" }
      }
    },

    snack_duracion: {
      question: "Duración",
      type: 'radio',
      options: {
        snack_duracion_15: { label: "15 segundos", percentage: 0, next: "snack_adapt_duracion" },
        snack_duracion_30: { label: "30 segundos", percentage: 0, next: "snack_adapt_duracion" }
      }
    },

    snack_adapt_duracion: {
      question: "Adaptaciones de duración",
      type: 'radio',
      options: {
        snack_adapt_duracion_1: { label: "1 adaptación", percentage: 0.15, next: "snack_formatos" },
        snack_adapt_duracion_2: { label: "2 adaptaciones", percentage: 0.30, next: "snack_formatos" },
        snack_adapt_duracion_no: { label: "Sin adaptaciones", percentage: 0, next: "snack_formatos" }
      }
    },

    snack_formatos: {
      question: "Formatos",
      type: 'radio',
      options: {
        snack_formatos_9_16: { label: "9:16", percentage: 0, next: "snack_adapt_formato" },
        snack_formatos_1_1: { label: "1:1 / 4:5", percentage: 0, next: "snack_adapt_formato" },
        snack_formatos_16_9: { label: "16:9", percentage: 0, next: "snack_adapt_formato" }
      }
    },

    snack_adapt_formato: {
      question: "Adaptaciones de formato",
      type: 'radio',
      options: {
        snack_adapt_formato_1: { label: "1 adaptación", percentage: 0.15, next: "snack_voz_off" },
        snack_adapt_formato_2: { label: "2 adaptaciones", percentage: 0.30, next: "snack_voz_off" },
        snack_adapt_formato_no: { label: "Sin adaptaciones", percentage: 0, next: "snack_voz_off" }
      }
    },

    snack_voz_off: {
      question: "Voz en off (IA + música)",
      type: 'radio',
      options: {
        snack_voz_off_si: { label: "Con voz en off", percentage: 0.05, next: "snack_entrenamiento" },
        snack_voz_off_no: { label: "Sin voz en off", percentage: 0, next: "snack_entrenamiento" }
      }
    },

    snack_entrenamiento: {
      question: "Entrenamiento de producto",
      type: 'radio',
      options: {
        snack_entrenamiento_1: { label: "1 sesión", percentage: 0.05, next: "entrega_crudos" },
        snack_entrenamiento_no: { label: "Sin entrenamiento", percentage: 0, next: "entrega_crudos" }
      }
    },

    story_duracion: {
      question: "Duración",
      type: 'radio',
      options: {
        story_duracion_15: { label: "15 segundos", percentage: 0, next: "story_adapt_duracion" },
        story_duracion_30: { label: "30 segundos", percentage: 0, next: "story_adapt_duracion" }
      }
    },

    story_adapt_duracion: {
      question: "Adaptaciones de duración",
      type: 'radio',
      options: {
        story_adapt_duracion_1: { label: "1 adaptación", percentage: 0.15, next: "story_formatos" },
        story_adapt_duracion_2: { label: "2 adaptaciones", percentage: 0.30, next: "story_formatos" },
        story_adapt_duracion_no: { label: "Sin adaptaciones", percentage: 0, next: "story_formatos" }
      }
    },

    story_formatos: {
      question: "Formatos",
      type: 'radio',
      options: {
        story_formatos_9_16: { label: "9:16", percentage: 0, next: "story_adapt_formato" },
        story_formatos_1_1: { label: "1:1 / 4:5", percentage: 0, next: "story_adapt_formato" },
        story_formatos_16_9: { label: "16:9", percentage: 0, next: "story_adapt_formato" }
      }
    },

    story_adapt_formato: {
      question: "Adaptaciones de formato",
      type: 'radio',
      options: {
        story_adapt_formato_1: { label: "1 adaptación", percentage: 0.15, next: "story_lipsync" },
        story_adapt_formato_2: { label: "2 adaptaciones", percentage: 0.30, next: "story_lipsync" },
        story_adapt_formato_no: { label: "Sin adaptaciones", percentage: 0, next: "story_lipsync" }
      }
    },

    story_lipsync: {
      question: "Lipsync (por actor)",
      type: 'radio',
      options: {
        story_lipsync_1: { label: "1 actor", percentage: 0.35, next: "story_entrenamiento" },
        story_lipsync_2: { label: "2 actores", percentage: 0.35*2, next: "story_entrenamiento" },
        story_lipsync_no: { label: "Sin lipsync", percentage: 0, next: "story_entrenamiento" }
      }
    },

    story_entrenamiento: {
      question: "Entrenamiento de producto",
      type: 'radio',
      options: {
        story_entrenamiento_1: { label: "1 sesión", percentage: 0.06, next: "story_actor_referencia" },
        story_entrenamiento_no: { label: "Sin entrenamiento", percentage: 0, next: "story_actor_referencia" }
      }
    },

    story_actor_referencia: {
      question: "Actor referencia de movimientos",
      type: 'radio',
      options: {
        story_actor_referencia_si: { label: "Con actor", percentage: 0.35, next: "entrega_crudos" },
        story_actor_referencia_no: { label: "Sin actor", percentage: 0, next: "entrega_crudos" }
      }
    },

    entrega_crudos: {
      question: "Entrega de tomas crudas",
      type: 'radio',
      options: {
        entrega_crudos_si: { label: "Con crudos", percentage: 0.05, next: "guion_creativo" },
        entrega_crudos_no: { label: "Sin crudos", percentage: 0, next: "guion_creativo" }
      }
    },

    guion_creativo: {
      question: "Guión creativo",
      type: 'radio',
      options: {
        guion_creativo_si: { label: "Con guión creativo", fixedAmount: 50000, next: "concepto_creativo" },
        guion_creativo_no: { label: "Sin guión", percentage: 0, next: "concepto_creativo" }
      }
    },

    concepto_creativo: {
      question: "Concepto creativo",
      type: 'radio',
      options: {
        concepto_creativo_si: { label: "Con concepto creativo", fixedAmount: 100000, next: "end" },
        concepto_creativo_no: { label: "Sin concepto", percentage: 0, next: "end" }
      }
    },

    end: { isFinal: true }
  };

  // --- LOGIC & CALCULATIONS ---
  const currentStepId = useMemo(() => {
    if (path.length === 0) return 'start';
    const last = path[path.length - 1];
    const step = budgetFlow[last.stepId];
    if (!step) return 'end';
    const opt = step.options[last.selection];
    return (opt && opt.next) || 'end';
  }, [path]);

  const totalPrice = useMemo(() => {
    if (path.length === 0) return 0;
    const first = path[0].selection;
    const base = BASE_PRICES[first] || 0;
    let total = base;
    path.forEach(p => {
      if (p.stepId === 'start') return;
      const opt = budgetFlow[p.stepId].options[p.selection];
      if (opt.fixedAmount) total += opt.fixedAmount;
      if (typeof opt.percentage === 'number') total += base * opt.percentage;
    });
    return Math.floor(total);
  }, [path]);

  // ... Renders and handlers unchanged
}
