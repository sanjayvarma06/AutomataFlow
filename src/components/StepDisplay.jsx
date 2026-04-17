import React from 'react'

export default function StepDisplay({ steps }) {
  if (!steps || steps.length === 0) return null

  const gradientStyle = {
    background: 'linear-gradient(90deg, #e6d6f5, #c8a8e9, #9b6fd3, #6e3bb8, #4a1f8c)',
  }

  return (
    <div className="card">
      <div className="pb-4 border-b-2 border-gray-200 mb-6">
        <h2 className="text-2xl font-bold gradient-accent-text">
          Subset Construction Steps
        </h2>
        <p className="text-gray-700 text-sm mt-1">Follow the conversion algorithm</p>
      </div>

      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="step-card relative overflow-hidden"
            style={{
              animationDelay: `${idx * 0.1}s`
            }}
          >
            <div className="absolute -right-8 -bottom-8 w-24 h-24 bg-gradient-accent opacity-5 rounded-full"></div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-xs font-bold"
                  style={gradientStyle}
                >
                  {idx + 1}
                </span>
                <div className="font-semibold text-gray-900 text-sm">
                  {step.description}
                </div>
              </div>

              <div className="text-xs text-gray-700 mt-3 font-mono whitespace-pre-wrap bg-gray-50 rounded px-3 py-2.5 border border-gray-200">
                {step.details}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Total steps: <span className="font-semibold text-purple-700">{steps.length}</span>
        </p>
      </div>
    </div>
  )
}
