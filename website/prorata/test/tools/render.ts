import { render as __render } from '@testing-library/react'

export * from '@testing-library/react'

const Providers = ({ children }) => children

export const render = (ui, options = {}) =>
  __render(ui, { wrapper: Providers, ...options })
