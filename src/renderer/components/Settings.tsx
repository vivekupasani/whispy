import React, { useState, useEffect } from 'react'

interface SettingsProps {
  onBack: () => void
}

interface HotkeyOption {
  value: string
  label: string
}

export default function Settings({ onBack }: SettingsProps) {
  const [groqApiKey, setGroqApiKey] = useState('')
  const [openaiApiKey, setOpenaiApiKey] = useState('')
  const [hotkey, setHotkey] = useState('rightOption')
  const [hotkeyOptions, setHotkeyOptions] = useState<HotkeyOption[]>([])
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadSettings()
    loadHotkeyOptions()
  }, [])

  const loadSettings = async () => {
    const settings = await window.electronAPI.getSettings()
    setGroqApiKey(settings.groqApiKey || '')
    setOpenaiApiKey(settings.openaiApiKey || '')
    setHotkey(settings.hotkey || 'rightOption')
  }

  const loadHotkeyOptions = async () => {
    const options = await window.electronAPI.getHotkeyOptions()
    setHotkeyOptions(options)
  }

  const handleSave = async () => {
    await window.electronAPI.saveSettings({ groqApiKey, openaiApiKey, hotkey })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '10px 12px',
    background: '#222',
    border: '1px solid #333',
    borderRadius: '6px',
    color: 'white',
    fontSize: '14px',
    boxSizing: 'border-box'
  }

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    color: '#888'
  }

  return (
    <div style={{
      height: '100%',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      {/* Form */}
      <div style={{ padding: '22px 20px', flex: 1, overflowY: 'auto' }}>
        {/* Groq API Key */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Groq API Key (required)</label>
          <input
            type="password"
            value={groqApiKey}
            onChange={(e) => setGroqApiKey(e.target.value)}
            placeholder="gsk_..."
            style={inputStyle}
          />
        </div>

        {/* OpenAI API Key */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>OpenAI API Key (optional)</label>
          <input
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            placeholder="sk-..."
            style={inputStyle}
          />
        </div>

        {/* Hotkey Selection */}
        <div style={{ marginBottom: '14px' }}>
          <label style={labelStyle}>Push-to-Talk Key (hold to record)</label>
          <select
            value={hotkey}
            onChange={(e) => setHotkey(e.target.value)}
            style={{
              ...inputStyle,
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='%23888' viewBox='0 0 24 24'%3E%3Cpath d='M7 10l5 5 5-5z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 8px center',
              backgroundSize: '20px'
            }}
          >
            {hotkeyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          style={{
            padding: '8px 20px',
            background: saved ? 'rgba(255, 255, 255, 0.1)' : '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '8px',
            color: saved ? '#888' : '#000',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            marginTop: '12px',
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        >
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>
    </div>
  )
}
