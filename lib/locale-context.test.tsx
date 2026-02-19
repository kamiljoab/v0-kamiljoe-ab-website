import { render, screen, act, renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { LocaleProvider, useLocale } from './locale-context'
import { translations } from './i18n'

// Test component to consume the context
function TestComponent() {
  const { locale, t, setLocale } = useLocale()
  return (
    <div>
      <div data-testid="locale">{locale}</div>
      <div data-testid="translation-home">{t.nav.home}</div>
      <button onClick={() => setLocale('en')}>Switch to EN</button>
      <button onClick={() => setLocale('sv')}>Switch to SV</button>
    </div>
  )
}

describe('LocaleContext', () => {
  it('provides default locale (sv)', () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    )

    expect(screen.getByTestId('locale')).toHaveTextContent('sv')
    expect(screen.getByTestId('translation-home')).toHaveTextContent(translations.sv.nav.home)
  })

  it('allows switching locale', async () => {
    render(
      <LocaleProvider>
        <TestComponent />
      </LocaleProvider>
    )

    // Initial state
    expect(screen.getByTestId('locale')).toHaveTextContent('sv')

    // Switch to English
    act(() => {
      screen.getByText('Switch to EN').click()
    })

    expect(screen.getByTestId('locale')).toHaveTextContent('en')
    expect(screen.getByTestId('translation-home')).toHaveTextContent(translations.en.nav.home)

    // Switch back to Swedish
    act(() => {
      screen.getByText('Switch to SV').click()
    })

    expect(screen.getByTestId('locale')).toHaveTextContent('sv')
    expect(screen.getByTestId('translation-home')).toHaveTextContent(translations.sv.nav.home)
  })

  it('throws error when useLocale is used outside LocaleProvider', () => {
    // Suppress console.error because React logs the error boundary error
    const consoleError = console.error
    console.error = () => {}

    expect(() => {
      renderHook(() => useLocale())
    }).toThrow('useLocale must be used within a LocaleProvider')

    console.error = consoleError
  })
})
