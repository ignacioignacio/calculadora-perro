import React, { useState, useMemo } from 'react';

// Main App Component
export default function App() {
    // --- STATE MANAGEMENT ---
    const [path, setPath] = useState([]); 
    
    // --- PRICING CONFIGURATION ---
    const BASE_PRICES = {
        snack: 100000,
        storytelling: 300000,
    };

    // --- FLOW CONFIGURATION ---
    // Each option now has its own percentage. A value of 0 means it adds no cost.
    const budgetFlow = {
        start: {
            question: "Elige el tipo de contenido",
            type: 'radio',
            options: {
                snack: { label: "Snack Content", description: "Ideal para contar producto o servicio en distintas situaciones, para mostrar producto. Escenas sueltas con música y sobreimpresos. De creación rápida, edición simple y vida corta.", next: "snack_cantidad" },
                storytelling: { label: "Storytelling", description: "Ideal para contar historias. Máximo 30 segundos. Incluye actores, voz en off y hasta lipsync. Escenas concadenantes, de principio a fin. Requiere de más tiempo de ideación y creación.", next: "story_duracion" }
            }
        },
        snack_cantidad: {
            question: "Cantidad de piezas",
            type: 'radio',
            options: {
                snack_cantidad_1: { label: "1 pieza", percentage: 0, next: "snack_duracion" },
                snack_cantidad_2: { label: "2 piezas", percentage: 0.03, next: "snack_entrega" },
                snack_cantidad_3: { label: "3 piezas", percentage: 0.06, next: "snack_entrega" },
                snack_cantidad_custom: { label: "Otra cantidad:", isCustom: true, percentage_per_item: 0.03, next: "snack_entrega" }
            }
        },
        snack_entrega: {
            question: "Formato de entrega",
            type: 'radio',
            options: {
                snack_entrega_una: { label: "Todas de una", percentage: 0, next: "snack_duracion" },
                snack_entrega_periodos: { label: "Por períodos (ej: 1 x semana)", percentage: 0.03, next: "snack_duracion" }
            }
        },
        snack_duracion: {
            question: "Duración",
            type: 'radio',
            options: {
                snack_duracion_15: { label: "15 segundos", percentage: 0, next: "snack_adapt_duracion" },
                snack_duracion_30: { label: "30 segundos", percentage: 0.03, next: "snack_adapt_duracion" }
            }
        },
        snack_adapt_duracion: {
            question: "Adaptaciones de duración",
            type: 'radio',
            options: {
                snack_adapt_duracion_1: { label: "1 adaptación de duración", percentage: 0.03, next: "snack_formatos" },
                snack_adapt_duracion_2: { label: "2 adaptaciones de duración", percentage: 0.06, next: "snack_formatos" },
                snack_adapt_duracion_no: { label: "Sin adaptaciones de duración", percentage: 0, next: "snack_formatos" }
            }
        },
        snack_formatos: {
            question: "Formatos",
            type: 'radio',
            options: {
                snack_formatos_9_16: { label: "9:16", percentage: 0, next: "snack_adapt_formato" },
                snack_formatos_1_1_4_5: { label: "1:1 / 4:5", percentage: 0.03, next: "snack_adapt_formato" },
                snack_formatos_16_9: { label: "16:9", percentage: 0.03, next: "snack_adapt_formato" }
            }
        },
        snack_adapt_formato: {
            question: "Adaptaciones de formato",
            type: 'radio',
            options: {
                snack_adapt_formato_1: { label: "1 adaptación de formato", percentage: 0.03, next: "snack_voz_off" },
                snack_adapt_formato_2: { label: "2 adaptaciones de formato", percentage: 0.06, next: "snack_voz_off" },
                snack_adapt_formato_no: { label: "Sin adaptaciones de formato", percentage: 0, next: "snack_voz_off" }
            }
        },
        snack_voz_off: {
            question: "Voz en off (Banda musical incluída)",
            type: 'radio',
            options: {
                snack_voz_off_si: { label: "Con voz en off", percentage: 0.03, next: "snack_entrenamiento" },
                snack_voz_off_no: { label: "Sin voz en off", percentage: 0, next: "snack_entrenamiento" }
            }
        },
        snack_entrenamiento: {
            question: "Entrenamiento de producto",
            type: 'radio',
            options: {
                snack_entrenamiento_1: { label: "Un entrenamiento de producto", percentage: 0.03, next: "entrega_crudos" },
                snack_entrenamiento_2: { label: "Dos entrenamientos de producto", percentage: 0.06, next: "entrega_crudos" },
                snack_entrenamiento_no: { label: "Sin entrenamiento de producto", percentage: 0, next: "entrega_crudos" }
            }
        },
        story_duracion: {
            question: "Duración",
            type: 'radio',
            options: {
                story_duracion_15: { label: "15 segundos", percentage: 0, next: "story_adapt_duracion" },
                story_duracion_30: { label: "30 segundos", percentage: 0.03, next: "story_adapt_duracion" }
            }
        },
        story_adapt_duracion: {
            question: "Adaptaciones de duración",
            type: 'radio',
            options: {
                story_adapt_duracion_1: { label: "1 adaptación de duración", percentage: 0.03, next: "story_formatos" },
                story_adapt_duracion_2: { label: "2 adaptaciones de duración", percentage: 0.06, next: "story_formatos" },
                story_adapt_duracion_no: { label: "Sin adaptaciones de duración", percentage: 0, next: "story_formatos" }
            }
        },
        story_formatos: {
            question: "Formatos",
            type: 'radio',
            options: {
                story_formatos_9_16: { label: "9:16", percentage: 0, next: "story_adapt_formato" },
                story_formatos_1_1_4_5: { label: "1:1 / 4:5", percentage: 0.03, next: "story_adapt_formato" },
                story_formatos_16_9: { label: "16:9", percentage: 0.03, next: "story_adapt_formato" }
            }
        },
        story_adapt_formato: {
            question: "Adaptaciones de formato",
            type: 'radio',
            options: {
                story_adapt_formato_1: { label: "1 adaptación de formato", percentage: 0.03, next: "story_lipsync" },
                story_adapt_formato_2: { label: "2 adaptaciones de formato", percentage: 0.06, next: "story_lipsync" },
                story_adapt_formato_no: { label: "Sin adaptaciones de formato", percentage: 0, next: "story_lipsync" }
            }
        },
        story_lipsync: {
            question: "Lipsync (Voz en off y banda musical incluída)",
            type: 'radio',
            options: {
                story_lipsync_1: { label: "1 actor con lipsync", percentage: 0.03, next: "story_entrenamiento" },
                story_lipsync_2: { label: "2 actores con lipsync", percentage: 0.06, next: "story_entrenamiento" },
                story_lipsync_no: { label: "Sin lipsync", percentage: 0, next: "story_entrenamiento" }
            }
        },
        story_entrenamiento: {
            question: "Entrenamiento de producto",
            type: 'radio',
            options: {
                story_entrenamiento_1: { label: "Un entrenamiento de producto", percentage: 0.03, next: "story_actor_referencia" },
                story_entrenamiento_2: { label: "Dos entrenamientos de producto", percentage: 0.06, next: "story_actor_referencia" },
                story_entrenamiento_no: { label: "Sin entrenamiento de producto", percentage: 0, next: "story_actor_referencia" }
            }
        },
        story_actor_referencia: {
            question: "Actor referencia de movimientos",
            type: 'radio',
            options: {
                story_actor_referencia_si: { label: "Con actor de referencia", percentage: 0.03, next: "entrega_crudos" },
                story_actor_referencia_no: { label: "Sin actor de referencia", percentage: 0, next: "entrega_crudos" }
            }
        },
        entrega_crudos: {
            question: "Entrega de tomas crudas",
            type: 'radio',
            options: {
                entrega_crudos_si: { label: "Con entrega de tomas en crudo", percentage: 0.03, next: "guion_creativo" },
                entrega_crudos_no: { label: "Sin entrega de tomas en crudo", percentage: 0, next: "guion_creativo" }
            }
        },
        guion_creativo: {
            question: "Guión creativo",
            type: 'radio',
            options: {
                guion_creativo_si: { label: "Con guión creativo", percentage: 0.03, next: "concepto_creativo" },
                guion_creativo_no: { label: "Sin guión creativo", percentage: 0, next: "end" }
            }
        },
        concepto_creativo: {
            question: "Concepto creativo",
            type: 'radio',
            options: {
                concepto_creativo_si: { label: "Con concepto creativo", percentage: 0.03, next: "end" },
                concepto_creativo_no: { label: "Sin concepto creativo", percentage: 0, next: "end" }
            }
        },
        end: {
            isFinal: true
        }
    };
    
    // --- LOGIC & CALCULATIONS ---
    const currentStepId = useMemo(() => {
        if (path.length === 0) return 'start';
        const lastSelection = path[path.length - 1];
        const lastStep = budgetFlow[lastSelection.stepId];
        if (!lastStep || !lastStep.options || !lastStep.options[lastSelection.selection]) return 'end';
        return lastStep.options[lastSelection.selection].next;
    }, [path]);

    const currentStep = budgetFlow[currentStepId];
    
    const totalPrice = useMemo(() => {
        if (path.length === 0) return 0;

        const firstChoiceKey = path[0].selection;
        const basePrice = BASE_PRICES[firstChoiceKey] || 0;
        if (basePrice === 0) return 0;

        let total = basePrice;

        path.forEach(p => {
            if (p.stepId === 'start') return; 

            const stepOptions = budgetFlow[p.stepId].options;
            const selectedOption = stepOptions[p.selection];
            
            if (selectedOption.isCustom) {
                if (p.value > 1) {
                    const extraItems = p.value - 1;
                    total += basePrice * selectedOption.percentage_per_item * extraItems;
                }
            } else if (selectedOption.percentage) {
                total += basePrice * selectedOption.percentage;
            }
        });

        return Math.floor(total);
    }, [path, BASE_PRICES, budgetFlow]);

    // --- HANDLERS ---
    const handleSelection = (stepId, selection, value = null) => {
        const newPath = [...path, { stepId, selection, value }];
        setPath(newPath);
    };

    const handleJumpToStep = (stepIndex) => {
        // This is the corrected logic. It slices the path up to the clicked index,
        // so the app returns to that specific step for re-selection.
        setPath(path.slice(0, stepIndex));
    };
    
    const handleReset = () => {
        setPath([]);
    }
    
    // --- RENDER ---
    return (
        <div className="bg-[#ede8dc] text-[#2a378d] min-h-screen font-sans flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-4xl mx-auto mb-8 flex justify-between items-center">
                <h1 className="text-2xl sm:text-3xl text-left">¿Y cuánto me sale?</h1>
                <img src="hhttps://i.imgur.com/3V0wUeJ.png" alt="Logo de la agencia" className="h-10 rounded" />
            </header>
            
            <main className="w-full max-w-4xl mx-auto flex-grow">
                {/* Selection History / Breadcrumbs */}
                {currentStep && !currentStep.isFinal && (
                    <div className="mb-8 min-h-[40px] flex flex-wrap items-center gap-2">
                        {path.map((p, index) => {
                            const stepInfo = budgetFlow[p.stepId];
                            if (!stepInfo || !stepInfo.options) return null;
                            
                            const optionInfo = stepInfo.options[p.selection];
                            if (!optionInfo) return null;

                            let label = optionInfo.label;
                            if (optionInfo.isCustom && p.value) {
                                label = `${p.value} piezas`;
                            }

                            return (
                                <React.Fragment key={`${p.stepId}-${index}`}>
                                    <button 
                                        onClick={() => handleJumpToStep(index)}
                                        className="bg-[#2a378d]/10 text-[#2a378d] rounded-full px-3 py-1 text-sm hover:bg-[#2a378d]/20 transition-all"
                                    >
                                        {label}
                                    </button>
                                    {index < path.length - 1 && <span className="text-[#2a378d]">&rarr;</span>}
                                </React.Fragment>
                            );
                        })}
                    </div>
                )}

                {/* Current Step Display */}
                <div>
                    {currentStep && !currentStep.isFinal && (
                        <StepView 
                            key={currentStepId}
                            step={currentStep} 
                            stepId={currentStepId} 
                            onSelect={handleSelection} 
                        />
                    )}

                    {/* Final state view */}
                    {currentStep && currentStep.isFinal && (
                         <div className="text-left">
                            <h2 className="text-xl sm:text-2xl text-left">Resumen</h2>
                            <hr className="border-t border-[#2a378d]/50 my-6" />
                            <div className="space-y-2 text-lg">
                                {path.filter(p => !budgetFlow[p.stepId].options[p.selection].label.startsWith("Sin ")).map((p, index) => {
                                    const optionInfo = budgetFlow[p.stepId].options[p.selection];
                                    if (!optionInfo) return null;
                                    
                                    let label = optionInfo.label;
                                    if (optionInfo.isCustom && p.value) {
                                        label = `${p.value} piezas`;
                                    }
                                    
                                    const isFirst = p.stepId === 'start';
                                    return <p key={index} className={`${isFirst ? 'font-bold' : ''}`}>{label}</p>;
                                })}
                                
                                {(() => {
                                    const excludedItems = path
                                        .map(p => budgetFlow[p.stepId].options[p.selection])
                                        .filter(opt => opt.label.startsWith("Sin "))
                                        .map(opt => opt.label.substring(4).toLowerCase());

                                    if (excludedItems.length > 0) {
                                        return (
                                            <p className="text-base mt-4">
                                                <span className="font-bold">No incluye:</span> {excludedItems.join(', ')}.
                                            </p>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                            <p className="italic mt-8 text-base text-[#2a378d]/80">
                                Esta es una idea de presupuesto, los margenes pueden variar a la hora de ponerse en contacto definitivamente con nosotros. Tomelo como una guia, por favor.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {/* Sticky Footer for Total Price */}
            <footer className="sticky bottom-0 left-0 right-0 bg-[#ede8dc]/80 backdrop-blur-sm mt-8 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 lg:-mx-8 lg:-mb-8 p-4 sm:p-5 border-t border-[#2a378d]/50">
                <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
                    <span className="text-lg sm:text-xl">
                        {currentStep && currentStep.isFinal ? "Total Final" : "Total Parcial"}
                    </span>
                    <span className="text-xl sm:text-2xl text-[#2a378d]">
                        ${new Intl.NumberFormat('es-AR').format(totalPrice)}
                    </span>
                </div>
            </footer>
            
            {/* Final Reset Button Area */}
            {currentStep && currentStep.isFinal && (
                 <div className="bg-[#2a378d] w-full p-4 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 lg:-mx-8 lg:-mb-8 mt-8">
                    <div className="w-full max-w-4xl mx-auto text-center">
                        <button onClick={handleReset} className="text-white text-lg hover:underline">
                            Empezar de nuevo
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// Component to render a single step
function StepView({ step, stepId, onSelect }) {
    const [selection, setSelection] = useState(null);
    const [customAmount, setCustomAmount] = useState("");

    const isNextDisabled = !selection || (selection === 'snack_cantidad_custom' && (parseInt(customAmount) <= 1 || isNaN(parseInt(customAmount))));

    const handleConfirmSelection = () => {
        if (isNextDisabled) return;

        if (selection === 'snack_cantidad_custom') {
            onSelect(stepId, selection, parseInt(customAmount));
        } else {
            onSelect(stepId, selection);
        }
    };

    return (
        <div className="animate-fade-in">
            <h2 className="text-xl sm:text-2xl text-left">{step.question}</h2>
            <hr className="border-t border-[#2a378d]/50 my-6" />
            
            <div className="flex flex-col gap-4">
                {Object.entries(step.options).map(([key, option]) => (
                    <label 
                        key={key} 
                        className={`block w-full text-left p-4 rounded-lg cursor-pointer transition-all duration-200 ${selection === key ? 'bg-[#2a378d]/10' : 'hover:bg-[#2a378d]/5'}`}
                    >
                        <input
                            type="radio"
                            name={stepId}
                            value={key}
                            className="sr-only"
                            onChange={() => setSelection(key)}
                        />
                        <div className="flex items-center gap-4">
                            <span className="text-lg">{option.label}</span>
                            {option.isCustom && (
                                <input 
                                    type="number"
                                    min="2"
                                    placeholder="ej: 7"
                                    value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    onClick={() => setSelection(key)}
                                    className="w-24 p-1 rounded-md border border-[#2a378d]/50 bg-transparent text-center focus:ring-1 focus:ring-[#2a378d]"
                                />
                            )}
                        </div>
                        {option.description && (
                            <p className="text-sm text-[#2a378d]/80 mt-1 pr-4">
                                {option.description}
                            </p>
                        )}
                    </label>
                ))}
            </div>

            <div className="mt-8 text-left">
                <button
                    onClick={handleConfirmSelection}
                    disabled={isNextDisabled}
                    className="bg-[#2a378d] text-white rounded-full p-3 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all transform hover:scale-110 disabled:hover:scale-100"
                    aria-label="Siguiente paso"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#ede8dc">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </div>
            
            <style>{`
                .animate-fade-in {
                    animation: fadeIn 0.5s ease-in-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
}

