const STEPS = ['Fotografía', 'Análisis', 'Ubicación', 'Confirmación']

export default function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center justify-between w-full max-w-xs mx-auto">
      {STEPS.map((label, i) => {
        const step = i + 1
        const done = step < currentStep
        const active = step === currentStep
        return (
          <div key={step} className="flex flex-col items-center gap-1 flex-1">
            <div className="flex items-center w-full">
              {i > 0 && (
                <div className={`flex-1 h-px ${done ? 'bg-[#1d6fff]' : 'bg-slate-200'}`} />
              )}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 transition-all
                  ${done ? 'bg-[#1d6fff] text-white' : active ? 'bg-[#0f2356] text-white ring-4 ring-blue-100' : 'bg-slate-100 text-slate-400'}`}
              >
                {done ? (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                ) : step}
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-px ${done ? 'bg-[#1d6fff]' : 'bg-slate-200'}`} />
              )}
            </div>
            <span className={`text-[10px] font-medium mt-0.5 ${active ? 'text-[#0f2356]' : done ? 'text-[#1d6fff]' : 'text-slate-400'}`}>
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
