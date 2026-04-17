import React from 'react'

export default function TransitionTable({ dfa, alphabet }) {
  if (!dfa) return null

  const gradientStyle = {
    background: 'linear-gradient(90deg, #e6d6f5, #c8a8e9, #9b6fd3, #6e3bb8, #4a1f8c)',
    color: 'white'
  }

  return (
    <div className="card">
      <div className="pb-4 border-b-2 border-gray-200 mb-6">
        <h2 className="text-2xl font-bold gradient-accent-text">
          DFA Transition Table
        </h2>
        <p className="text-gray-700 text-sm mt-1">Complete state transitions</p>
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr style={gradientStyle}>
              <th className="px-4 py-4 font-semibold text-left rounded-tl-xl">State</th>
              {alphabet.map((symbol) => (
                <th
                  key={symbol}
                  className="px-4 py-4 text-center font-semibold"
                >
                  <span className="inline-block px-3 py-1 bg-white/20 rounded font-mono">
                    {symbol}
                  </span>
                </th>
              ))}
              <th className="px-4 py-4 text-center font-semibold rounded-tr-xl">
                Type
              </th>
            </tr>
          </thead>
          <tbody>
            {dfa.states.map((state, rowIdx) => {
              const isStart = state === dfa.startState
              const isAccept = dfa.acceptStates.includes(state)

              let rowClass = 'hover:shadow-md transition-all'
              if (isAccept && isStart) {
                rowClass += ' bg-gradient-to-r from-indigo-50 to-transparent'
              } else if (isAccept) {
                rowClass += ' highlight-row'
              } else if (isStart) {
                rowClass += ' bg-gradient-to-r from-blue-50 to-transparent'
              } else {
                rowClass += ' bg-white hover:bg-gray-50'
              }

              return (
                <tr
                  key={state}
                  className={`border-t border-gray-200 ${rowClass}`}
                  style={{ animation: `fadeInUp 0.5s ease-out ${rowIdx * 0.05}s backwards` }}
                >
                  <td className="px-4 py-3 font-mono font-bold text-gray-900 relative">
                    <div className="flex items-center gap-2">
                      {isStart && (
                        <span className="inline-flex items-center justify-center w-5 h-5 bg-blue-500 text-white text-xs rounded-full font-black">
                          →
                        </span>
                      )}
                      <span>{state}</span>
                    </div>
                  </td>

                  {alphabet.map((symbol) => {
                    const transKey = `${state}-${symbol}`
                    const nextState = dfa.transitions[transKey]
                    return (
                      <td
                        key={symbol}
                        className="px-4 py-3 text-center font-mono text-gray-800 hover:bg-white/50 transition-colors"
                      >
                        {nextState ? (
                          <span className="inline-block px-2 py-1 bg-purple-100 text-purple-900 rounded font-semibold">
                            {nextState}
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                    )
                  })}

                  <td className="px-4 py-3 text-center">
                    {isStart && isAccept && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-indigo-200 to-purple-200 text-indigo-900 rounded-full font-semibold text-xs">
                        <span>→</span> Start & Final
                      </span>
                    )}
                    {isStart && !isAccept && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-blue-200 to-blue-300 text-blue-900 rounded-full font-semibold text-xs">
                        <span>→</span> Start
                      </span>
                    )}
                    {!isStart && isAccept && (
                      <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-purple-200 to-purple-300 text-purple-900 rounded-full font-semibold text-xs">
                        <span>◆</span> Final
                      </span>
                    )}
                    {!isStart && !isAccept && (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="mt-6 grid grid-cols-3 gap-4 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
          <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">
            →
          </div>
          <span className="text-sm text-gray-700 font-medium">Start State</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
          <span className="text-lg">◆</span>
          <span className="text-sm text-gray-700 font-medium">Final State</span>
        </div>

        <div className="flex items-center gap-3 p-3 bg-indigo-50 rounded-lg">
          <span className="text-sm font-bold text-indigo-700">◆→</span>
          <span className="text-sm text-gray-700 font-medium">Both</span>
        </div>
      </div>
    </div>
  )
}
