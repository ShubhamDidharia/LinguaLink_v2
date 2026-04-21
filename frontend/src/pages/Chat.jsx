import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getMe, getConversations, getMessages, sendMessage, markMessagesAsRead, getUser } from '../services/api'
import MainLayout from '../components/MainLayout'
import { Send, MessageCircle, ArrowLeft } from 'lucide-react'

export default function Chat() {
  const { friendId } = useParams()
  const [conversations, setConversations] = useState([])
  const [selectedFriend, setSelectedFriend] = useState(null)
  const [messages, setMessages] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [messageInput, setMessageInput] = useState('')
  const [isSending, setIsSending] = useState(false)
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const pollIntervalRef = useRef(null)

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Poll for new messages every 2 seconds
  useEffect(() => {
    if (!selectedFriend || !currentUser) return

    const pollMessages = async () => {
      try {
        const latestMessages = await getMessages(selectedFriend._id)
        setMessages(latestMessages)
      } catch (err) {
        console.error('Failed to poll messages:', err)
      }
    }

    // Initial poll
    pollMessages()

    // Set up interval for polling
    pollIntervalRef.current = setInterval(pollMessages, 2000)

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current)
      }
    }
  }, [selectedFriend, currentUser])

  useEffect(() => {
    async function loadInitialData() {
      try {
        const user = await getMe()
        setCurrentUser(user)

        const convs = await getConversations()
        setConversations(convs)

        // If friendId is provided, try to select that friend
        if (friendId) {
          // First check if there's an existing conversation
          let friend = convs.find(c => c._id.toString() === friendId)
          
          // If no conversation, fetch the friend's details from User API
          if (!friend) {
            try {
              const friendData = await getUser(friendId)
              friend = { _id: friendId, user: friendData }
            } catch (err) {
              console.error('Failed to load friend:', err)
            }
          }

          if (friend) {
            setSelectedFriend(friend)
            try {
              const msgs = await getMessages(friendId)
              setMessages(msgs)
              await markMessagesAsRead(friendId)
            } catch (err) {
              console.error('Failed to load messages:', err)
            }
          }
        } else if (convs.length > 0) {
          // Default to first conversation
          setSelectedFriend(convs[0])
          try {
            const msgs = await getMessages(convs[0]._id)
            setMessages(msgs)
            await markMessagesAsRead(convs[0]._id)
          } catch (err) {
            console.error('Failed to load messages:', err)
          }
        }
      } catch (err) {
        console.error('Failed to load data:', err)
        navigate('/login', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialData()
  }, [navigate, friendId])

  const handleSelectFriend = async (friend) => {
    setSelectedFriend(friend)
    try {
      const msgs = await getMessages(friend._id)
      setMessages(msgs)
      await markMessagesAsRead(friend._id)
    } catch (err) {
      console.error('Failed to load messages:', err)
    }
  }

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedFriend || !currentUser) return

    try {
      setIsSending(true)
      const newMessage = await sendMessage(selectedFriend._id, messageInput)
      setMessages([...messages, newMessage])
      setMessageInput('')
      
      // Refresh conversations list to update last message
      const convs = await getConversations()
      setConversations(convs)
    } catch (err) {
      console.error('Failed to send message:', err)
      alert('Failed to send message')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <MainLayout currentUser={currentUser} isLoading={isLoading}>
      <div className="flex h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] flex-col md:flex-row">
        {/* Conversations List - Mobile: hidden unless no friend selected */}
        <div className={`w-full md:w-72 border-b md:border-b-0 md:border-r border-slate-200 bg-white flex flex-col overflow-hidden transition-all ${
          selectedFriend ? 'hidden md:flex' : 'flex'
        }`}>
          <div className="p-4 sm:p-6 border-b border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <MessageCircle className="text-indigo-600" size={24} />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">Messages</h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">{conversations.length} conversations</p>
          </div>

          {/* Conversations */}
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 sm:p-6 text-center">
                <p className="text-slate-600 text-sm">No conversations yet</p>
                <p className="text-slate-500 text-xs mt-2">Go to Friends to start chatting</p>
              </div>
            ) : (
              <div className="space-y-1 p-2">
                {conversations.map(conv => (
                  <div
                    key={conv._id}
                    onClick={() => handleSelectFriend(conv)}
                    className={`p-3 sm:p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedFriend?._id === conv._id
                        ? 'bg-indigo-50 border-l-4 border-indigo-600'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {conv.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">
                          {conv.user.name}
                        </p>
                        <p className="text-xs text-slate-600 truncate line-clamp-1">
                          {conv.lastMessage?.content || 'No messages yet'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-slate-50">
          {selectedFriend ? (
            <>
              {/* Header */}
              <div className="bg-white border-b border-slate-200 px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between shadow-soft">
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <button
                    onClick={() => setSelectedFriend(null)}
                    className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors flex-shrink-0"
                    aria-label="Back to conversations"
                  >
                    <ArrowLeft size={20} className="text-slate-900" />
                  </button>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-lg font-semibold text-slate-900 truncate">{selectedFriend.user.name}</h3>
                    <p className="hidden sm:block text-sm text-slate-600">{selectedFriend.user.email}</p>
                    <p className="text-xs sm:text-xs text-green-600 mt-0.5 sm:mt-1">● Online</p>
                  </div>
                </div>
                <div className="w-10 sm:w-12 h-10 sm:h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                  {selectedFriend.user.name.charAt(0).toUpperCase()}
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-3 sm:space-y-4 flex flex-col">
                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-4xl sm:text-6xl mb-3 sm:mb-4">👋</p>
                      <p className="text-slate-600 mb-2 text-sm sm:text-base">Start a conversation!</p>
                      <p className="text-xs sm:text-sm text-slate-500">Send your first message to {selectedFriend.user.name}</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {messages.map(msg => (
                      <div
                        key={msg._id}
                        className={`flex ${msg.sender._id === currentUser._id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs sm:max-w-sm lg:max-w-md px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                            msg.sender._id === currentUser._id
                              ? 'message-bubble-sent'
                              : 'message-bubble-received'
                          }`}
                        >
                          <p className="break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${
                            msg.sender._id === currentUser._id
                              ? 'text-indigo-200'
                              : 'text-slate-500'
                          }`}>
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Input */}
              <div className="bg-white border-t border-slate-200 p-3 sm:p-4 shadow-soft">
                <div className="flex gap-2 sm:gap-3">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="input-field flex-1 text-sm"
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim() || isSending}
                    className="btn-primary flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed px-3 sm:px-4 flex-shrink-0"
                    aria-label="Send message"
                  >
                    <Send size={18} />
                    <span className="hidden sm:inline">Send</span>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center px-4">
                <MessageCircle size={40} className="mx-auto mb-3 sm:mb-4 text-slate-400" />
                <p className="text-slate-600 text-base sm:text-lg font-medium">No chat selected</p>
                <p className="text-slate-500 text-xs sm:text-sm mt-2">
                  {conversations.length > 0
                    ? 'Select a conversation from the left'
                    : 'Go to Friends to start a conversation'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}
