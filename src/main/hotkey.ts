import { BrowserWindow } from 'electron'
import { uIOhook, UiohookKey } from 'uiohook-napi'
import { updateTrayIcon } from './tray'
import { store } from './store'
import { showOverlay, hideOverlay } from './overlay'

let isRecording = false
let mainWindowRef: BrowserWindow | null = null
let currentHotkey: string = 'fn'

// macOS Fn key keycode (not in UiohookKey enum)
const FN_KEY_CODE = 0 // 0x0 - macOS Fn/Globe key as reported by uiohook

// Hotkey definitions - some accept multiple keycodes (left or right)
const HOTKEY_CONFIG: Record<string, { keys: number[]; label: string }> = {
  'fn': {
    keys: [FN_KEY_CODE],
    label: 'Fn (Globe)'
  },
  'option': {
    keys: [UiohookKey.Alt, UiohookKey.AltRight],
    label: 'Option'
  },
  'command': {
    keys: [UiohookKey.Meta, UiohookKey.MetaRight],
    label: 'Command'
  },
  'control': {
    keys: [UiohookKey.Ctrl, UiohookKey.CtrlRight],
    label: 'Control'
  },
  'rightOption': {
    keys: [UiohookKey.AltRight],
    label: 'Right Option'
  },
  'rightCommand': {
    keys: [UiohookKey.MetaRight],
    label: 'Right Command'
  },
  'f1': { keys: [UiohookKey.F1], label: 'F1 (Mic)' },
  'f2': { keys: [UiohookKey.F2], label: 'F2' },
  'f3': { keys: [UiohookKey.F3], label: 'F3' },
  'f4': { keys: [UiohookKey.F4], label: 'F4' },
  'f5': { keys: [UiohookKey.F5], label: 'F5' },
  'f6': { keys: [UiohookKey.F6], label: 'F6' },
  'f7': { keys: [UiohookKey.F7], label: 'F7' },
  'f8': { keys: [UiohookKey.F8], label: 'F8' },
  'f9': { keys: [UiohookKey.F9], label: 'F9' },
  'f10': { keys: [UiohookKey.F10], label: 'F10' },
  'f11': { keys: [UiohookKey.F11], label: 'F11' },
  'f12': { keys: [UiohookKey.F12], label: 'F12' },
}

let pressedHotkeyCode: number | null = null

// Debug mode - set to true to log all key events
const DEBUG_KEYS = false

export function setupHotkey(mainWindow: BrowserWindow): void {
  mainWindowRef = mainWindow
  currentHotkey = (store.get('hotkey') as string) || 'fn'

  uIOhook.on('keydown', (e) => {
    // Debug: log all key presses
    if (DEBUG_KEYS) {
      console.log(`[KEY DOWN] keycode: ${e.keycode} (0x${e.keycode.toString(16).toUpperCase()})`)
    }

    const config = HOTKEY_CONFIG[currentHotkey]
    if (!config) return

    // Check if the pressed key is one of our hotkey keys
    if (config.keys.includes(e.keycode) && !isRecording) {
      console.log(`[HOTKEY] Starting recording with ${config.label}`)
      pressedHotkeyCode = e.keycode
      startRecording()
    }
  })

  uIOhook.on('keyup', (e) => {
    // Debug: log all key releases
    if (DEBUG_KEYS) {
      console.log(`[KEY UP] keycode: ${e.keycode} (0x${e.keycode.toString(16).toUpperCase()})`)
    }

    // Only stop if the same key that started recording is released
    if (e.keycode === pressedHotkeyCode && isRecording) {
      console.log(`[HOTKEY] Stopping recording`)
      pressedHotkeyCode = null
      stopRecording()
    }
  })

  uIOhook.start()
  console.log(`Push-to-talk ready: ${HOTKEY_CONFIG[currentHotkey]?.label || 'Fn (Globe)'} (hold to record)`)
  console.log(`[DEBUG] Listening for keycode(s): ${HOTKEY_CONFIG[currentHotkey]?.keys.map(k => `${k} (0x${k.toString(16).toUpperCase()})`).join(', ')}`)
}

function startRecording(): void {
  isRecording = true
  updateTrayIcon(true)
  showOverlay()
  mainWindowRef?.webContents.send('recording-state-changed', true)
}

function stopRecording(): void {
  isRecording = false
  updateTrayIcon(false)
  // Don't hide overlay here - let the renderer hide it after processing/pasting
  mainWindowRef?.webContents.send('recording-state-changed', false)
}

export function cleanupHotkey(): void {
  uIOhook.stop()
}

export function setHotkey(hotkey: string): void {
  if (HOTKEY_CONFIG[hotkey]) {
    currentHotkey = hotkey
    store.set('hotkey', hotkey)
    console.log(`Hotkey changed to: ${HOTKEY_CONFIG[hotkey].label}`)
  }
}

export function getHotkey(): string {
  return currentHotkey
}

export function getHotkeyLabel(): string {
  return HOTKEY_CONFIG[currentHotkey]?.label || 'Fn (Globe)'
}

export function getHotkeyOptions(): { value: string; label: string }[] {
  return Object.entries(HOTKEY_CONFIG).map(([value, config]) => ({
    value,
    label: config.label
  }))
}

export function getRecordingState(): boolean {
  return isRecording
}

export function setRecordingState(state: boolean, mainWindow: BrowserWindow): void {
  isRecording = state
  updateTrayIcon(isRecording)
  if (state) {
    showOverlay()
  }
  // Don't hide overlay here - let renderer control it after processing
  mainWindow.webContents.send('recording-state-changed', isRecording)
}
