import React, { useState } from 'react'

export default function InputForm({ onConvert }) {
  const [states, setStates] = useState('q0,q1,q2')
  const [alphabet, setAlphabet] = useState('a,b')
  const [startState, setStartState] = useState('q0')
  const [finalStates, setFinalStates] = useState('q2')
  const [transitions, setTransitions] = useState([
    ['q0', 'a', 'q0,q1'],
    ['q0', 'b', 'q0'],
    ['q1', 'b', 'q2'],
    ['q2', 'a', 'q2'],
    ['q2', 'b', 'q2']
  ])

  const statesList = states.split(',').map(s => s.trim()).filter(Boolean)

  const handleTransitionChange = (index, field, value) => {
    const newTransitions = [...transitions]
    newTransitions[index][field] = value
    setTransitions(newTransitions)
  }

  const addTransition = () => {
    setTransitions([...transitions, ['q0', 'a', 'q0']])
  }

  const removeTransition = (index) => {
    setTransitions(transitions.filter((_, i) => i !== index))
  }

  const handleConvert = () => {
    onConvert({
      states: states.trim(),
      alphabet: alphabet.trim(),
      startState: startState.trim(),
      finalStates: finalStates.trim(),
      transitions
    })
  }

  return (
    <div className="card space-y-6">
      <div className="pb-4 border-b-2 border-gray-200">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-700 to-purple-900 bg-clip-text text-transparent">
          NFA Configuration
        </h2>
        <p className="text-gray-700 text-sm mt-1">Define your Nondeterministic Finite Automata</p>
      </div>

      {/* States */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          States <span className="text-purple-600">*</span>
        </label>
        <input
          type="text"
          value={states}
          onChange={(e) => setStates(e.target.value)}
          placeholder="q0,q1,q2"
          className="input-field"
        />
        <p className="text-xs text-gray-500">Enter comma-separated state names</p>
      </div>

      {/* Alphabet */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Alphabet <span className="text-purple-600">*</span>
        </label>
        <input
          type="text"
          value={alphabet}
          onChange={(e) => setAlphabet(e.target.value)}
          placeholder="a,b"
          className="input-field"
        />
        <p className="text-xs text-gray-500">Symbols in your language</p>
      </div>

      {/* Start State */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Start State <span className="text-purple-600">*</span>
        </label>
        <select
          value={startState}
          onChange={(e) => setStartState(e.target.value)}
          className="input-field cursor-pointer"
        >
          {statesList.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
      </div>

      {/* Final States */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-gray-800">
          Final States <span className="text-purple-600">*</span>
        </label>
        <input
          type="text"
          value={finalStates}
          onChange={(e) => setFinalStates(e.target.value)}
          placeholder="q2,q3"
          className="input-field"
        />
        <p className="text-xs text-gray-500">Accepting/Final states (comma-separated)</p>
      </div>

      {/* Transitions Table */}
      <div className="space-y-3 pt-2">
        <div className="flex justify-between items-center">
          <label className="block text-sm font-semibold text-gray-800">
            Transitions <span className="text-purple-600">*</span>
          </label>
          <button
            onClick={addTransition}
            className="btn-small"
          >
            + Add Transition
          </button>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200 bg-gray-50">
          <table className="w-full text-xs">
            <thead>
              <tr className="gradient-accent">
                <th className="px-3 py-3 text-left text-white font-semibold">From</th>
                <th className="px-3 py-3 text-left text-white font-semibold">Symbol</th>
                <th className="px-3 py-3 text-left text-white font-semibold">To (comma-sep)</th>
                <th className="px-3 py-3 text-center text-white font-semibold w-12">Delete</th>
              </tr>
            </thead>
            <tbody>
              {transitions.map((trans, idx) => (
                <tr
                  key={idx}
                  className="border-t border-gray-200 hover:bg-purple-50 transition-colors"
                >
                  <td className="px-3 py-3">
                    <select
                      value={trans[0]}
                      onChange={(e) =>
                        handleTransitionChange(idx, 0, e.target.value)
                      }
                      className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      {statesList.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={trans[1]}
                      onChange={(e) =>
                        handleTransitionChange(idx, 1, e.target.value)
                      }
                      placeholder="a"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-3 py-3">
                    <input
                      type="text"
                      value={trans[2]}
                      onChange={(e) =>
                        handleTransitionChange(idx, 2, e.target.value)
                      }
                      placeholder="q1,q2"
                      className="w-full px-2 py-1.5 border border-gray-300 rounded bg-white text-xs focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </td>
                  <td className="px-3 py-3 text-center">
                    <button
                      onClick={() => removeTransition(idx)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded transition-all transform hover:scale-110"
                      title="Delete transition"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Convert Button */}
      <div className="flex justify-center pt-6 border-t border-gray-200">
        <button
          onClick={handleConvert}
          className="btn-primary text-lg px-10 py-4 shadow-xl hover:shadow-2xl"
        >
          🔄 Convert to DFA
        </button>
      </div>
    </div>
  )
}
