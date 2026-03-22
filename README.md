## Installation

```bash
# Clone the repository
git clone https://github.com/vivekupasani/JustWhisper.git
cd JustWhisper

# Install dependencies
npm install

# Run in development mode
npm run dev
```

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
