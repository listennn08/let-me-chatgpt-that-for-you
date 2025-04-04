'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion, useAnimate, useMotionValue } from 'motion/react'

function Home() {
  const [search, setSearch] = useState('')
  const [step, setStep] = useState(0)
  const [result, setResult] = useState('')
  const searchParams = useSearchParams()
  const q = searchParams.get('q')
  const [scope, animate] = useAnimate()
  const cursorX = useMotionValue(0)
  const cursorY = useMotionValue(0)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  const runCursorToTextareaAnimation = useCallback(async () => {
    if (!textareaRef.current) return
    const { top, left } = textareaRef.current.getBoundingClientRect()
    const textareaHeight = textareaRef.current.offsetHeight
    cursorX.set(left)
    cursorY.set(top + textareaHeight / 2)
    await animate(scope.current, {
      top: cursorY.get(),
      left: cursorX.get()
    }, {
      duration: 1,
      ease: 'easeInOut'
    })
    textareaRef.current?.focus()
  }, [cursorX, cursorY, animate, scope])

  const runCursorToButtonAnimation = useCallback(async () => {
    if (!buttonRef.current) return
    const { top, left } = buttonRef.current.getBoundingClientRect()
    const buttonWidth = buttonRef.current.offsetWidth
    const buttonHeight = buttonRef.current.offsetHeight
    cursorX.set(left + buttonWidth / 2)
    cursorY.set(top + buttonHeight / 2)
    await animate(scope.current, {
      top: cursorY.get(),
      left: cursorX.get()
    }, {
      duration: 1.5,
      ease: 'easeInOut'
    })
    setStep(3)

    setTimeout(() => {
      buttonRef.current?.click()
    }, 1200)
  }, [cursorX, cursorY, animate, scope])

  useEffect(() => {
    if (q)  {
      runCursorToTextareaAnimation()
    }
  }, [runCursorToTextareaAnimation, q])

  useEffect(() => {
    if (q) {
      setStep(1)
      let i = 0
      setTimeout(() => {
        const interval = setInterval(() => {
          if (i < q.length) {
            setSearch(q.slice(0, i + 1))
            i++
          } else {
            setStep(2)
            runCursorToButtonAnimation()
            clearInterval(interval)
          }
        }, 100)
      }, 2000)
    }
  }, [q, runCursorToButtonAnimation])

  function handleClick() {
    setResult(`${window.location.origin}/?q=${search}`)
  }

  function handleClickInput() {
    // select all text in input
    const input = document.activeElement as HTMLInputElement
    input.select()
    input.setSelectionRange(0, input.value.length)
  }

  return (
    <div className="pt-header-h">
      <header>
        <div className="h-header-h duration-medium px-sm md:px-md bg-secondary-100 fixed left-0 right-0 top-0 flex justify-end transition z-[51]"></div>
        <div className="-ml-5xs left-sm md:left-md duration-medium fixed top-0 transition-transform z-[53]">
          <div className="px-4 py-2 text-3xl font-bold">
            Let Me ChatGPT That For You
          </div>
        </div>
      </header>
      <div className="px-6 md:px-8 md:-mb-3xl max-w-container md:h-[calc(100svh-12px-var(--header-h))] h-[calc(100svh-var(--header-h))] max-h-[920px] min-h-[400px] w-full">
        <div className="relative flex h-full w-full flex-col justify-center">
          <div className="duration-short ease-curve-a flex flex-col items-center justify-center opacity-100 transition-opacity">
            <span className="text-chatgpt-title mb-5 mx-auto text-center">What can I help with?</span>
            <div className="@container relative z-40 mx-auto w-full max-w-[768px]">
              <form className="relative" target="_blank" action="https://chatgpt.com">
                <label className="md:rounded-3xl border-[#0000001f] dark:bg-[#ffffff1f] border bg-white shadow-splash-chatpgpt-input relative flex w-full cursor-text flex-col overflow-hidden rounded-2xl px-4 pb-[52px] pt-4 mb-17">
                  <div className="sr-only">Message ChatGPT</div>
                  <div className="text-[#00000099] min-h-sm pointer-events-none absolute left-0 top-0 w-full select-none px-4 pt-4">
                    <div className="transition-transform ease-in-out duration-500 leading-6" style={{ transform: 'translateY(-39rem)' }}>
                      <div className="overflow-hidden text-ellipsis whitespace-nowrap transition-opacity duration-500 opacity-0">Quiz me on vocabulary</div>
                    </div>
                  </div>
                  <textarea
                    ref={textareaRef}
                    className="placeholder:text-[#00000099] dark:placeholder:text-[#ffffff99] text-p2 w-full resize-none bg-transparent !text-base focus:outline-none"
                    rows={2}
                    name="q"
                    style={{ height: 48 }}
                    spellCheck={false}
                    placeholder="Let Me ChatGPT That For You"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  >
                  </textarea>
                </label>
                <div className="absolute bottom-3 right-3 mt-auto flex justify-end">
                  {q ? (
                      <button
                      ref={buttonRef}
                      className="bg-black text-white dark:bg-white dark:text-black disabled:bg-[#f6f6f6] disabled:text-[#00000070] dark:disabled:bg-[#424242] dark:disabled:text-[#ffffff70] relative h-9 w-9 rounded-full p-0 transition-colors hover:opacity-70 disabled:hover:opacity-100"
                      type="submit"
                      disabled={search === ''}
                      aria-label="Send prompt to ChatGPT"
                  >
                    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 22L16 10M16 10L11 15M16 10L21 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  </button>
                  ) : (
                  <button type="button" onClick={handleClick}>
                    <svg width="36" height="36" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M16 22L16 10M16 10L11 15M16 10L21 15" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"></path></svg>
                  </button>
                  )}
                </div>
              </form>
              <div className="fixed inset-x-1/2 -translate-x-1/2 w-100 text-black p-4 text-center">
                <div className="bg-cyan-300 mb-2 h-20 flex items-center justify-center">
                  {step === 0 && !result && 'Type your question and click a button'}
                  {step === 0 && result && 'All done! Share the link below.'}
                  {step === 1 && 'Step 1: Type your question'}
                  {step === 2 && 'Step 2: Click the Search button'}
                  {step === 3 && 'Come on... Was that really so hard?'}
                </div>
                {result && <input type="text" value={result} onClick={handleClickInput} className="border border-gray-300 rounded dark:text-white p-2 cursor-pointer" readOnly />}
              </div>

            </div>
          </div>
        </div>
      </div>
      {q && (
        <motion.img 
          ref={scope}
          src="/cursor1.png"
          initial={{
            position: 'fixed',
            top: 0,
            left: 0,
            height: 24,
            zIndex: 9999,
          }}
        />
      )}
    </div>
  )
}

export default Home
