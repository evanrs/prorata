import React from 'react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import '@testing-library/jest-dom/extend-expect'

import { AllocationRequest, AllocationResponse } from '../../shared'
import { Home } from '../../pages'
import { render, fetch, fireEvent, act, waitFor, screen } from '../tools'
import { data } from '../data'

describe('Home page', () => {
  it('matches snapshot', async () => {
    const result = render(<Home />, {})
    await waitFor(() => screen.getByText('Investor A'))

    expect(result.asFragment()).toMatchSnapshot()
  })

  xit('clicking button triggers alert', () => {
    // const { getByText } = render(<Home />, {})
    // window.alert = jest.fn()
    // fireEvent.click(getByText('Test Button'))
    // expect(window.alert).toHaveBeenCalledWith('With typescript and Jest')
  })
})
