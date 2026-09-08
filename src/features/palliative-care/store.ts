import { reactive } from 'vue'
import { createDemoState } from './demo-data'
import { createPalliativeDomain } from './domain'
import type { PalliativeState } from './types'

// Demo actions only change this open app session. Reloading starts the examples again.
// Previous prototype localStorage data is deliberately neither read nor changed.
function createStore() {
  const state = reactive<PalliativeState>(createDemoState())
  const api = createPalliativeDomain(state)
  function resetDemo() {
    Object.assign(state, createDemoState())
  }
  return {
    ...api,
    state,
    resetDemo,
    get cases() { return state.cases },
    get visits() { return state.visits },
    get equipment() { return state.equipment },
    get beds() { return state.beds },
    get teams() { return state.teams },
  }
}
let singleton: ReturnType<typeof createStore> | undefined
export function usePalliativeStore() { return singleton ??= createStore() }
