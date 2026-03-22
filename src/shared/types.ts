export interface Settings {
  groqApiKey: string
  openaiApiKey: string
  hotkey: string
}

export interface RecordingState {
  isRecording: boolean
  status: 'idle' | 'recording' | 'transcribing' | 'refining' | 'pasting'
}

export interface PasteResult {
  success: boolean
  error?: string
}
