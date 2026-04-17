import React, { useEffect, useRef } from 'react'
import mermaid from 'mermaid'

let mermaidInitialized = false

export default function TransitionDiagram({ dfa }) {
  const diagramRef = useRef(null)
  const diagramIdRef = useRef(`dfa-diagram-${Math.random().toString(36).slice(2)}`)

  useEffect(() => {
    if (!dfa || !diagramRef.current) return

    if (!mermaidInitialized) {
      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          primaryColor: '#6e3bb8',
          primaryTextColor: '#fff',
          primaryBorderColor: '#4a1f8c',
          lineColor: '#6e3bb8',
          secondaryColor: '#e6d6f5',
          tertiaryColor: '#f8f7ff'
        }
      })
      mermaidInitialized = true
    }

    const renderDiagram = async () => {
      const graphDefinition = generateDFAGraph(dfa)
      diagramRef.current.innerHTML = ''

      try {
        const { svg } = await mermaid.mermaidAPI.render(
          diagramIdRef.current,
          graphDefinition,
          diagramRef.current
        )

        if (diagramRef.current) {
          diagramRef.current.innerHTML = svg
        }
      } catch (error) {
        console.error('Mermaid render error:', error)
        if (diagramRef.current) {
          diagramRef.current.innerHTML = `\n            <div class="text-red-500">Error rendering diagram: ${error.message || error}</div>\n            <pre class="text-xs text-gray-600 whitespace-pre-wrap mt-3">${graphDefinition}</pre>\n          `
        }
      }
    }

    renderDiagram()
  }, [dfa])

  const generateDFAGraph = (dfa) => {
    const startStateId = sanitizeId(dfa.startState)
    let graph = 'graph LR\n'
    graph += `  start["Start"] --> ${startStateId}\n`

    dfa.states.forEach((state) => {
      const isAccept = dfa.acceptStates.includes(state)
      const nodeId = sanitizeId(state)
      const label = escapeLabel(state)
      const shape = isAccept ? `(("${label}"))` : `("${label}")`
      graph += `  ${nodeId}${shape}\n`
    })

    Object.entries(dfa.transitions).forEach(([key, target]) => {
      const splitIndex = key.lastIndexOf('-')
      const source = key.slice(0, splitIndex)
      const symbol = key.slice(splitIndex + 1)
      const sourceId = sanitizeId(source)
      const targetId = sanitizeId(target)
      graph += `  ${sourceId} --> |${escapeLabel(symbol)}| ${targetId}\n`
    })

    return graph
  }

  const sanitizeId = (text) =>
    text.replace(/[{} ,]/g, '').replace(/[^a-zA-Z0-9_]/g, '_')

  const escapeLabel = (text) => text.replace(/"/g, '')

  if (!dfa) return null

  return (
    <div className="card">
      <div className="pb-4 border-b-2 border-gray-200 mb-6">
        <h2 className="text-2xl font-bold gradient-accent-text">
          DFA Transition Diagram
        </h2>
        <p className="text-gray-700 text-sm mt-1">Visual representation of the DFA</p>
      </div>

      <div
        ref={diagramRef}
        className="flex justify-center items-center min-h-64 bg-gray-50 rounded-lg border border-gray-200"
      >
        <p className="text-gray-500">Loading diagram...</p>
      </div>
    </div>
  )
}