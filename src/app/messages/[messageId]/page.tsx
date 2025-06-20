'use client'
import { ScrollArea } from "@/components/ui/scrollarea"
import { playSound } from "@/utils/soundEffects"
import { ArrowLeft } from "lucide-react"
import { useRef, useState, useEffect, useContext } from "react"
import { FaPaperPlane } from "react-icons/fa"
import { MessageContext } from "../../../contexts/MessageContext"
import { useRouter } from "next/navigation"
import axios from "axios"
import ConvoSuggestions from "@/components/messages/ConvoSuggestions"

type Message = {
    id?: string
    sender: string
    chatId: string
    message: string
    content?: string
    created_at?: string
    sender_id?: string
    timestamp: number
    type: string
}

export default function Messages({ params }: { params: { messageId: string } }) {
    const [messages, setMessages] = useState<Message[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const [isTyping, setIsTyping] = useState<boolean>(false)
    const [typingUser, setTypingUser] = useState<string | null>(null)
    

    const scrollRef = useRef<HTMLDivElement>(null)
    const token = localStorage.getItem("DaterrAccessToken")
    const currentUserId = localStorage.getItem("CurrentUserID")

    const messageContext = useContext(MessageContext)!
    const { messageText, setMessageText, currentConversation } = messageContext
    const socket = useRef<WebSocket | null>(null)
    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const router = useRouter()

    const handleGoBack = () => {
        router.back()
    }

    // Initialize WebSocket connection
    useEffect(() => {
        const userId = currentUserId
        const chatId = params.messageId

        const connectWebSocket = () => {
            socket.current = new WebSocket(`ws://localhost:4000/v1/chat/ws?userId=${userId}&matchId=${chatId}`);

            socket.current.onopen = () => {
                console.log("WebSocket connection established");
                setIsLoading(false);
            };

            socket.current.onmessage = (event) => {
                const data = JSON.parse(event.data);
                if (data.type === "message") {
                    setMessages((prevMessages) => [...prevMessages, data]);
                    playSound('message');
                } else if (data.type === "system") {
                    setMessages((prevMessages) => [...prevMessages, data]);
                    playSound('message');
                } else if (data.type === "typing") {
                    setIsTyping(true);
                    setTypingUser(data.sender);
                } else if (data.type === 'stop_typing') {
                    if (data.sender === typingUser) {
                        setIsTyping(false);
                        setTypingUser(null);
                    }
                }
            };

            socket.current.onerror = (error) => {
                console.error("WebSocket error:", error);
                setError("WebSocket connection error");
                setTimeout(connectWebSocket, 5000);
            };

            socket.current.onclose = () => {
                console.log("WebSocket connection closed");
            };
        };

        connectWebSocket();

        return
    }, [params.messageId, currentUserId]);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: scrollRef.current.scrollHeight,
                behavior: 'smooth'
            })
        }
    }, [messages])

    // Fetch message history
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                setIsLoading(true);
                const response = await axios.get(`http://localhost:4000/v1/user/chats/${params.messageId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 200) {
                    setMessages(response.data.messages || []);
                    console.log("Messages", response.data.messages)
                } else {
                    setError("Failed to fetch messages");
                }
            } catch (error: any) {
                console.error("Error fetching messages:", error);
                setError(error.response?.data?.message || "Error fetching messages");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMessages()
    }, [params.messageId, token])

    const formatTime = (timestamp: number | string) => {
        console.log(timestamp)
        const date = new Date(typeof timestamp === 'string' ? parseInt(timestamp) * 1000 : timestamp * 1000) // Convert Unix timestamp to Date
        const hours = date.getHours()
        const minutes = date.getMinutes().toString().padStart(2, '0')

        return hours >= 12
            ? `${hours === 12 ? 12 : hours - 12}:${minutes} PM`
            : `${hours === 0 ? 12 : hours}:${minutes} AM`
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const sendTypingIndicator = (isTyping: boolean) => {
        if (!socket.current || socket.current.readyState !== WebSocket.OPEN) return

        const typingMessage = {
            type: isTyping ? 'typing' : 'stop_typing',
            sender: currentUserId,
            chatId: params.messageId,
            content: 'Typing...',
            timestamp: Math.floor(Date.now() / 1000)
        }

        try {
            socket.current.send(JSON.stringify(typingMessage))
        } catch (error) {
            console.error("Failed to send typing indicator:", error)
        }
    }

    const handleTyping = () => {
        if (messageText.trim()) {
            sendTypingIndicator(true)

            // Clear existing timeout
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current)
            }

            // Set new timeout to stop typing indication after 3 seconds
            typingTimeoutRef.current = setTimeout(() => {
                setIsTyping(!isTyping)
            }, 3000)
        }
    }

    const handleSendMessage = () => {
        if (!messageText.trim() || !socket.current || socket.current.readyState !== WebSocket.OPEN) return

        // Cancel any typing indicator
        if (typingTimeoutRef.current) {
            clearTimeout(typingTimeoutRef.current)
            sendTypingIndicator(false)
        }

        // Create and send message
        const message = {
            type: 'message',
            sender: currentUserId,
            chatId: params.messageId,
            content: messageText,
            timestamp: Math.floor(Date.now() / 1000)
        }

        try {
            socket.current.send(JSON.stringify(message))
            setMessageText('')
        } catch (error) {
            console.error("Failed to send message:", error)
            setError("Failed to send message")
        }
    }

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] relative">
            {/* Chat header */}
            <div className="border-b p-4 flex items-center bg-white shadow-sm my-14">
                <button className="hover:bg-accent hover:text-accent-foreground h-10 w-10 mr-2" onClick={() => handleGoBack()}>
                    <ArrowLeft size={20} />
                </button>
                {/*Avatar*/}
                <div className="relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full mx-2">
                    <img
                        className="aspect-square h-full w-full"
                        src={currentConversation?.participants[0]?.profilePicture}
                        alt={currentConversation?.participants[0]?.name || "User"}
                    />
                </div>

                <div>
                    <h3 className="font-medium text-base">{currentConversation?.participants[0]?.name}</h3>
                    <p className="text-xs text-gray-500">{currentConversation?.participants[0]?.location}</p>
                </div>
            </div>

            <ScrollArea ref={scrollRef}>
                <div className="flex flex-col space-y-4 p-4">
                    {messages.length === 0 && !isLoading ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No messages yet</p>
                            <p className="text-sm mt-2">Say hello to {currentConversation?.participants[0]?.name}!</p>
                        </div>
                    ) : (
                        messages.map((message: Message, index: number) => {
                            console.log(message.sender, index)
                            const isCurrentUser = message.sender === currentUserId || message.sender_id === currentUserId

                            return (
                                <div
                                    key={index}
                                    className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[80%] rounded-2xl px-4 py-2 ${!isCurrentUser
                                            ? 'bg-500 text-white rounded-tl-none message-bubble-in'
                                            : 'bg-fuchsia-500 text-white rounded-tr-none message-bubble-out'
                                            }`}
                                    >
                                        <p className="break-words text-white">{message.message || message.content}</p>
                                        <p
                                            className={`text-xs mt-1 ${isCurrentUser ? 'text-primary-foreground/70' : 'text-white'
                                                }`}
                                        >
                                            {formatTime(typeof message.timestamp === 'number' ? message.timestamp : message.created_at!)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    )}

                    {isTyping && typingUser !== currentUserId && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] rounded-2xl px-4 py-2 bg-500 text-white/70 rounded-tl-none message-bubble-out">
                                <div className="flex items-center space-x-2">
                                    <p className="text-sm">typing...</p>
                                    <div className="typing-indicator flex space-x-1">
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-200"></span>
                                        <span className="w-2 h-2 bg-white rounded-full animate-pulse delay-400"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {isLoading && (
                        <div className="flex justify-center py-4">
                            <div className="loader"></div>
                        </div>
                    )}

                    {error && (
                        <div className="flex justify-center py-2">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}
                </div>
            </ScrollArea>
            
            <ConvoSuggestions />

            <div className="border-t bg-white fixed top-[88%] w-full">
                <div className="flex gap-1 items-center p-2">
                    <textarea
                        value={messageText}
                        onChange={(e) => {
                            setMessageText(e.target.value)
                            handleTyping()
                        }}
                        rows={1}
                        maxLength={200}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message ${currentConversation?.participants[0]?.name || 'user'}`}
                        className="flex-1 min-h-[60px] max-h-[120px] outline-none resize-none w-4/5 border-gray-500 border rounded-sm p-2"
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!messageText.trim()}
                        className="bg-200 gradient-bg hover:opacity-90 text-white h-[65px] rounded-sm px-4"
                    >
                        <FaPaperPlane className="text-3xl text-center" />
                    </button>
                </div>
            </div>
        </div>
    )
}