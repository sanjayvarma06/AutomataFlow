// Test file to verify subset construction algorithm
import { subsetConstruction, parseNFAInput } from './subsetConstruction.js'

// Test case: Default NFA from the app
const testInput = {
  states: 'q0,q1,q2',
  alphabet: 'a,b',
  startState: 'q0',
  finalStates: 'q2',
  transitions: [
    ['q0', 'a', 'q0,q1'],
    ['q0', 'b', 'q0'],
    ['q1', 'b', 'q2'],
    ['q2', 'a', 'q2'],
    ['q2', 'b', 'q2']
  ]
}

console.log('=== Testing NFA to DFA Conversion ===\n')
console.log('Input NFA:')
console.log(JSON.stringify(testInput, null, 2))
console.log('\n')

try {
  const nfa = parseNFAInput(testInput)
  console.log('Parsed NFA:')
  console.log('States:', nfa.states)
  console.log('Alphabet:', nfa.alphabet)
  console.log('Start State:', nfa.startState)
  console.log('Final States:', Array.from(nfa.finalStates))
  console.log('Transitions:', nfa.transitions)
  console.log('\n')

  const result = subsetConstruction(
    nfa.states,
    nfa.alphabet,
    nfa.transitions,
    nfa.startState,
    nfa.finalStates
  )

  console.log('=== DFA Result ===')
  console.log('DFA States:', result.states)
  console.log('DFA Start State:', result.startState)
  console.log('DFA Accept States:', result.acceptStates)
  console.log('DFA Transitions:', result.transitions)
  console.log('\n=== Conversion Steps ===')
  result.steps.forEach((step, idx) => {
    console.log(`\nStep ${idx + 1}: ${step.description}`)
    console.log(step.details)
  })

  console.log('\n=== SUCCESS ===')
  console.log('Algorithm completed without errors')
} catch (error) {
  console.error('\n=== ERROR ===')
  console.error(error.message)
  console.error(error.stack)
}
