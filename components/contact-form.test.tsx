import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ContactForm } from './contact-form'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { useLocale } from '@/lib/locale-context'
import { translations } from '@/lib/i18n'

// Mock useLocale
vi.mock('@/lib/locale-context', () => ({
  useLocale: vi.fn(),
}))

describe('ContactForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    localStorage.clear()

    // Setup default mock return value
    vi.mocked(useLocale).mockReturnValue({
      t: translations.sv,
      locale: 'sv',
      setLocale: vi.fn(),
    })
  })

  it('renders the form correctly', () => {
    render(<ContactForm />)

    expect(
      screen.getByRole('heading', { name: translations.sv.contact.title })
    ).toBeInTheDocument()
    expect(screen.getByLabelText(translations.sv.contact.name)).toBeInTheDocument()
    expect(screen.getByLabelText(translations.sv.contact.email)).toBeInTheDocument()
    expect(screen.getByLabelText(translations.sv.contact.phone)).toBeInTheDocument()
    expect(screen.getByLabelText(translations.sv.contact.service)).toBeInTheDocument()
    expect(screen.getByLabelText(translations.sv.contact.message)).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: translations.sv.contact.submit })
    ).toBeInTheDocument()
  })

  it('submits the form and saves to localStorage', async () => {
    render(<ContactForm />)

    const testData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123456789',
      service: translations.sv.contact.serviceOptions[0],
      message: 'Hello world',
    }

    fireEvent.change(screen.getByLabelText(translations.sv.contact.name), {
      target: { value: testData.name },
    })
    fireEvent.change(screen.getByLabelText(translations.sv.contact.email), {
      target: { value: testData.email },
    })
    fireEvent.change(screen.getByLabelText(translations.sv.contact.phone), {
      target: { value: testData.phone },
    })
    fireEvent.change(screen.getByLabelText(translations.sv.contact.service), {
      target: { value: testData.service },
    })
    fireEvent.change(screen.getByLabelText(translations.sv.contact.message), {
      target: { value: testData.message },
    })

    const submitButton = screen.getByRole('button', {
      name: translations.sv.contact.submit,
    })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(translations.sv.contact.success)).toBeInTheDocument()
    })

    const stored = JSON.parse(localStorage.getItem('kamiljo_messages') || '[]')
    expect(stored).toHaveLength(1)
    expect(stored[0]).toMatchObject(testData)
    // Check if timestamp exists
    expect(stored[0].timestamp).toBeDefined()
  })

  it('handles submission errors gracefully', async () => {
    // Mock localStorage.setItem to throw error
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem')
    setItemSpy.mockImplementation(() => {
      throw new Error('Storage full')
    })

    render(<ContactForm />)

    fireEvent.change(screen.getByLabelText(translations.sv.contact.name), {
      target: { value: 'Test' },
    })
    // ... fill other required fields if strictly required by HTML5 validation, but fireEvent submits anyway usually?
    // Actually validation prevents submission if using proper submit event.
    // Let's fill all required.
    fireEvent.change(screen.getByLabelText(translations.sv.contact.email), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(translations.sv.contact.service), {
      target: { value: translations.sv.contact.serviceOptions[0] },
    })
    fireEvent.change(screen.getByLabelText(translations.sv.contact.message), {
      target: { value: 'Test' },
    })

    const submitButton = screen.getByRole('button', {
      name: translations.sv.contact.submit,
    })
    fireEvent.click(submitButton)

    // The code catches error and stops loading, but doesn't set submitted=true.
    // So we expect to still see the form.
    await waitFor(() => {
        expect(screen.getByRole('button', { name: translations.sv.contact.submit })).not.toBeDisabled()
    })

    // Should NOT show success message
    expect(screen.queryByText(translations.sv.contact.success)).not.toBeInTheDocument()

    setItemSpy.mockRestore()
  })
})
