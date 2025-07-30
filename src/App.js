import React, { useState, useMemo } from 'react';

export default function App() {
  const [path, setPath] = useState([]);

  const BASE_PRICES = {
    snack: 400000,
    storytelling: 1200000,
  };

  const budgetFlow = {
    start: {
      question: "Elegí el tipo de contenido",
      type: 'radio',
      options: {
        snack: { label: "Snack Content", next: "snack_cantidad" },
        storytelling: { label: "Storytelling", next: "story_duracion" }
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
      question: "Lipsync",
      type: 'radio',
      options: {
        story_lipsync_1: { label: "1 actor", percentage: 0.35, next: "story_entrenamiento" },
        story_lipsync_2: { label: "2 actores", percentage: 0.70, next: "story_entrenamiento" },
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
        guion_creativo_si: { label: "Con guión", fixedAmount: 50000, next: "concepto_creativo" },
        guion_creativo_no: { label: "Sin guión", percentage: 0, next: "concepto_creativo" }
      }
    },
    concepto_creativo: {
      question: "Concepto creativo",
      type: 'radio',
      options: {
        concepto_creativo_si: { label: "Con concepto", fixedAmount: 100000, next: "end" },
        concepto_creativo_no: { label: "Sin concepto", percentage: 0, next: "end" }
      }
    },
    end: { isFinal: true }
  };

  const currentStepId = useMemo(() => {
    if (path.length === 0) return 'start';
    const last = path[path.length - 1];
    const step = budgetFlow[last.stepId];
    const option = step?.options?.[last.selection];
    return option?.next || 'end';
  }, [path]);

  const totalPrice = useMemo(() => {
    if (path.length === 0) return 0;
    const first = path[0].selection;
    const base = BASE_PRICES[first] || 0;
    let total = base;
    path.forEach(p => {
      if (p.stepId === 'start') return;
      const opt = budgetFlow[p.stepId]?.options?.[p.selection];
      if (!opt) return;
      if (typeof opt.fixedAmount === 'number') total += opt.fixedAmount;
      if (typeof opt.percentage === 'number') total += base * opt.percentage;
    });
    return Math.floor(total);
  }, [path]);

  // --- HANDLERS ---
  const handleSelection = (stepId, selection) => {
    const newPath = [...path, { stepId, selection }];
    setPath(newPath);
  };

  const handleJumpToStep = (stepIndex) => {
    setPath(path.slice(0, stepIndex));
  };

  const handleReset = () => {
    setPath([]);
  };

  // --- RENDER ---
  const currentStep = budgetFlow[currentStepId];
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">¿Y cuánto me sale?</h1>

      {currentStep && !currentStep.isFinal && (
        <div className="mb-4">
          <h2 className="text-xl mb-2">{currentStep.question}</h2>
          <div className="flex flex-col gap-2">
            {Object.entries(currentStep.options).map(([key, opt]) => (
              <button
                key={key}
                onClick={() => handleSelection(currentStepId, key)}
                className="px-4 py-2 rounded border border-gray-300 text-left hover:bg-gray-100"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {currentStep && currentStep.isFinal && (
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-2">Resumen</h2>
          <ul className="list-disc list-inside">
            {path.map((p, i) => {
              const label = budgetFlow[p.stepId]?.options?.[p.selection]?.label;
              return label ? <li key={i}>{label}</li> : null;
            })}
          </ul>
          <button
            onClick={handleReset}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Empezar de nuevo
          </button>
        </div>
      )}

      <div className="mt-8 text-right text-xl">
        {currentStep?.isFinal ? "Total Final" : "Total Parcial"}: ${new Intl.NumberFormat('es-AR').format(totalPrice)}
      </div>
    </div>
  );
}
