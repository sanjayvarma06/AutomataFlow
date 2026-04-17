import React from 'react'

export default function OutputSection({ dfa }) {
  if (!dfa) return null

  return (
    <div className="card space-y-6">
      <div className="pb-4 border-b-2 border-gray-200">
        <h2 className="text-2xl font-bold gradient-accent-text">
          Generated DFA
        </h2>
        <p className="text-gray-700 text-sm mt-1">Result of subset construction</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="group relative rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4 border border-blue-200 hover:shadow-lg transition-all cursor-default">
          <div className="text-xs text-blue-600 uppercase font-bold tracking-wide">States</div>
          <div className="text-3xl font-bold text-blue-900 mt-2">{dfa.states.length}</div>
          <div className="absolute -right-3 -top-3 w-8 h-8 bg-blue-200 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
        </div>

        <div className="group relative rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4 border border-purple-200 hover:shadow-lg transition-all cursor-default">
          <div className="text-xs text-purple-600 uppercase font-bold tracking-wide">Final</div>
          <div className="text-3xl font-bold text-purple-900 mt-2">{dfa.acceptStates.length}</div>
          <div className="absolute -right-3 -top-3 w-8 h-8 bg-purple-200 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
        </div>

        <div className="group relative rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4 border border-green-200 hover:shadow-lg transition-all cursor-default">
          <div className="text-xs text-green-600 uppercase font-bold tracking-wide">Symbols</div>
          <div className="text-3xl font-bold text-green-900 mt-2">{dfa.alphabet.length}</div>
          <div className="absolute -right-3 -top-3 w-8 h-8 bg-green-200 rounded-full opacity-0 group-hover:opacity-100 transition-all"></div>
        </div>
      </div>

      {/* DFA States Visualization */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-lg">DFA States</h3>
        <div className="flex flex-wrap gap-3">
          {dfa.states.map((state, idx) => {
            const isStart = state === dfa.startState
            const isAccept = dfa.acceptStates.includes(state)

            let stateClass = 'state-tag state-tag-normal'
            if (isStart && isAccept) {
              stateClass = 'state-tag state-tag-both'
            } else if (isStart) {
              stateClass = 'state-tag state-tag-start'
            } else if (isAccept) {
              stateClass = 'state-tag state-tag-final'
            }

            return (
              <span
                key={state}
                className={stateClass}
                style={{ animationDelay: `${idx * 0.05}s` }}
                title={`${isStart ? 'Start' : ''} ${isAccept ? 'Final' : ''}`.trim()}
              >
                {state}
                {isStart && ' ✓'}
                {isAccept && ' ◆'}
              </span>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="section-divider"></div>

      {/* Final States List */}
      <div>
        <h3 className="font-bold text-gray-900 mb-4 text-lg">Accepting States</h3>
        <div className="space-y-2">
          {dfa.acceptStates.length > 0 ? (
            dfa.acceptStates.map((state) => (
              <div
                key={state}
                className="px-4 py-3 bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-300 rounded-lg font-mono font-semibold text-purple-900 flex items-center gap-2 hover:shadow-md transition-all"
              >
                <span className="text-lg">◆</span>
                {state}
              </div>
            ))
          ) : (
            <div className="px-4 py-3 bg-gray-100 rounded-lg text-gray-600 text-center italic">
              No accepting states
            </div>
          )}
        </div>
      </div>

      {/* Start State Highlight */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase text-blue-700">Start State</h3>
        <div className="px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-50 border-2 border-blue-400 rounded-lg font-mono font-bold text-blue-900">
          → {dfa.startState}
        </div>
      </div>

      {/* Regular Expression */}
      <div>
        <h3 className="font-bold text-gray-900 mb-3 text-sm uppercase text-purple-700">Regular Expression</h3>
        <div className="px-4 py-4 bg-gradient-to-r from-purple-100 to-purple-50 border-2 border-purple-300 rounded-lg font-mono text-purple-900 whitespace-pre-wrap break-words">
          {dfa.regex || '∅'}
        </div>
      </div>
    </div>
  )
}
