import React, { useState, useEffect } from 'react';
import { Star, Send, Bot, X, Square, ArrowUp, ChevronDown, SquarePen } from 'lucide-react';
import { useDispatch } from 'react-redux';

const aiConfig = {
  assistant: {
    name: 'Fin',
    avatar: 'AI',
    initialContent: {
      icon: '⌘',
      greeting: "Hi, I'm Fin AI Copilot",
      instruction: "Ask me anything about this conversation."
    },
    responses: [
      {
        trigger: 'refund',
        content: "We understand that sometimes a purchase may not meet your expectations. To help you with a refund, please provide your order ID and proof of purchase.",
        sources: [
          { id: 1, title: 'Getting a refund', type: 'document' },
          { id: 2, title: 'Refund for an order placed by mistake', type: 'policy' },
          { id: 3, title: 'Refund for an unwanted gift', type: 'policy' }
        ]
      }
    ],
    suggestions: ['How do I get a refund?'],
    settings: {
      typingSpeed: 30,
      maxMessages: 20,
      responseDelay: 500
    }
  }
};

const AICopilot = ({ isMobile, isOpen, onToggle }) => {
  const [activeTab, setActiveTab] = useState('copilot');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [responseStage, setResponseStage] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [charIndex, setCharIndex] = useState(0);
  const [currentResponse, setCurrentResponse] = useState(null);
  const dispatch = useDispatch();

  const { assistant } = aiConfig;
  const { typingSpeed, maxMessages, responseDelay } = assistant.settings;

  const handleInsertResponse = (content) => {
    dispatch({
      type: 'SET_AI_MESSAGE',  // Changed from SET_AI_RESPONSE
      payload: content
    });
  };

  useEffect(() => {
    if (messages.length > maxMessages) {
      setMessages(messages.slice(messages.length - maxMessages));
    }
    if (messages.length > 0) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, maxMessages]);

  const scrollToBottom = () => {
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  useEffect(() => {
    if (responseStage === 1 && charIndex < currentResponse?.content?.length) {
      const typingTimer = setTimeout(() => {
        setCurrentText(currentResponse.content.substring(0, charIndex + 1));
        setCharIndex(charIndex + 1);
        scrollToBottom();
      }, typingSpeed);

      return () => clearTimeout(typingTimer);
    } else if (responseStage === 1 && charIndex >= currentResponse?.content?.length) {
      const completeTimer = setTimeout(() => {
        setResponseStage(2);
        setIsTyping(false);
        setMessages([...messages, {
          id: Date.now() + 1,
          sender: assistant.name,
          content: currentResponse.content,
          avatar: assistant.avatar,
          sources: currentResponse.sources
        }]);
        setTimeout(scrollToBottom, 100);
      }, responseDelay);
      return () => clearTimeout(completeTimer);
    }
  }, [responseStage, charIndex, currentResponse, messages, assistant, responseDelay, typingSpeed]);

  const handleSendMessage = () => {
    if (!question.trim()) return;

    const matchedResponse = assistant.responses.find(response =>
      question.toLowerCase().includes(response.trigger)
    ) || {
      content: "I'm sorry, I didn't understand that. Could you please rephrase your question?",
      sources: []
    };

    setCurrentResponse(matchedResponse);
    const newMessages = [...messages, {
      id: Date.now(),
      sender: 'You',
      content: question,
      avatar: '👤'
    }];

    setMessages(newMessages);
    setQuestion('');
    setIsTyping(true);
    setCurrentText('');
    setCharIndex(0);
    setTimeout(scrollToBottom, 100);

    setTimeout(() => {
      setResponseStage(1);
      setTimeout(scrollToBottom, 50);
    }, responseDelay);
  };

  const handleSuggestedQuestion = (suggestion) => {
    setQuestion(suggestion);
    setTimeout(handleSendMessage, 100);
  };

  if (isMobile && !isOpen) return null;

  const renderResponseByStage = () => {
    if (responseStage === 0 || !currentResponse) return null;

    return (
      <div className="flex flex-col space-y-2 mb-4">
        <div className="flex items-start">
          <div className="w-6 h-6 rounded bg-black flex items-center justify-center mr-2 flex-shrink-0">
            <span className="text-white text-xs">AI</span>
          </div>
          <div className="flex flex-col">
            <span className="font-medium">{assistant.name}</span>

            {responseStage === 1 && (
              <div className="mt-1 w-full rounded-lg relative overflow-hidden transition-all duration-300"
                style={{ minHeight: '24px', maxHeight: '150px' }}>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 animate-gradient"></div>
                <div className="p-4 relative z-10">
                  {currentText}
                  <span className="animate-pulse">|</span>
                </div>
              </div>
            )}

            {responseStage === 2 && (
              <>
                <div className="mt-1 p-4 rounded-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 animate-gradient"></div>
                  <p className="relative z-10">{currentResponse.content}</p>

                </div>

                {currentResponse.sources.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-500">{currentResponse.sources.length} relevant sources found</p>
                    <div className="flex flex-col space-y-1 mt-1">
                      {currentResponse.sources.map(source => (
                        <div key={source.id} className="flex items-center">
                          {source.type === 'document' ? (
                            <Square className="w-3 h-3 text-black mr-2" />
                          ) : (
                            <div className="w-3 h-3 bg-blue-600 mr-2"></div>
                          )}
                          <span className="text-sm">{source.title}</span>
                        </div>
                      ))}
                    </div>
                    <button className="text-sm text-blue-600 mt-1">See all →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <style jsx="true" global="true">{`

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }

        .animate-pulse {
          animation: pulse 1s ease-in-out infinite;
        }
        
     .content-gradient {
            background: linear-gradient(
              to top,
              rgba(138, 92, 246, 0.3) 0%,
              rgba(138, 92, 246, 0.07) 10%,
              rgba(138, 92, 246, 0.03) 20%,
              #ffffff 25%,
              #ffffff 100%
            );
            background-size: 100% 100%;
          }
      `}</style>

      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}
      <div className={`${isMobile ? 'fixed inset-0 z-40 w-full' : 'relative w-80'} transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex space-x-6">
              <button
                onClick={() => setActiveTab('copilot')}
                className={`text-sm font-medium pb-3 border-b-2 transition-all flex items-center ${activeTab === 'copilot'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
              >
                <div className="bg-blue-600 text-white w-5 h-5 rounded flex items-center justify-center mr-2">
                  <Bot className="w-3 h-3" />
                </div>
                AI Copilot
              </button>
              <button
                onClick={() => setActiveTab('details')}
                className={`text-sm font-medium pb-3 border-b-2 transition-all ${activeTab === 'details'
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
                  }`}
              >
                Details
              </button>
            </div>
            <button className="p-1">
              <Square className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

<div className="flex-1 flex flex-col min-h-0 overflow-hidden h-[calc(100%-60px)]">
            {activeTab === 'copilot' ? (
            <>
              <div className="flex-1 overflow-y-auto p-4 chat-container">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col justify-center items-center text-center p-6">
                    <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center mb-6">
                      <span className="text-white text-xl">{assistant.initialContent.icon}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      {assistant.initialContent.greeting}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {assistant.initialContent.instruction}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-6">
                    {messages.map(message => (
                      <div key={message.id} className="flex flex-col space-y-2">
                        <div className="flex items-start">
                          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center mr-2 flex-shrink-0">
                            {message.avatar === 'AI' ? (
                              <div className="w-full h-full rounded bg-black flex items-center justify-center">
                                <span className="text-white text-xs">AI</span>
                              </div>
                            ) : (
                              <span className="text-xs">👤</span>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-medium">{message.sender}</span>
                            {message.content && (
                              message.sender === 'Fin' ? (
                                <>
                                  <div className="mt-1 p-4 rounded-lg relative overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-purple-200 to-blue-200 animate-gradient"></div>
                                    <p className="relative z-10">{message.content}
                                      {message.sender === 'Fin' && (
                                        <button
                                          onClick={() => handleInsertResponse(message.content)}
                                          className="w-full h-[40px] mt-2 flex flex-row justify-center items-center bg-white rounded-md text-sm text-black hover:text-blue-800 "
                                        >

                                          <span className='w-[90%] flex flex-row items-center justify-center font-bold '>
                                            <SquarePen className='mr-1' />
                                            Add to composer
                                          </span>
                                          <ChevronDown className="mr-2" />
                                        </button>
                                      )}
                                    </p>

                                  </div>
                                  {message.sources && (
                                    <div className="mt-2">
                                      <p className="text-xs text-gray-500">{message.sources.length} relevant sources found</p>
                                      <div className="flex flex-col space-y-1 mt-1">
                                        {message.sources.map(source => (
                                          <div key={source.id} className="flex items-center">
                                            {source.type === 'document' ? (
                                              <Square className="w-3 h-3 text-black mr-2" />
                                            ) : (
                                              <div className="w-3 h-3 bg-blue-600 mr-2"></div>
                                            )}
                                            <span className="text-sm">{source.title}</span>
                                          </div>
                                        ))}
                                      </div>

                                      <button className="text-sm text-blue-600 mt-1">See all →</button>
                                    </div>
                                  )}
                                </>
                              ) : (
                                <p className="mt-1">{message.content}</p>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isTyping && renderResponseByStage()}
                  </div>
                )}
              </div>

              <div className="p-4 mt-auto shadow-lg input-container">
                {messages.length === 0 && (
                  <div className="mb-4">
                    <div className="space-y-2">
                      {assistant.suggestions.map((suggestion, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 p-2 rounded hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSuggestedQuestion(suggestion)}
                        >
                          <Star className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-700 font-medium">
                            {suggestion}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="relative">
                  <input
                    type="text"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder={messages.length === 0 ? "Ask a question..." : "Ask a follow up question..."}
                    className="w-full border  rounded-xl px-4 py-3 pr-12 outline-none border-transparent transition-all"
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  />
                  <button
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={handleSendMessage}
                  >
                    <ArrowUp className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <p className="text-gray-500 text-sm">Coming Soon...</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AICopilot;