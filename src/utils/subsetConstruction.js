/**
 * Compute epsilon closure for a set of NFA states
 * @param {Set<string>} states - Set of NFA states
 * @param {Object} transitions - Transition mapping
 * @returns {Set<string>} - Epsilon closure of states
 */
export function epsilonClosure(states, transitions) {
  const closure = new Set(states)
  const stack = Array.from(states)

  while (stack.length > 0) {
    const state = stack.pop()
    const key = `${state}-ε`

    if (transitions[key]) {
      for (const nextState of transitions[key]) {
        if (!closure.has(nextState)) {
          closure.add(nextState)
          stack.push(nextState)
        }
      }
    }
  }

  return closure
}

/**
 * Move function: get all states reachable on input symbol
 * @param {Set<string>} states - Current set of states
 * @param {string} symbol - Input symbol
 * @param {Object} transitions - Transition mapping
 * @returns {Set<string>} - States reachable on symbol
 */
export function move(states, symbol, transitions) {
  const reachable = new Set()

  for (const state of states) {
    const key = `${state}-${symbol}`
    if (transitions[key]) {
      for (const nextState of transitions[key]) {
        reachable.add(nextState)
      }
    }
  }

  return reachable
}

/**
 * Convert NFA to DFA using subset construction
 * @param {string[]} nfaStates - NFA states
 * @param {string[]} alphabet - Input alphabet
 * @param {Object} nfaTransitions - NFA transitions
 * @param {string} startState - NFA start state
 * @param {Set<string>} acceptStates - NFA accept states
 * @returns {Object} - DFA with states, transitions, and steps
 */
export function subsetConstruction(
  nfaStates,
  alphabet,
  nfaTransitions,
  startState,
  acceptStates
) {
  const steps = []
  const dfaStates = new Map() // Maps DFA state (as sorted string) to Set
  const dfaTransitions = {}
  const dfaStartState = epsilonClosure(new Set([startState]), nfaTransitions)
  const dfaStartKey = stateSetToKey(dfaStartState)

  // Initialize with start state
  const workList = [dfaStartState]
  dfaStates.set(dfaStartKey, dfaStartState)

  steps.push({
    description: `Start: ε-closure({${startState}})`,
    state: dfaStartKey,
    details: `ε-closure({${startState}}) = {${Array.from(dfaStartState).sort().join(', ')}}`
  })

  let stepCount = 1

  // Process all reachable DFA states
  while (workList.length > 0) {
    const currentSet = workList.shift()
    const currentKey = stateSetToKey(currentSet)

    // For each input symbol
    for (const symbol of alphabet) {
      // Move and epsilon closure
      const moveSet = move(currentSet, symbol, nfaTransitions)

      if (moveSet.size > 0) {
        const nextSet = epsilonClosure(moveSet, nfaTransitions)
        const nextKey = stateSetToKey(nextSet)

        // Add transition
        const transKey = `${currentKey}-${symbol}`
        dfaTransitions[transKey] = nextKey

        // If new state, add to work list
        if (!dfaStates.has(nextKey)) {
          dfaStates.set(nextKey, nextSet)
          workList.push(nextSet)

          stepCount++
          steps.push({
            description: `Step ${stepCount}: From {${Array.from(currentSet).sort().join(', ')}} on '${symbol}'`,
            state: nextKey,
            details: `Move({${Array.from(currentSet).sort().join(', ')}}, '${symbol}') = {${Array.from(moveSet).sort().join(', ')}}
ε-closure = {${Array.from(nextSet).sort().join(', ')}}`
          })
        }
      }
    }
  }

  // Determine DFA accept states
  const dfaAcceptStates = new Set()
  dfaStates.forEach((stateSet, key) => {
    for (const state of stateSet) {
      if (acceptStates.has(state)) {
        dfaAcceptStates.add(key)
        break
      }
    }
  })

  const dfaResult = {
    states: Array.from(dfaStates.keys()).sort(),
    alphabet,
    transitions: dfaTransitions,
    startState: dfaStartKey,
    acceptStates: Array.from(dfaAcceptStates).sort(),
    steps,
    dfaStatesMap: dfaStates
  }

  return {
    ...dfaResult,
    regex: dfaToRegex(dfaResult)
  }
}

export function dfaToRegex(dfa) {
  const { states, transitions, startState, acceptStates } = dfa
  if (!acceptStates || acceptStates.length === 0) return '∅'

  const startNode = '__START__'
  const finalNode = '__FINAL__'
  const regexMap = new Map()

  const toKey = (from, to) => `${from}-->${to}`

  const unionRegex = (a, b) => {
    if (!a) return b
    if (!b) return a
    if (a === b) return a
    return `(${a}|${b})`
  }

  const concatRegex = (a, b) => {
    if (!a) return b
    if (!b) return a
    return `${a}${b}`
  }

  const starRegex = (expr) => {
    if (!expr) return ''
    if (expr === 'ε') return 'ε'
    return `(${expr})*`
  }

  const addEdge = (from, to, label) => {
    if (label == null) return
    const key = toKey(from, to)
    const existing = regexMap.get(key) || ''
    regexMap.set(key, unionRegex(existing, label))
  }

  addEdge(startNode, startState, '')
  acceptStates.forEach((state) => addEdge(state, finalNode, ''))

  for (const [key, target] of Object.entries(transitions)) {
    const splitIndex = key.lastIndexOf('-')
    const source = key.slice(0, splitIndex)
    const symbol = key.slice(splitIndex + 1)
    addEdge(source, target, symbol)
  }

  const allNodes = [startNode, ...states, finalNode]
  const eliminationOrder = allNodes.filter((node) => node !== startNode && node !== finalNode)

  eliminationOrder.forEach((elim) => {
    const selfKey = toKey(elim, elim)
    const selfRegex = regexMap.has(selfKey) ? regexMap.get(selfKey) : ''
    const selfStar = selfRegex ? starRegex(selfRegex) : ''

    allNodes.forEach((i) => {
      if (i === elim) return
      const ikKey = toKey(i, elim)
      if (!regexMap.has(ikKey)) return
      const ik = regexMap.get(ikKey) || ''

      allNodes.forEach((j) => {
        if (j === elim) return
        const kjKey = toKey(elim, j)
        if (!regexMap.has(kjKey)) return
        const kj = regexMap.get(kjKey) || ''

        const ijKey = toKey(i, j)
        const existing = regexMap.has(ijKey) ? regexMap.get(ijKey) || '' : ''
        const newPath = concatRegex(ik, concatRegex(selfStar, kj))
        regexMap.set(ijKey, unionRegex(existing, newPath))
      })
    })

    allNodes.forEach((node) => {
      regexMap.delete(toKey(node, elim))
      regexMap.delete(toKey(elim, node))
    })
  })

  const result = regexMap.get(toKey(startNode, finalNode)) || ''
  return result || '∅'
}


/**
 * Convert a set of states to a canonical key string
 * @param {Set<string>} stateSet - Set of states
 * @returns {string} - Canonical representation
 */
function stateSetToKey(stateSet) {
  return '{' + Array.from(stateSet).sort().join(',') + '}'
}

/**
 * Parse NFA input and build transition map
 * @param {Object} input - User input with transitions
 * @returns {Object} - Parsed NFA data
 */
export function parseNFAInput(input) {
  const {
    states: statesStr,
    alphabet: alphabetStr,
    startState,
    finalStates: finalStatesStr,
    transitions
  } = input

  const states = statesStr.split(',').map(s => s.trim()).filter(Boolean)
  const alphabet = alphabetStr.split(',').map(s => s.trim()).filter(Boolean)
  const finalStates = new Set(
    finalStatesStr.split(',').map(s => s.trim()).filter(Boolean)
  )

  // Build transition mapping
  const transitionMap = {}
  for (const [fromState, symbol, toStates] of transitions) {
    const key = `${fromState}-${symbol}`
    const targets = toStates
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    if (targets.length === 0) continue

    if (!transitionMap[key]) {
      transitionMap[key] = []
    }

    transitionMap[key].push(...targets)
    transitionMap[key] = Array.from(new Set(transitionMap[key]))
  }

  return {
    states,
    alphabet,
    startState: startState.trim(),
    finalStates,
    transitions: transitionMap
  }
}
