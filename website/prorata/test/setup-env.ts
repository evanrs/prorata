import { api } from './api'

process.env.API_BASE_URL = 'http://localhost:3000'

beforeAll(() => api.listen())
afterEach(() => api.resetHandlers())
afterAll(() => api.close())
