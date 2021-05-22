import { NextApiHandler } from 'next'

const handler: NextApiHandler = async (req, res) => {
  res.status(200).json({ path: '/api' })
}

export default handler
