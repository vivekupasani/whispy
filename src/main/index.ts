import { app, BrowserWindow, ipcMain, Menu } from 'electron'
import { join } from 'path'
import { setupTray } from './tray'
import { setupHotkey, cleanupHotkey } from './hotkey'
import { setupIPC } from './ipc'
import { createOverlayWindow } from './overlay'
import { store } from './store'

let mainWindow: BrowserWindow | null = null

function createWindow(): void {
  // Check if API keys are already set
  const hasApiKey = !!store.get('groqApiKey')

  mainWindow = new BrowserWindow({
    width: 320,
    height: 450,
    show: true, // Show immediately on launch
    frame: true,
    resizable: false,
    title: 'Whispy',
    skipTaskbar: false, // Show in taskbar
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
      backgroundThrottling: false // Keep running in background
    }
  })

  // Load the renderer - electron-vite sets ELECTRON_RENDERER_URL in dev
  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  // Show window only if no API key set (first time setup)
  // Otherwise run in background
  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show()
    mainWindow?.focus()
  })

  // Hide instead of close when clicking X
  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault()
      mainWindow?.hide()
    }
  })
}

// Track if app is quitting
let isQuitting = false

app.whenReady().then(() => {
  // Remove default menu bar (File, Edit, etc.)
  Menu.setApplicationMenu(null)
  createWindow()
  createOverlayWindow()
  setupTray(mainWindow!)
  setupHotkey(mainWindow!)
  setupIPC(mainWindow!)
})

// ... isQuitting variable is used above

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('before-quit', () => {
  isQuitting = true
})

app.on('will-quit', () => {
  cleanupHotkey()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

export { mainWindow }
