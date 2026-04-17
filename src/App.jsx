import { useState } from 'react'
import InputForm from './components/InputForm'
import StepDisplay from './components/StepDisplay'
import TransitionTable from './components/TransitionTable'
import TransitionDiagram from './components/TransitionDiagram'
import OutputSection from './components/OutputSection'
import { parseNFAInput, subsetConstruction } from './utils/subsetConstruction'

export default function App() {
  const [dfa, setDfa] = useState(null)
  const [steps, setSteps] = useState(null)
  const [error, setError] = useState(null)

  const handleConvert = (input) => {
    try {
      setError(null)

      // Parse input
      const nfa = parseNFAInput(input)

      // Validate input
      if (!nfa.states.includes(nfa.startState)) {
        throw new Error('Start state must be in the states list')
      }

      for (const finalState of nfa.finalStates) {
        if (!nfa.states.includes(finalState)) {
          throw new Error(`Final state "${finalState}" must be in the states list`)
        }
      }

      // Run conversion
      const result = subsetConstruction(
        nfa.states,
        nfa.alphabet,
        nfa.transitions,
        nfa.startState,
        nfa.finalStates
      )

      setDfa({
        states: result.states,
        alphabet: result.alphabet,
        transitions: result.transitions,
        startState: result.startState,
        acceptStates: result.acceptStates,
        regex: result.regex
      })

      setSteps(result.steps)
    } catch (err) {
      setError(err.message)
      setDfa(null)
      setSteps(null)
    }
  }

  const handleReset = () => {
    setDfa(null)
    setSteps(null)
    setError(null)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 backdrop-blur-sm bg-white/80">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center">
            <p className="text-purple-900 font-semibold text-sm uppercase tracking-widest mb-3">
              Theory of Computation
            </p>
            <h1 className="text-6xl md:text-7xl font-black mb-2">
              <span className="gradient-accent-text">NFA to DFA</span>
            </h1>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Converter</h2>
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-1 gradient-accent w-20 rounded-full"></div>
              <span className="text-gray-700 font-medium">Subset Construction</span>
              <div className="h-1 gradient-accent w-20 rounded-full"></div>
            </div>
            <p className="text-gray-700 text-lg max-w-2xl mx-auto">
              Visualize the step-by-step transformation from Nondeterministic Finite Automata to Deterministic Finite Automata
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Input Form */}
          <div className="lg:col-span-1 space-y-4" style={{ animation: 'slideInLeft 0.6s ease-out' }}>
            <InputForm onConvert={handleConvert} />

            {/* Reset Button */}
            {dfa && (
              <button
                onClick={handleReset}
                className="btn-secondary w-full"
              >
                ↺ Reset Configuration
              </button>
            )}
          </div>

          {/* Right: Output */}
          <div className="lg:col-span-2 space-y-8" style={{ animation: 'slideInRight 0.6s ease-out' }}>
            {error && (
              <div className="card bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500 shadow-lg">
                <p className="text-red-800 font-semibold text-lg">⚠ Error</p>
                <p className="text-red-700 text-sm mt-2">{error}</p>
              </div>
            )}

            {!dfa && !error && (
              <div className="card bg-gradient-to-br from-purple-50 via-white to-blue-50 text-center py-16 border-2 border-dashed border-purple-200">
                <div className="mb-4 text-4xl">⚙️</div>
                <p className="text-gray-700 text-lg font-medium">
                  Configure your NFA on the left
                </p>
                <p className="text-gray-500 mt-2">
                  Click "Convert to DFA" to begin the subset construction process
                </p>
              </div>
            )}

            {dfa && (
              <>
                <StepDisplay steps={steps} />
                <OutputSection dfa={dfa} />
                <TransitionTable dfa={dfa} alphabet={dfa.alphabet} />
                <TransitionDiagram dfa={dfa} />
              </>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 mt-20 py-8 text-center text-gray-600 text-sm bg-white/50 backdrop-blur-sm">
        <p className="font-semibold">AutomataFlow</p>
        <p className="mt-1 text-xs">Theory of Computation • NFA ↔ DFA Conversion Tool</p>
      </footer>
    </div>
  )
}
