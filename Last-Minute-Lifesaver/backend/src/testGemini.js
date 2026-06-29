import './loadEnv.js'
import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = process.env.GEMINI_API_KEY
if (!apiKey) {
  throw new Error('GEMINI_API_KEY environment variable is required to run this script.')
}

const genAI = new GoogleGenerativeAI(apiKey)
const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
})

console.time('Gemini')

try {
  const result = await model.generateContent('Write one sentence about AI.')
  console.timeEnd('Gemini')
  console.log(result.response.text())
} catch (e) {
  console.error('Gemini test error:', e)
}
