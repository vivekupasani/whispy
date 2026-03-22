import React, { useState, useEffect, useCallback, useRef } from 'react'
import Settings from './components/Settings'
import Header from './components/Header'
import { transcribeAudio } from './services/transcription'
import { refineText } from './services/refinement'

type View = 'main' | 'settings'

export default function App() {
  const [view, setView] = useState<View>('main')
  const [isRecording, setIsRecording] = useState(false)
  const [status, setStatus] = useState('Ready')
  const [hasApiKey, setHasApiKey] = useState(false)
  const [hotkeyLabel, setHotkeyLabel] = useState('Right Option')
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    checkApiKey()
  }, [view])

  useEffect(() => {
    const cleanup = window.electronAPI.onRecordingStateChanged(async (recording) => {
      setIsRecording(recording)
      if (recording) {
        await startRecording()
      } else {
        await stopRecording()
      }
    })
    return cleanup
  }, [])

  const checkApiKey = async () => {
    const settings = await window.electronAPI.getSettings()
    setHasApiKey(!!settings.groqApiKey)
    setHotkeyLabel(settings.hotkeyLabel || 'Right Option')
  }

  const startRecording = useCallback(async () => {
    try {
      setStatus('Listening...')
      chunksRef.current = []
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm;codecs=opus' })
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }
      recorder.onstop = async () => {
        stream.getTracks().forEach(track => track.stop())
        if (chunksRef.current.length > 0) {
          await processAudio(new Blob(chunksRef.current, { type: 'audio/webm' }))
        }
      }
      recorder.start(100)
      mediaRecorderRef.current = recorder
    } catch {
      setStatus('Mic access denied')
    }
  }, [])

  const stopRecording = useCallback(async () => {
    if (mediaRecorderRef.current?.state !== 'inactive') {
      mediaRecorderRef.current?.stop()
      mediaRecorderRef.current = null
    }
  }, [])

  const processAudio = async (audioBlob: Blob) => {
    try {
      setStatus('Transcribing...')
      window.electronAPI.updateOverlayStatus('processing')
      const settings = await window.electronAPI.getSettings()
      if (!settings.groqApiKey) {
        setStatus('No API key')
        window.electronAPI.hideOverlay()
        return
      }
      const transcript = await transcribeAudio(audioBlob, settings.groqApiKey)
      if (!transcript) {
        setStatus('No speech detected')
        window.electronAPI.hideOverlay()
        setTimeout(() => setStatus('Ready'), 2000)
        return
      }
      let finalText = transcript
      if (settings.openaiApiKey) {
        setStatus('Refining...')
        finalText = await refineText(transcript, settings.openaiApiKey)
      }
      // Hide overlay before pasting to ensure focus is on target app
      window.electronAPI.hideOverlay()
      setStatus('Pasting...')
      await window.electronAPI.pasteText(finalText)
      setStatus('Done!')
      setTimeout(() => setStatus('Ready'), 1500)
    } catch {
      setStatus('Error')
      window.electronAPI.hideOverlay()
      setTimeout(() => setStatus('Ready'), 2000)
    }
  }

  return (
    <div style={{
      height: '100vh',
      background: '#050505',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    }}>
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {view === 'main' ? (
          <div style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px'
          }}>
            {/* Mic indicator */}
            <div style={{
              width: '100px',
              height: '100px',
              borderRadius: '50%',
              background: isRecording ? '#ef4444' : '#333',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isRecording ? '0 0 40px rgba(239,68,68,0.4)' : 'none',
              transition: 'all 0.2s'
            }}>
              <svg width="40" height="40" fill="white" viewBox="0 0 24 24">
                <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
                <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
              </svg>
            </div>

            {/* Status */}
            <div style={{ fontSize: '15px', color: '#888' }}>
              {status}
            </div>

            {/* No API key warning */}
            {!hasApiKey && (
              <div style={{
                background: '#331',
                padding: '12px 20px',
                borderRadius: '8px',
                fontSize: '13px',
                color: '#fa0'
              }}>
                Add your Groq API key in Settings
              </div>
            )}

            {/* Footer text inside main view */}
            <div style={{
              position: 'absolute',
              bottom: '80px',
              left: 0,
              right: 0,
              textAlign: 'center',
              color: '#555',
              fontSize: '12px'
            }}>
              Hold <kbd style={{ fontWeight: "bold" }}>{hotkeyLabel}</kbd> to record
            </div>
          </div>
        ) : (
          <Settings onBack={() => setView('main')} />
        )}
      </main>
      <Header currentView={view} onNavigate={setView} />
    </div>
  )
}
