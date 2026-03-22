import Groq from 'groq-sdk'

export async function transcribeAudio(audioBlob: Blob, apiKey: string): Promise<string> {
  const groq = new Groq({
    apiKey,
    dangerouslyAllowBrowser: true // Required for browser/renderer context
  })

  // Convert blob to File object for the API
  const audioFile = new File([audioBlob], 'recording.webm', {
    type: 'audio/webm'
  })

  try {
    const transcription = await groq.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-large-v3',
      response_format: 'text',
      language: 'en' // You can make this configurable
    })

    return transcription.trim()
  } catch (error) {
    console.error('Transcription error:', error)
    throw new Error('Failed to transcribe audio')
  }
}
