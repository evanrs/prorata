import React from 'react'
import '@testing-library/jest-dom/extend-expect'

import { Prorata } from '../../frontend'
import { render, fireEvent, waitFor, screen } from '../tools'
import { data } from '../data'

describe('Prorata', () => {
  const allocationFor = (request: unknown) => {
    console.error(`allocationFor has not been mocked and received:`, request)
  }

  it('matches snapshot', async () => {
    const result = render(<Prorata allocationFor={allocationFor} />, {})
    await waitFor(() => screen.getByText('Total Available Allocation'))

    expect(result.asFragment()).toMatchSnapshot()
  })
})
