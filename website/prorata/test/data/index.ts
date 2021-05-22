import { AllocationRequest, AllocationResponse } from '../../server'

import complex_1_input from './complex_1_input.json'
import complex_1_output from './complex_1_output.json'

import complex_2_input from './complex_2_input.json'
import complex_2_output from './complex_2_output.json'

import simple_1_input from './simple_1_input.json'
import simple_1_output from './simple_1_output.json'

import simple_2_input from './simple_2_input.json'
import simple_2_output from './simple_2_output.json'

// TODO reconcile the duplication
export type TestData = {
  input: AllocationRequest
  output: AllocationTestResult
  request: AllocationRequest
  response: AllocationResponse
}

export type Investor = {
  name: string
  requested_amount: number
  average_amount: number
}

export type AllocationTestResult = Record<string, number>

export const data: TestData[] = [
  { input: simple_1_input, output: simple_1_output },
  { input: simple_2_input, output: simple_2_output },
  { input: complex_1_input, output: complex_1_output },
  { input: complex_2_input, output: complex_2_output },
].map(
  (testcase): TestData => ({
    ...testcase,
    request: testcase.input,
    response: responseFor(testcase.output),
  })
)

export function outputFor({
  allocations,
}: AllocationResponse): AllocationTestResult {
  const prorated = {}
  for (let investor of allocations) {
    prorated[investor.name] = investor.allocation
  }

  return prorated
}

export function responseFor(result: AllocationTestResult): AllocationResponse {
  let allocations = []
  for (let name of Object.keys(result)) {
    allocations.push({ name, allocation: result[name] })
  }
  return { allocations }
}
