import React, { useState, useMemo } from 'react';

// Main App Component
export default function App() {
  const [path, setPath] = useState([]);

  // Base prices
  const BASE_PRICES = { snack: 400000, storytelling: 1200000 };

  // Budget flow configuration
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

  // Determine current step
  const currentStep = useMemo(() => {
    if (path.length === 0) return budgetFlow.start;
    const last = path[path.length - 1];
    const step = budgetFlow[last.stepId];
    const opt = step.options[last.selection];
    return budgetFlow[opt.next];
  }, [path]);

  // Calculate total price
  const totalPrice = useMemo(() => {
    if (path.length === 0) return 0;
    const base = BASE_PRICES[path[0].selection] || 0;
    return Math.floor(
      path.reduce((sum, p) => {
        const opt = budgetFlow[p.stepId].options[p.selection];
        let added = 0;
        if (opt.fixedAmount) added += opt.fixedAmount;
        if (opt.percentage) added += base * opt.percentage;
        return sum + added;
      }, base)
    );
  }, [path]);

  // Handlers
  const handleSelection = (stepId, selection) => setPath([...path, { stepId, selection }]);
  const handleJumpToStep = idx => setPath(path.slice(0, idx));
  const handleReset = () => setPath([]);

  // Render
  return (
    <div className="bg-[#ede8dc] text-[#2a378d] min-h-screen font-sans flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl">¿Y cuánto me sale?</h1>
        <img src="https://i.imgur.com/3V0wUeJ.png" alt="Logo" className="h-10 rounded" />
      </header>
      <main className="w-full max-w-4xl mx-auto flex-grow">
        {/* Breadcrumbs */}
        {path.length > 0 && !currentStep.isFinal && (
          <div className="mb-8 min-h-[40px] flex flex-wrap items-center gap-2">
            {path.map((p, i) => {
              const label = budgetFlow[p.stepId].options[p.selection].label;
              return (
                <React.Fragment key={i}>
                  <button
                    onClick={() => handleJumpToStep(i)}
                    className="bg-[#2a378d]/10 text-[#2a378d] rounded-full px-3 py-1 text-sm hover:bg-[#2a378d]/20"
                  >
                    {label}
                  </button>
                  {i < path.length - 1 && <span className="text-[#2a378d]">→</span>}
                </React.Fragment>
              );
            })}
          </div>
        )}
        {/* Step view */}
        {!currentStep.isFinal ? (
          <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl mb-2">{currentStep.question}</h2>
            <hr className="border-t border-[#2a378d]/50 my-4" />
            <div className="grid gap-4">
              {Object.entries(currentStep.options).map(([key, opt]) => (
                <button
                  key={key}
                  onClick={() => handleSelection(currentStep.nextStepId || currentStepId, key)}
                  className="block w-full text-left p-4 rounded-lg hover:bg-[#2a378d]/10 transition"
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-left">
            <h2 className="text-xl sm:text-2xl">Resumen</h2>
            <hr className="border-t border-[#2a378d]/50 my-4" />
            <div className="space-y-2 text-lg">
              {path.filter(p => !budgetFlow[p.stepId].options[p.selection].label.startsWith("Sin ")).map((p, i) => (
                <p key={i}>{budgetFlow[p.stepId].options[p.selection].label}</p>
              ))}
              {(() => {
                const excluded = path
                  .map(p => budgetFlow[p.stepId].options[p.selection])
                  .filter(opt => opt.label.startsWith("Sin "))
                  .map(opt => opt.label.replace(/^Sin /, ''));
                return excluded.length > 0 ? <p className="mt-2"><strong>No incluye:</strong> {excluded.join(', ')}</p> : null;
              })()}
            </div>
            <p className="italic mt-6 text-[#2a378d]/80">Esta es una guía de presupuesto, los márgenes pueden variar.</p>
          </div>
        )}
      </main>
      <footer className="sticky bottom-0 bg-[#ede8dc]/80 backdrop-blur-sm p-4 border-t border-[#2a378d]/50">
        <div className="max-w-4xl mx-auto flex justify-between">
          <span className="text-lg">{currentStep.isFinal ? 'Total Final' : 'Total Parcial'}</span>
          <span className="text-xl">${new Intl.NumberFormat('es-AR').format(totalPrice)}</span>
        </div>
      </footer>
      {currentStep.isFinal && (
        <div className="bg-[#2a378d] p-4 text-center">
          <button onClick={handleReset} className="text-white hover:underline">Empezar de nuevo</button>
        </div>
      )}
      <style jsx>{`
        .animate-fade-in { animation: fadeIn 0.5s ease; }
        @keyframes fadeIn { from { opacity:0; transform: translateY(10px);} to { opacity:1; transform: translateY(0);} }
      `}</style>
    </div>
  );
}
