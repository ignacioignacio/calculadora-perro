import React, { useState, useMemo } from 'react';

export default function App() {
  const [path, setPath] = useState([]);

  const BASE_PRICES = {
    snack: 400000,
    storytelling: 1200000,
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

  const currentStep = budgetFlow[currentStepId];

  return (
    <div className="bg-[#ede8dc] text-[#2a378d] min-h-screen font-sans flex flex-col p-4 sm:p-6 lg:p-8">
      <header className="w-full max-w-4xl mx-auto mb-8 flex justify-between items-center">
        <h1 className="text-2xl sm:text-3xl text-left">¿Y cuánto me sale?</h1>
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

              const label = optionInfo.label;
              return (
                <React.Fragment key={`${p.stepId}-${index}`}>
                  <button
                    onClick={() => handleJumpToStep(index)}
                    className="bg-[#2a378d]/10 text-[#2a378d] rounded-full px-3 py-1 text-sm hover:bg-[#2a378d]/20 transition-all"
                  >
                    {label}
                  </button>
                  {index < path.length - 1 && <span className="text-[#2a378d]">→</span>}
                </React.Fragment>
              );
            })}
          </div>
        )}

        <div>
          {currentStep && !currentStep.isFinal && (
            <div className="animate-fade-in">
              <h2 className="text-xl sm:text-2xl text-left">{currentStep.question}</h2>
              <hr className="border-t border-[#2a378d]/50 my-6" />
              <div className="flex flex-col gap-4">
                {Object.entries(currentStep.options).map(([key, option]) => (
                  <button
                    key={key}
                    onClick={() => handleSelection(currentStepId, key)}
                    className="block w-full text-left p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#2a378d]/10"
                  >
                    <span className="text-lg">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {currentStep && currentStep.isFinal && (
            <div className="text-left">
              <h2 className="text-xl sm:text-2xl text-left">Resumen</h2>
              <hr className="border-t border-[#2a378d]/50 my-6" />
              <div className="space-y-2 text-lg">
                {path.filter(p => !budgetFlow[p.stepId].options[p.selection].label.startsWith("Sin ")).map((p, index) => {
                  const optionInfo = budgetFlow[p.stepId].options[p.selection];
                  return <p key={index}>{optionInfo.label}</p>;
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
                Esta es una idea de presupuesto, los márgenes pueden variar al contactarnos. Tomalo como guía.
              </p>
            </div>
          )}
        </div>
      </main>

      <footer className="sticky bottom-0 left-0 right-0 bg-[#ede8dc]/80 backdrop-blur-sm mt-8 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 lg:-mx-8 lg:-mb-8 p-4 sm:p-5 border-t border-[#2a378d]/50">
        <div className="w-full max-w-4xl mx-auto flex justify-between items-center">
          <span className="text-lg sm:text-xl">
            {currentStep?.isFinal ? "Total Final" : "Total Parcial"}
          </span>
          <span className="text-xl sm:text-2xl text-[#2a378d]">
            ${new Intl.NumberFormat('es-AR').format(totalPrice)}
          </span>
        </div>
      </footer>

      {currentStep?.isFinal && (
        <div className="bg-[#2a378d] w-full p-4 -mx-4 -mb-4 sm:-mx-6 sm:-mb-6 lg:-mx-8 lg:-mb-8 mt-8">
          <div className="w-full max-w-4xl mx-auto text-center">
            <button onClick={handleReset} className="text-white text-lg hover:underline">
              Empezar de nuevo
            </button>
          </div>
        </div>
      )}
    </div>a
  );
}
