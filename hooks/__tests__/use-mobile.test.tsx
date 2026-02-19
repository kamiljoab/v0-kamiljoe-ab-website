import { renderHook, act } from '@testing-library/react'
import { useIsMobile } from '../use-mobile'

const MOBILE_BREAKPOINT = 768

describe('useIsMobile', () => {
  let matchMediaMock: jest.Mock
  let addEventListenerMock: jest.Mock
  let removeEventListenerMock: jest.Mock

  beforeEach(() => {
    // Reset window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    })

    addEventListenerMock = jest.fn()
    removeEventListenerMock = jest.fn()

    const mqlMock = {
      matches: false,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
      dispatchEvent: jest.fn(),
    }

    matchMediaMock = jest.fn().mockImplementation((query) => ({
      ...mqlMock,
      media: query,
    }))

    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: matchMediaMock,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('should return false when window width is greater than breakpoint', () => {
    window.innerWidth = 1024
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it('should return true when window width is less than breakpoint', () => {
    window.innerWidth = 500
    const { result } = renderHook(() => useIsMobile())
    expect(result.current).toBe(true)
  })

  it('should update value when resize event occurs', () => {
    window.innerWidth = 1024
    const { result } = renderHook(() => useIsMobile())

    expect(result.current).toBe(false)

    // Simulate resize
    window.innerWidth = 500

    // Trigger the change event
    // The hook calls mql.addEventListener('change', onChange)
    const calls = addEventListenerMock.mock.calls
    const changeCall = calls.find((call) => call[0] === 'change')

    expect(changeCall).toBeDefined()
    const onChange = changeCall[1]

    act(() => {
      onChange()
    })

    expect(result.current).toBe(true)

    // Resize back
    window.innerWidth = 1024

    act(() => {
        onChange()
    })

    expect(result.current).toBe(false)
  })

  it('should cleanup event listener', () => {
     const { unmount } = renderHook(() => useIsMobile())
     unmount()
     expect(removeEventListenerMock).toHaveBeenCalledWith('change', expect.any(Function))
  })
})
