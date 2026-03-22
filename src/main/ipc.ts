import { ipcMain, BrowserWindow, clipboard } from 'electron'
import { store } from './store'
import { setRecordingState, getRecordingState, setHotkey, getHotkey, getHotkeyLabel, getHotkeyOptions } from './hotkey'
import { sendOverlayStatus, hideOverlay } from './overlay'

export function setupIPC(mainWindow: BrowserWindow): void {
  // Settings handlers
  ipcMain.handle('get-settings', () => {
    return {
      groqApiKey: store.get('groqApiKey'),
      openaiApiKey: store.get('openaiApiKey'),
      hotkey: getHotkey(),
      hotkeyLabel: getHotkeyLabel()
    }
  })

  ipcMain.handle('save-settings', (_, settings: { groqApiKey?: string; openaiApiKey?: string; hotkey?: string }) => {
    if (settings.groqApiKey !== undefined) {
      store.set('groqApiKey', settings.groqApiKey)
    }
    if (settings.openaiApiKey !== undefined) {
      store.set('openaiApiKey', settings.openaiApiKey)
    }
    if (settings.hotkey !== undefined) {
      setHotkey(settings.hotkey)
    }
    return true
  })

  // Hotkey options
  ipcMain.handle('get-hotkey-options', () => {
    return getHotkeyOptions()
  })

  // Recording state handlers
  ipcMain.handle('get-recording-state', () => {
    return getRecordingState()
  })

  ipcMain.handle('set-recording-state', (_, state: boolean) => {
    setRecordingState(state, mainWindow)
    return state
  })

  // Clipboard and paste handler
  ipcMain.handle('paste-text', async (_, text: string) => {
    clipboard.writeText(text)

    // Delay to ensure focus is stable in target app
    await new Promise(resolve => setTimeout(resolve, 150))

    try {
      const { keyboard, Key } = await import('@nut-tree-fork/nut-js')

      // Configure faster typing
      keyboard.config.autoDelayMs = 0

      if (process.platform === 'darwin') {
        await keyboard.pressKey(Key.LeftMeta, Key.V)
        await new Promise(resolve => setTimeout(resolve, 50))
        await keyboard.releaseKey(Key.LeftMeta, Key.V)
      } else {
        await keyboard.pressKey(Key.LeftControl, Key.V)
        await new Promise(resolve => setTimeout(resolve, 50))
        await keyboard.releaseKey(Key.LeftControl, Key.V)
      }
      return { success: true }
    } catch (error) {
      console.error('Failed to simulate paste:', error)
      return { success: false, error: 'Text copied to clipboard' }
    }
  })

  // Overlay status handler
  ipcMain.on('update-overlay-status', (_, status: string) => {
    sendOverlayStatus(status as 'listening' | 'processing')
  })

  // Hide overlay handler
  ipcMain.on('hide-overlay', () => {
    hideOverlay()
  })
}
