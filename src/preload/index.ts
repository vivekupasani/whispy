import { contextBridge, ipcRenderer } from 'electron'

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

contextBridge.exposeInMainWorld('electronAPI', {
  getSettings: (): Promise<Settings> => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: { groqApiKey?: string; openaiApiKey?: string; hotkey?: string }): Promise<boolean> =>
    ipcRenderer.invoke('save-settings', settings),
  getHotkeyOptions: (): Promise<HotkeyOption[]> => ipcRenderer.invoke('get-hotkey-options'),
  getRecordingState: (): Promise<boolean> => ipcRenderer.invoke('get-recording-state'),
  setRecordingState: (state: boolean): Promise<boolean> => ipcRenderer.invoke('set-recording-state', state),
  pasteText: (text: string): Promise<PasteResult> => ipcRenderer.invoke('paste-text', text),
  onRecordingStateChanged: (callback: (isRecording: boolean) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, isRecording: boolean) => {
      callback(isRecording)
    }
    ipcRenderer.on('recording-state-changed', handler)
    return () => ipcRenderer.removeListener('recording-state-changed', handler)
  },
  onOverlayStatus: (callback: (status: string) => void) => {
    const handler = (_event: Electron.IpcRendererEvent, status: string) => {
      callback(status)
    }
    ipcRenderer.on('overlay-status', handler)
    return () => ipcRenderer.removeListener('overlay-status', handler)
  },
  updateOverlayStatus: (status: string): void => {
    ipcRenderer.send('update-overlay-status', status)
  },
  hideOverlay: (): void => {
    ipcRenderer.send('hide-overlay')
  }
})
