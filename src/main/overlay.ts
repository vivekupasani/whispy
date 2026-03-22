import { BrowserWindow, screen } from 'electron'
import { join } from 'path'

let overlayWindow: BrowserWindow | null = null

// Tiny overlay dimensions
const OVERLAY_WIDTH = 120
const OVERLAY_HEIGHT = 28
const DOCK_MARGIN = 8 // pixels above dock

function getActiveDisplay() {
  // Get display where cursor is located
  const cursorPoint = screen.getCursorScreenPoint()
  return screen.getDisplayNearestPoint(cursorPoint)
}

export function createOverlayWindow(): void {
  if (overlayWindow) return

  const display = getActiveDisplay()
  const { x: displayX, y: displayY, width: screenWidth, height: screenHeight } = display.bounds
  const { height: workAreaHeight } = display.workArea

  // Calculate dock height (difference between screen height and work area height)
  const dockHeight = screenHeight - workAreaHeight

  // Position just above dock (or at bottom if no dock) on the active display
  const xPosition = displayX + Math.round((screenWidth - OVERLAY_WIDTH) / 2)
  const yPosition = displayY + screenHeight - dockHeight - OVERLAY_HEIGHT - DOCK_MARGIN

  overlayWindow = new BrowserWindow({
    width: OVERLAY_WIDTH,
    height: OVERLAY_HEIGHT,
    x: xPosition,
    y: yPosition,
    show: false,
    frame: false,
    transparent: true,
    resizable: false,
    movable: false,
    focusable: false,
    skipTaskbar: true, // Keep overlay out of taskbar
    alwaysOnTop: true,
    hasShadow: false,
    ...(process.platform === 'darwin' ? { type: 'panel' } : {}), // macOS only
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false
    }
  })

  // Make the window click-through and never take focus
  overlayWindow.setIgnoreMouseEvents(true, { forward: true })

  // Set window level to float above everything but not activate
  overlayWindow.setAlwaysOnTop(true, 'pop-up-menu', 1)
  overlayWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true })

  // Load the overlay renderer
  if (process.env.ELECTRON_RENDERER_URL) {
    overlayWindow.loadURL(`${process.env.ELECTRON_RENDERER_URL}/overlay.html`)
  } else {
    overlayWindow.loadFile(join(__dirname, '../renderer/overlay.html'))
  }

  // Open DevTools in development for debugging
  // if (process.env.NODE_ENV === 'development') {
  //   overlayWindow.webContents.openDevTools({ mode: 'detach' })
  // }

  overlayWindow.on('closed', () => {
    overlayWindow = null
  })
}

export function showOverlay(): void {
  if (!overlayWindow) {
    createOverlayWindow()
  }

  // Position on the active display (where cursor is)
  const display = getActiveDisplay()
  const { x: displayX, y: displayY, width: screenWidth, height: screenHeight } = display.bounds
  const { height: workAreaHeight } = display.workArea
  const dockHeight = screenHeight - workAreaHeight

  const xPosition = displayX + Math.round((screenWidth - OVERLAY_WIDTH) / 2)
  const yPosition = displayY + screenHeight - dockHeight - OVERLAY_HEIGHT - DOCK_MARGIN

  overlayWindow?.setPosition(xPosition, yPosition)
  overlayWindow?.showInactive() // Show without taking focus
  sendOverlayStatus('listening')
}

export function hideOverlay(): void {
  overlayWindow?.hide()
}

export function sendOverlayStatus(status: 'listening' | 'processing'): void {
  overlayWindow?.webContents.send('overlay-status', status)
}

export function getOverlayWindow(): BrowserWindow | null {
  return overlayWindow
}
