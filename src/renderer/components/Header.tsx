import React from 'react'

interface HeaderProps {
  currentView: 'main' | 'settings'
  onNavigate: (view: 'main' | 'settings') => void
}

export default function Header({ currentView, onNavigate }: HeaderProps) {
  const navButtonStyle = (view: 'main' | 'settings'): React.CSSProperties => ({
    background: currentView === view ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    border: 'none',
    color: currentView === view ? '#fff' : '#888',
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backdropFilter: currentView === view ? 'blur(10px)' : 'none',
    boxShadow: currentView === view ? '0 4px 12px rgba(0, 0, 0, 0.1)' : 'none',
  })

  return (
    <header style={{
      padding: '16px 24px',
      // borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'rgba(5, 5, 5, 0.8)',
      backdropFilter: 'blur(20px)',
      position: 'sticky',
      bottom: 0,
      zIndex: 100,
    }}>
      <nav style={{
        display: 'flex',
        gap: '4px',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '4px',
        borderRadius: '10px',
        border: '1px solid rgba(255, 255, 255, 0.05)',
      }}>
        <button
          onClick={() => onNavigate('main')}
          style={navButtonStyle('main')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          style={navButtonStyle('settings')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" />
          </svg>
        </button>
      </nav>
    </header>
  )
}
