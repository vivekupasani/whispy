# JustWhisper

A serverless AI dictation app for windows and macOS. Hold a key, speak, and your words are transcribed and pasted instantly.

## Features

- **Push-to-Talk**: Hold a key to record, release to transcribe and paste
- **Fast Transcription**: Uses Groq's Whisper Large V3 for near-instant speech-to-text
- **Text Refinement**: Optional OpenAI integration to clean up filler words and fix grammar
- **Customizable Hotkeys**: Choose from Option, Command, Control, or any function key (F1-F12)
- **Auto-Paste**: Transcribed text is automatically pasted into your active application
- **System Tray**: Runs quietly in the background with a menu bar icon

## Prerequisites
- **windows** 10 or later
- **macOS** 10.15 (Catalina) or later
- **Node.js** 18.x or later
- **npm** 9.x or later

To check your versions:
```bash
node --version  # Should be v18.x or higher
npm --version   # Should be 9.x or higher
```

## Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/JustWhisper.git
cd JustWhisper

# Install dependencies
npm install

# Run in development mode
npm run dev
```

## API Keys Setup

JustWhisper requires at least one API key to function.

### 1. Groq API Key (Required for Transcription)

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Navigate to **API Keys** in the sidebar
4. Click **Create API Key**
5. Copy the key (starts with `gsk_...`)

Groq offers a generous free tier with fast transcription using Whisper Large V3.

### 2. OpenAI API Key (Optional for Text Cleanup)

1. Visit [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to **API Keys**
4. Click **Create new secret key**
5. Copy the key (starts with `sk-...`)

OpenAI is optional but recommended. It cleans up filler words (um, uh, like) and fixes grammar while preserving your meaning.

## First-Time Configuration

1. Launch JustWhisper
2. Click the **Settings** button
3. Enter your API keys:
   - Paste your Groq API key in the first field
   - (Optional) Paste your OpenAI API key in the second field
4. Choose your preferred hotkey from the dropdown
5. Click **Save**

## Permissions

JustWhisper requires these macOS permissions to function:

### Accessibility (Required)

This allows JustWhisper to detect global hotkeys and simulate the paste command.

1. Open **System Settings** > **Privacy & Security** > **Accessibility**
2. Click the lock icon and authenticate
3. Enable the toggle for **JustWhisper**

If JustWhisper isn't listed:
1. Click the **+** button
2. Navigate to `/Applications/JustWhisper.app` (or your dev build location)
3. Add and enable it

### Microphone (Required)

This allows JustWhisper to record your voice.

1. Open **System Settings** > **Privacy & Security** > **Microphone**
2. Enable the toggle for **JustWhisper**

If you're running from source:
- Grant permission to **Terminal** or your IDE instead

### Input Monitoring (May be required)

Some macOS versions require this for global keyboard detection.

1. Open **System Settings** > **Privacy & Security** > **Input Monitoring**
2. Enable the toggle for **JustWhisper**

## Usage

1. **Position your cursor** where you want text to appear
2. **Hold your hotkey** (default: Option key)
3. **Speak clearly** into your microphone
4. **Release the key** when done
5. Wait briefly for processing
6. Text is automatically pasted at your cursor

### Tips for Best Results

- Speak clearly and at a natural pace
- Avoid background noise when possible
- Keep phrases concise for faster processing
- The status indicator shows when recording is active

## Hotkey Options

| Hotkey | Description |
|--------|-------------|
| **Option** | Either left or right Option key (default) |
| **Command** | Either left or right Command key |
| **Control** | Either left or right Control key |
| **Right Option** | Only the right Option key |
| **Right Command** | Only the right Command key |
| **F1 (Mic)** | Function key 1 (microphone key on many Macs) |
| **F2-F12** | Other function keys |

**Note**: For function keys to work without holding fn, enable:
**System Settings > Keyboard > "Use F1, F2, etc. keys as standard function keys"**

## Development

### Project Structure

```
src/
├── main/           # Electron main process
│   ├── index.ts    # App entry point
│   ├── hotkey.ts   # Global hotkey detection
│   ├── tray.ts     # System tray menu
│   └── ipc.ts      # IPC handlers
├── preload/        # Preload scripts
│   └── index.ts    # IPC bridge
└── renderer/       # React frontend
    ├── App.tsx     # Main UI
    ├── components/ # React components
    └── services/   # API integrations
```

### Commands

```bash
# Start development server with hot reload
npm run dev

# Type check without emitting
npm run typecheck

# Build the app (compile only)
npm run build

# Package for distribution
npm run package        # macOS (arm64)
npm run package:win    # Windows
npm run package:linux  # Linux
```

### Development Notes

- The app uses `uiohook-napi` for global keyboard hooks, which requires Accessibility permissions
- Audio is captured via the Web Audio API in the renderer process
- Settings are stored locally using `electron-store`

## Tech Stack

| Component | Technology |
|-----------|------------|
| Framework | Electron 40 |
| Frontend | React 19 + TypeScript |
| Styling | Tailwind CSS 4 |
| Build Tool | electron-vite |
| Transcription | Groq API (Whisper Large V3) |
| Text Refinement | OpenAI API (GPT-4o-mini) |
| Keyboard Hooks | uiohook-napi |
| Paste Simulation | @nut-tree-fork/nut-js |
| Settings | electron-store |

## Troubleshooting

### "JustWhisper" can't be opened because Apple cannot check it for malicious software

This happens because the app is unsigned. Right-click the app and select "Open", then click "Open" in the dialog.

### Hotkey not working

1. Ensure Accessibility permission is granted
2. Try restarting JustWhisper after granting permissions
3. Check if another app is using the same hotkey

### Recording but not pasting

1. Ensure you have a valid Groq API key
2. Check if Input Monitoring permission is enabled
3. Make sure your cursor is in a text field

### Audio not capturing

1. Grant Microphone permission in System Settings
2. Check that your microphone is working in other apps
3. Try selecting a different audio input device

### Settings not saving

If settings don't persist:
```bash
# Clear app data (this resets settings)
rm -rf ~/Library/Application\ Support/JustWhisper
```

## Privacy

- Audio is recorded only while holding the hotkey
- Audio is sent to Groq for transcription (required)
- Transcribed text is sent to OpenAI for refinement (optional)
- No audio or text is stored after processing
- API keys are stored locally on your machine

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
