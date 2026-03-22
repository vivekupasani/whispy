interface Settings {
  groqApiKey: string
  openaiApiKey: string
  hotkey: string
  hotkeyLabel: string
}

interface HotkeyOption {
  value: string
  label: string
}

interface PasteResult {
  success: boolean
  error?: string
}

interface ElectronAPI {
  getSettings: () => Promise<Settings>
  saveSettings: (settings: { groqApiKey?: string; openaiApiKey?: string; hotkey?: string }) => Promise<boolean>
  getHotkeyOptions: () => Promise<HotkeyOption[]>
  getRecordingState: () => Promise<boolean>
  setRecordingState: (state: boolean) => Promise<boolean>
  pasteText: (text: string) => Promise<PasteResult>
  onRecordingStateChanged: (callback: (isRecording: boolean) => void) => () => void
  onOverlayStatus: (callback: (status: string) => void) => () => void
  updateOverlayStatus: (status: string) => void
  hideOverlay: () => void
}

declare global {
  interface Window {
    electronAPI: ElectronAPI
  }
}

export {}
