import OpenAI from 'openai'

const SYSTEM_PROMPT = `You are a text refinement assistant. Your job is to clean up transcribed speech and make it ready to read.

Rules:
1. Remove filler words like "um", "uh", "like", "you know", "basically", "actually", "I mean"
2. Fix grammar and punctuation
3. Preserve the original meaning and tone
4. Keep it concise but don't remove important content
5. Output ONLY the refined text, nothing else

Do not add any commentary, explanations, or formatting. Just output the cleaned text.`

export async function refineText(transcript: string, apiKey: string): Promise<string> {
  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // Required for browser/renderer context
  })
  console.log("heyyy")
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: transcript }
      ],
      temperature: 0.3, // Low temperature for consistent output
      max_tokens: 1000
    })

    const refinedText = response.choices[0]?.message?.content?.trim()

    if (!refinedText) {
      console.warn('No refined text returned, using original transcript')
      return transcript
    }

    return refinedText
  } catch (error) {
    console.error('Refinement error:', error)
    // Fall back to original transcript if refinement fails
    return transcript
  }
}
