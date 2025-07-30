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
            question: "¡Hola! Elegí un tipo de contenido audiovisual a presupuestar",
            type: 'radio',
            options: {
                snack: { label: "Snack Content", description: "Ideas para mostrar producto/servicios, situaciones de consumo/uso y contar novedades. De producción rápida, edición simple y vida corta.", next: "snack_cantidad" },
                storytelling: { label: "Storytelling", description: "Ideal para contar historias y construir marca. 30” máximo. Puede incluir lipsync, escenarios reales, voz en off y movimientos protagonizados por actores reales para mayor realismo. Mayor vida útil.", next: "story_duracion" }
            }
        },
        snack_cantidad: {
            question: "Cantidad de piezas",
            type: 'radio',
            options: {
                snack_cantidad_1: { label: "1 pieza", percentage: 0, next: "snack_duracion" },
                snack_cantidad_2: { label: "2 piezas", percentage: 0.8, next: "snack_duracion" },
                snack_cantidad_3: { label: "3 piezas", percentage: 0.7, next: "snack_duracion" },
                snack_cantidad_custom: { label: "Otra cantidad:", isCustom: true, percentage_per_item: 0.6, next: "snack_duracion" }
            }
        },
        snack_duracion: {
            question: "Duración",
            type: 'radio',
            options: {
                snack_duracion_15: { label: "15 segundos", percentage: 0, next: "snack_adapt_duracion" },
                snack_duracion_30: { label: "30 segundos", percentage: 0.25, next: "snack_adapt_duracion" }
            }
        },
        snack_adapt_duracion: {
            question: "Reducciones",
            clarification: "Menores a la duración elegida en el punto anterior.",
            type: 'radio',
            options: {
                snack_adapt_duracion_1: { label: "1 reducción", percentage: 0.15, next: "snack_formatos" },
                snack_adapt_duracion_2: { label: "2 reducciones", percentage: 0.1, next: "snack_formatos" },
                snack_adapt_duracion_no: { label: "Sin reducciones", percentage: 0, next: "snack_formatos" }
            }
        },
        snack_formatos: {
            question: "Formatos",
            type: 'radio',
            options: {
                snack_formatos_9_16: { label: "9:16", percentage: 0, next: "snack_adapt_formato" },
                snack_formatos_1_1_4_5: { label: "1:1 / 4:5", percentage: 0, next: "snack_adapt_formato" },
                snack_formatos_16_9: { label: "16:9", percentage: 0, next: "snack_adapt_formato" }
            }
        },
        snack_adapt_formato: {
            question: "Adaptaciones de formato",
            isDynamic: true,
            type: 'radio',
            options: {
                snack_adapt_formato_1: { label: "Una adaptación", percentage: 0.15, next: "snack_voz_off" },
                snack_adapt_formato_2: { label: "Dos adaptaciones", percentage: 0.15, next: "snack_voz_off" },
                snack_adapt_formato_no: { label: "Sin adaptaciones de formato", percentage: 0, next: "snack_voz_off" }
            }
        },
        snack_voz_off: {
            question: "Locución IA",
            type: 'radio',
            options: {
                snack_voz_off_si: { label: "Con locución", percentage: 0.5, next: "snack_entrenamiento" },
                snack_voz_off_no: { label: "Sin locución", percentage: 0, next: "snack_entrenamiento" }
            }
        },
        snack_entrenamiento: {
            question: "Inclusión de producto",
            type: 'radio',
            options: {
                snack_entrenamiento_1: { label: "Un producto", percentage: 0.5, next: "guion_creativo" },
                snack_entrenamiento_2: { label: "Dos productos", percentage: 0.1, next: "guion_creativo" },
                snack_entrenamiento_no: { label: "Sin inclusión de producto", percentage: 0, next: "guion_creativo" }
            }
        },
        story_duracion: {
            question: "Duración",
            type: 'radio',
            options: {
                story_duracion_15: { label: "15 segundos", percentage: 0, next: "story_adapt_duracion" },
                story_duracion_30: { label: "30 segundos", percentage: 0.2, next: "story_adapt_duracion" }
            }
        },
        story_adapt_duracion: {
            question: "Reducciones",
            clarification: "Menores a la duración elegida en el punto anterior.",
            type: 'radio',
            options: {
                story_adapt_duracion_1: { label: "1 reducción", percentage: 0.15, next: "story_formatos" },
                story_adapt_duracion_2: { label: "2 reducciones", percentage: 0.1, next: "story_formatos" },
                story_adapt_duracion_no: { label: "Sin reducciones", percentage: 0, next: "story_formatos" }
            }
        },
        story_formatos: {
            question: "Formatos",
            type: 'radio',
            options: {
                story_formatos_9_16: { label: "9:16", percentage: 0, next: "story_adapt_formato" },
                story_formatos_1_1_4_5: { label: "1:1 / 4:5", percentage: 0, next: "story_adapt_formato" },
                story_formatos_16_9: { label: "16:9", percentage: 0, next: "story_adapt_formato" }
            }
        },
        story_adapt_formato: {
            question: "Adaptaciones de formato",
            isDynamic: true,
            type: 'radio',
            options: {
                story_adapt_formato_1: { label: "Una adaptación", percentage: 0.15, next: "story_lipsync" },
                story_adapt_formato_2: { label: "Dos adaptaciones", percentage: 0.1, next: "story_lipsync" },
                story_adapt_formato_no: { label: "Sin adaptaciones de formato", percentage: 0, next: "story_lipsync" }
            }
        },
        story_lipsync: {
            question: "Lipsync",
            clarification: "Voz en off y banda musical incluida.",
            type: 'radio',
            options: {
                story_lipsync_1: { label: "1 actor con lipsync", percentage: 0.5, next: "story_entrenamiento" },
                story_lipsync_2: { label: "2 actores con lipsync", percentage: 0.5, next: "story_entrenamiento" },
                story_lipsync_no: { label: "Sin lipsync", percentage: 0, next: "story_entrenamiento" }
            }
        },
        story_entrenamiento: {
            question: "Inclusión de producto",
            type: 'radio',
            options: {
                story_entrenamiento_1: { label: "Un producto", percentage: 0.1, next: "story_actor_referencia" },
                story_entrenamiento_2: { label: "Dos productos", percentage: 0.2, next: "story_actor_referencia" },
                story_entrenamiento_no: { label: "Sin inclusión de producto", percentage: 0, next: "story_actor_referencia" }
            }
        },
        story_actor_referencia: {
            question: "Actor referencia de movimientos",
            type: 'radio',
            options: {
                story_actor_referencia_si: { label: "Con actor de referencia", percentage: 0.5, next: "guion_creativo" },
                story_actor_referencia_no: { label: "Sin actor de referencia", percentage: 0, next: "guion_creativo" }
            }
        },
        guion_creativo: {
            question: "Guión creativo",
            type: 'radio',
            options: {
                guion_creativo_si: { label: "Con guión creativo", fixedPrice: { snack: 60000, storytelling: 150000 }, next: "end" },
                guion_creativo_no: { label: "Sin guión creativo", percentage: 0, next: "end" }
            }
        },
        end: {
            isFinal: true
        }
    };
    
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
            } else if (selectedOption.fixedPrice) {
                total += selectedOption.fixedPrice[firstChoiceKey] || 0;
            }
        });
        return Math.floor(total);
    }, [path, BASE_PRICES, budgetFlow]);

    const handleSelection = (stepId, selection, value = null) => {
        const newPath = [...path, { stepId, selection, value }];
        setPath(newPath);
    };

    const handleJumpToStep = (stepIndex) => {
        setPath(path.slice(0, stepIndex));
    };
    
    const handleReset = () => {
        setPath([]);
    }
    
    const today = new Date();
    const formattedDate = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;

    return (
        <div className="bg-[#ede8dc] text-[#2a378d] min-h-screen font-sans flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="w-full max-w-4xl mx-auto mb-8 flex justify-between items-center">
                <div></div>
                <img src="https://i.imgur.com/3V0wUeJ.png" alt="Perro Con Dos Colas" className="h-10 rounded" />
            </header>
            
            <main className="w-full max-w-4xl mx-auto flex-grow">
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
                                <button 
                                    key={`${p.stepId}-${index}`}
                                    onClick={() => handleJumpToStep(index)}
                                    className="bg-[#2a378d]/10 text-[#2a378d] rounded-full px-3 py-1 text-sm hover:bg-[#2a378d]/20 transition-all"
                                >
                                    {label}
                                </button>
                            );
                        })}
                    </div>
                )}

                <div>
                    {currentStep && !currentStep.isFinal && (
                        <StepView 
                            key={currentStepId}
                            step={currentStep} 
                            stepId={currentStepId} 
                            onSelect={handleSelection} 
                            path={path}
                            budgetFlow={budgetFlow}
                        />
                    )}

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
                                        .filter(opt => opt && opt.label.startsWith("Sin "))
                                        .map(opt => opt.label.substring(4).toLowerCase());

                                    if (excludedItems.length > 0) {
                                        const capitalized = excludedItems[0].charAt(0).toUpperCase() + excludedItems[0].slice(1);
                                        const rest = excludedItems.slice(1);
                                        return (
                                            <p className="text-base mt-6">
                                                <span>No incluye:</span> {[capitalized, ...rest].join(', ')}.
                                            </p>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>
                            <p className="italic mt-8 text-sm text-[#2a378d]/80">
                                ✦ Presupuesto estimativo. Sirve como referencia rápida para tomar decisiones. Válido sólo para piezas en redes sociales. Para TV u otros medios, consultá por un presupuesto personalizado.
                            </p>
                        </div>
                    )}
                </div>
            </main>

            {path.length > 0 && (
                <div className="mt-auto pt-8" style={{ paddingBottom: '50px' }}>
                     <div className="w-full max-w-4xl mx-auto">
                        <hr className="border-t border-[#2a378d]/50" />
                        <div className="flex justify-between items-center py-4">
                            <div className="flex-1 text-left">
                                <span className="text-lg sm:text-xl">
                                    {currentStep && currentStep.isFinal ? "Total Final" : "Total Parcial"}
                                </span>
                            </div>
                            <div className="flex-1 text-center">
                                <span className="text-xl sm:text-2xl text-[#2a378d] font-bold">
                                    ${new Intl.NumberFormat('es-AR').format(totalPrice)}
                                </span>
                            </div>
                            <div className="flex-1 text-right">
                                <button onClick={handleReset} className="text-[#2a378d] text-sm hover:bg-[#2a378d]/10 border border-[#2a378d] rounded-full px-4 py-1 transition-colors">
                                    Volver a empezar
                                </button>
                            </div>
                        </div>
                        <hr className="border-t border-[#2a378d]/50" />
                        <p className="text-center text-xs mt-2 text-[#2a378d]/70">{formattedDate} ✦ Perro con Dos Colas</p>
                    </div>
                </div>
            )}
        </div>
    );
}

function StepView({ step, stepId, onSelect, path, budgetFlow }) {
    const [selection, setSelection] = useState(null);
    const [customAmount, setCustomAmount] = useState("");

    const dynamicOptions = useMemo(() => {
        if (!step.isDynamic) return step.options;

        const formatStepId = stepId.replace('adapt_formato', 'formatos');
        const formatChoice = path.find(p => p.stepId === formatStepId);
        if (!formatChoice) return step.options;

        const allFormats = Object.values(budgetFlow[formatStepId].options).map(opt => opt.label);
        const chosenFormatLabel = budgetFlow[formatStepId].options[formatChoice.selection].label;
        const remainingFormats = allFormats.filter(f => f !== chosenFormatLabel);
        
        const newOptions = JSON.parse(JSON.stringify(step.options)); // Deep copy
        if (remainingFormats.length === 2) {
            newOptions[Object.keys(newOptions)[0]].label = `Una adaptación (${remainingFormats[0]} o ${remainingFormats[1]})`;
            newOptions[Object.keys(newOptions)[1]].label = `Dos adaptaciones (${remainingFormats[0]} y ${remainingFormats[1]})`;
        }
        return newOptions;
    }, [step, stepId, path, budgetFlow]);

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
            {step.clarification && <p className="text-sm text-left mt-1 text-[#2a378d]/80">{step.clarification}</p>}
            <hr className="border-t border-[#2a378d]/50 my-6" />
            
            <div className="flex flex-col gap-4">
                {Object.entries(dynamicOptions).map(([key, option]) => (
                    <label 
                        key={key} 
                        className={`block w-full text-left p-4 rounded-lg cursor-pointer transition-all duration-200 ${selection === key ? 'bg-[#2a378d]/10' : 'hover:bg-[#2a378d]/5'}`}
                    >
                        <input type="radio" name={stepId} value={key} className="sr-only" onChange={() => setSelection(key)} />
                        <div className="flex items-center gap-4">
                            <span className="text-lg">{option.label}</span>
                            {option.isCustom && (
                                <input 
                                    type="number" min="2" placeholder="ej: 7" value={customAmount}
                                    onChange={(e) => setCustomAmount(e.target.value)}
                                    onClick={() => setSelection(key)}
                                    className="w-24 p-1 rounded-md border border-[#2a378d]/50 bg-transparent text-center focus:ring-1 focus:ring-[#2a378d]"
                                />
                            )}
                        </div>
                        {option.description && <p className="text-sm text-[#2a378d]/80 mt-1 pr-4">{option.description}</p>}
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
            
            <style>{`.animate-fade-in { animation: fadeIn 0.5s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
        </div>
    );
}
