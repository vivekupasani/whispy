import { Tray, Menu, nativeImage, BrowserWindow, app } from 'electron'
import { join } from 'path'

let tray: Tray | null = null

export function setupTray(mainWindow: BrowserWindow): void {
  // Create a simple tray icon (16x16 template image for macOS)
  const iconPath = join(__dirname, '../../resources/trayIcon.png')

  // Create a simple icon if the file doesn't exist
  let icon: nativeImage
  try {
    icon = nativeImage.createFromPath(iconPath)
    if (icon.isEmpty()) {
      // Create a simple 16x16 icon programmatically
      icon = createDefaultIcon()
    }
  } catch {
    icon = createDefaultIcon()
  }

  // Make it a template image for macOS (adapts to light/dark mode)
  icon = icon.resize({ width: 16, height: 16 })
  if (process.platform === 'darwin') {
    icon.setTemplateImage(true)
  }

  tray = new Tray(icon)
  tray.setToolTip('Whispy - AI Dictation')

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Settings',
      click: () => {
        mainWindow.show()
        mainWindow.focus()
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setContextMenu(contextMenu)

  // Click on tray icon shows/hides the window
  tray.on('click', () => {
    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
      mainWindow.focus()
    }
  })
}

function createDefaultIcon(): nativeImage {
  // Create a simple 16x16 microphone-like icon
  // This is a basic placeholder - you can replace with a proper icon later
  const size = 16
  const canvas = Buffer.alloc(size * size * 4) // RGBA

  // Draw a simple circle (microphone placeholder)
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4
      const dx = x - size / 2
      const dy = y - size / 2
      const dist = Math.sqrt(dx * dx + dy * dy)

      if (dist < size / 3) {
        // Inner circle - white/filled
        canvas[idx] = 255     // R
        canvas[idx + 1] = 255 // G
        canvas[idx + 2] = 255 // B
        canvas[idx + 3] = 255 // A
      } else if (dist < size / 2 - 1) {
        // Outer ring
        canvas[idx] = 200
        canvas[idx + 1] = 200
        canvas[idx + 2] = 200
        canvas[idx + 3] = 255
      }
    }
  }

  return nativeImage.createFromBuffer(canvas, { width: size, height: size })
}

export function updateTrayIcon(isRecording: boolean): void {
  if (!tray) return

  // Could update icon to show recording state
  tray.setToolTip(isRecording ? 'Whispy - Recording...' : 'Whispy - AI Dictation')
}

export { tray }
