import React from 'react'
import '@testing-library/jest-dom/extend-expect'

import { AllocationRequest, AllocationResponse } from '../../common'
import { Home } from '../../pages'
import { render, fireEvent, waitFor, screen } from '../tools'
import { data } from '../data'

describe('Home page', () => {
  it('matches snapshot', async () => {
    const result = render(<Home />, {})
    await waitFor(() => screen.getByText('Investor Breakdown'))

    expect(result.asFragment()).toMatchSnapshot()
  })
})
