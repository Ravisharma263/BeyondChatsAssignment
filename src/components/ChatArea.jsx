"use client"

import { useState, useEffect, useRef } from "react"
import ChatHeader from "./ChatHeader"
import Message from "./Message"
import {
  Zap,
  Paperclip,
  Smile,
  ChevronDown,
  MessageSquareText,
  Bold,
  Italic,
  Code,
  Link,
  Maximize2,
} from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

const ChatArea = ({ contact, isMobile, onMenuToggle, onBack }) => {
  const [messageInput, setMessageInput] = useState("")
  const [showToolbar, setShowToolbar] = useState(false)
  const [showAIDropdown, setShowAIDropdown] = useState(false)
  const [toolbarPosition, setToolbarPosition] = useState({ x: 0, y: 0 })
  const [selectedText, setSelectedText] = useState("")
  const [selectionRange, setSelectionRange] = useState({ start: 0, end: 0 })
  const textAreaRef = useRef(null)
  const toolbarRef = useRef(null)
  const aiDropdownRef = useRef(null)
  const aiButtonRef = useRef(null)

  const aiMessage = useSelector((state) => state.aiMessage)
  const dispatch = useDispatch()

  useEffect(() => {
    if (aiMessage) {
      setMessageInput(aiMessage)
      dispatch({ type: "CLEAR_AI_MESSAGE" })
    }
  }, [aiMessage, dispatch])

  useEffect(() => {
    const textArea = textAreaRef.current
    if (textArea) {
      textArea.style.height = "auto"
      textArea.style.height = `${Math.min(400, Math.max(44, textArea.scrollHeight))}px`
    }
  }, [messageInput])

  // Handle click in textarea with text selection
  useEffect(() => {
    const handleTextAreaInteraction = (e) => {
      const textArea = textAreaRef.current
      if (!textArea) return

      // Get selection
      const start = textArea.selectionStart
      const end = textArea.selectionEnd
      const selected = messageInput.substring(start, end)

      setSelectedText(selected)
      setSelectionRange({ start, end })

      // Calculate position for toolbar
      const textAreaRect = textArea.getBoundingClientRect()
      const x = textAreaRect.left + textAreaRect.width / 2
      const y = textAreaRect.top - 60

      setToolbarPosition({ x, y })
      setShowToolbar(true)

      // Auto-select word if clicked without selection
      if (selected.length === 0 && e.type === "click") {
        const text = messageInput
        const clickPos = start

        // Find word boundaries
        let wordStart = clickPos
        let wordEnd = clickPos

        // Find start of word
        while (wordStart > 0 && /\w/.test(text[wordStart - 1])) {
          wordStart--
        }

        // Find end of word
        while (wordEnd < text.length && /\w/.test(text[wordEnd])) {
          wordEnd++
        }

        if (wordStart < wordEnd) {
          textArea.setSelectionRange(wordStart, wordEnd)
          setSelectedText(text.substring(wordStart, wordEnd))
          setSelectionRange({ start: wordStart, end: wordEnd })
        }
      }
    }

    const textArea = textAreaRef.current
    if (textArea) {
      textArea.addEventListener("click", handleTextAreaInteraction)
      textArea.addEventListener("mouseup", handleTextAreaInteraction)
      textArea.addEventListener("focus", handleTextAreaInteraction)
    }

    // Hide menus when clicking outside
    const handleClickOutside = (event) => {
      if (
        toolbarRef.current &&
        !toolbarRef.current.contains(event.target) &&
        aiDropdownRef.current &&
        !aiDropdownRef.current.contains(event.target) &&
        textAreaRef.current &&
        !textAreaRef.current.contains(event.target)
      ) {
        setShowToolbar(false)
        setShowAIDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      if (textArea) {
        textArea.removeEventListener("click", handleTextAreaInteraction)
        textArea.removeEventListener("mouseup", handleTextAreaInteraction)
        textArea.removeEventListener("focus", handleTextAreaInteraction)
      }
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [messageInput])

  const applyAIAction = (action) => {
    if (!selectedText && !messageInput) return

    const textToTransform = selectedText || messageInput
    let transformedText = textToTransform

    // Simulate AI transformations
    switch (action) {
      case "rephrase":
        transformedText = `${textToTransform} (rephrased)`
        break
      case "friendly":
        transformedText = `Hey! ${textToTransform} 😊`
        break
      case "formal":
        transformedText = `Please note that ${textToTransform.toLowerCase()}`
        break
      case "grammar":
        transformedText = textToTransform.replace(/\bi\b/g, "I").replace(/\bu\b/g, "you")
        break
      case "translate":
        transformedText = `${textToTransform} (translated)`
        break
      default:
        transformedText = textToTransform
        break
    }

    if (selectedText) {
      const newMessage =
        messageInput.substring(0, selectionRange.start) + transformedText + messageInput.substring(selectionRange.end)
      setMessageInput(newMessage)
    } else {
      setMessageInput(transformedText)
    }

    setShowToolbar(false)
    setShowAIDropdown(false)

    setTimeout(() => {
      textAreaRef.current?.focus()
    }, 0)
  }

  const applyFormatting = (format) => {
    const textArea = textAreaRef.current
    if (!textArea) return

    const start = selectionRange.start
    const end = selectionRange.end
    const selectedText = messageInput.substring(start, end)

    let formattedText = selectedText || "text"

    switch (format) {
      case "bold":
        formattedText = `**${formattedText}**`
        break
      case "italic":
        formattedText = `*${formattedText}*`
        break
      case "code":
        formattedText = `\`${formattedText}\``
        break
      case "link":
        formattedText = `[${formattedText}](url)`
        break
      case "h1":
        formattedText = `# ${formattedText}`
        break
      case "h2":
        formattedText = `## ${formattedText}`
        break
      default:
        break
    }

    const newMessage = messageInput.substring(0, start) + formattedText + messageInput.substring(end)

    setMessageInput(newMessage)
    setShowToolbar(false)

    setTimeout(() => {
      textAreaRef.current?.focus()
    }, 0)
  }

  const handleAIButtonClick = () => {
    setShowAIDropdown(!showAIDropdown)
  }

  const handleSendMessage = () => {
    if (!messageInput.trim()) return

    const newMessage = {
      id: Date.now(),
      sender: "agent",
      content: messageInput.trim(),
      state: "read",
      receivedTime: new Date().toISOString(),
      seenTime: null,
    }

    dispatch({
      type: "ADD_MESSAGE",
      payload: {
        contactId: contact.id,
        message: newMessage,
      },
    })

    setMessageInput("")
    setShowToolbar(false)
    setShowAIDropdown(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }

    if (e.key === "Escape") {
      setShowToolbar(false)
      setShowAIDropdown(false)
    }
  }

  if (!contact) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquareText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Select a conversation to start messaging</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex-1 flex flex-col bg-white relative ${isMobile ? "h-full" : "h-screen"}`}>
      <ChatHeader
        contact={contact}
        isMobile={isMobile}
        onMenuToggle={onMenuToggle}
        onBack={onBack}
        onOptionsToggle={() => {}}
      />

      {/* Message Area */}
      <div className="flex-1 p-6 overflow-y-auto">
        {contact.messages.map((message, index) => (
          <Message key={message.id} message={message} contactId={contact.id} index={index} />
        ))}
      </div>

      {/* Formatting Toolbar */}
      {showToolbar && (
        <div
          ref={toolbarRef}
          className="fixed z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex items-center space-x-1"
          style={{
            left: `${toolbarPosition.x}px`,
            top: `${toolbarPosition.y}px`,
            transform: "translateX(-50%)",
          }}
        >
          <div className="relative">
            <button
              ref={aiButtonRef}
              onClick={handleAIButtonClick}
              className={`px-2 py-1 rounded text-xs font-medium hover:bg-blue-200 transition-colors ${
                showAIDropdown ? "bg-blue-200 text-blue-700" : "bg-blue-100 text-blue-700"
              }`}
            >
              AI
            </button>

            {/* Compact AI Dropdown Menu - Positioned directly above AI button */}
            {showAIDropdown && (
              <div
                ref={aiDropdownRef}
                className="absolute bottom-full left-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-xl py-1 min-w-[180px] z-60"
              >
                <button
                  onClick={() => applyAIAction("rephrase")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 font-medium text-gray-900"
                >
                  Rephrase
                </button>
                <button
                  onClick={() => applyAIAction("tone")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-600"
                >
                  My tone of voice
                </button>
                <button
                  onClick={() => applyAIAction("friendly")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-600"
                >
                  More friendly
                </button>
                <button
                  onClick={() => applyAIAction("formal")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-600"
                >
                  More formal
                </button>
                <button
                  onClick={() => applyAIAction("grammar")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-600"
                >
                  Fix grammar & spelling
                </button>
                <button
                  onClick={() => applyAIAction("translate")}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 text-gray-600"
                >
                  Translate...
                </button>
              </div>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300"></div>
          <button onClick={() => applyFormatting("bold")} className="p-1 hover:bg-gray-100 rounded" title="Bold">
            <Bold className="w-4 h-4" />
          </button>
          <button onClick={() => applyFormatting("italic")} className="p-1 hover:bg-gray-100 rounded" title="Italic">
            <Italic className="w-4 h-4" />
          </button>
          <button onClick={() => applyFormatting("code")} className="p-1 hover:bg-gray-100 rounded" title="Code">
            <Code className="w-4 h-4" />
          </button>
          <button onClick={() => applyFormatting("link")} className="p-1 hover:bg-gray-100 rounded" title="Link">
            <Link className="w-4 h-4" />
          </button>
          <button
            onClick={() => applyFormatting("h1")}
            className="px-2 py-1 hover:bg-gray-100 rounded text-sm font-medium"
            title="Heading 1"
          >
            H1
          </button>
          <button
            onClick={() => applyFormatting("h2")}
            className="px-2 py-1 hover:bg-gray-100 rounded text-sm font-medium"
            title="Heading 2"
          >
            H2
          </button>
          <button onClick={() => applyFormatting("expand")} className="p-1 hover:bg-gray-100 rounded" title="Expand">
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Input Section */}
      <div className="bg-white m-4 shadow-2xl rounded-xl p-4 flex flex-col">
        {/* Chat Title */}
        <div className="flex items-center space-x-2 mb-3">
          <MessageSquareText className="w-5 h-5 text-black" />
          <span className="text-sm font-semibold">Chat</span>
          <ChevronDown className="w-4 h-4 text-gray-500" />
        </div>

        {/* Text Area with blue selection */}
        <textarea
          ref={textAreaRef}
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="w-full resize-none overflow-auto min-h-[44px] max-h-[400px] focus:outline-none focus:ring-0 rounded-md border border-gray-200 p-3 text-gray-700 selection:bg-blue-200 selection:text-blue-900"
        />

        {/* Bottom Toolbar */}
        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3">
            <button className="text-black hover:text-gray-700">
              <Zap className="w-5 h-5" />
            </button>
            <button className="text-black hover:text-gray-700">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="text-black hover:text-gray-700">
              <Smile className="w-5 h-5" />
            </button>
          </div>

          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className={`px-3 py-1 rounded-md font-semibold flex items-center space-x-2 ${
              messageInput.trim() ? "bg-black text-white" : "bg-gray-300 text-white cursor-not-allowed"
            }`}
          >
            <span className="pr-2 border-r">Send</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default ChatArea
