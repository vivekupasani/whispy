import React from 'react'

interface RecordingIndicatorProps {
  isRecording: boolean
}

export default function RecordingIndicator({ isRecording }: RecordingIndicatorProps) {
  return (
    <div className="relative">
      {/* Outer pulse animation when recording */}
      {isRecording && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-24 h-24 rounded-full bg-red-500/20 animate-ping" />
        </div>
      )}

      {/* Main indicator circle */}
      <div
        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-colors duration-200 ${
          isRecording
            ? 'bg-red-500 shadow-lg shadow-red-500/50'
            : 'bg-gray-700'
        }`}
      >
        {/* Microphone icon */}
        <svg
          className={`w-8 h-8 ${isRecording ? 'text-white' : 'text-gray-400'}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm-1-9c0-.55.45-1 1-1s1 .45 1 1v6c0 .55-.45 1-1 1s-1-.45-1-1V5z" />
          <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z" />
        </svg>
      </div>

      {/* Recording label */}
      {isRecording && (
        <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
          <span className="text-red-500 text-sm font-medium animate-pulse">
            Recording
          </span>
        </div>
      )}
    </div>
  )
}
