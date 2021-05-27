import React from 'react'
import currency from 'currency.js'
import '@testing-library/jest-dom/extend-expect'

import { InvestorRequestForm, InvestorUpdateHandler } from '../../../frontend'
import { render, fireEvent, waitFor, screen } from '../../tools'
import { data } from '../../data'

describe('Investor Request Form', () => {
  it('matches snapshot', async () => {
    const request = data[0].request.investor_amounts[0]
    const onUpdate: InvestorUpdateHandler = (name, request) =>
      console.error(`onUpdate has not been mocked and received:`, name, request)

    const result = render(
      <InvestorRequestForm name={0} request={request} onUpdate={onUpdate} />,
      {},
    )

    expect(result.asFragment()).toMatchSnapshot()
  })

  it('populates fields', async () => {
    const request = data[0].request.investor_amounts[0]
    const onUpdate: InvestorUpdateHandler = (name, request) =>
      console.error(`onUpdate has not been mocked and received:`, name, request)

    render(<InvestorRequestForm name={0} request={request} onUpdate={onUpdate} />, {})

    const name = await inputFor('Name')
    expect(name.value).toEqual(request.name)

    const requested = await inputFor('Requested Amount')
    expect(currency(requested.value).value).toEqual(request.requested_amount)

    const average = await inputFor('Average Amount')
    expect(currency(average.value).value).toEqual(request.average_amount)
  })
})

function inputFor(placeholder: string) {
  return waitFor(() => screen.getByPlaceholderText(placeholder) as HTMLInputElement)
}
