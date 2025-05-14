'use client'
import { MessageContext } from "@/contexts/MessageContext"
import axios from "axios"
import { LoaderCircle, MessageCircle} from "lucide-react"
import { useRouter } from "next/navigation"
import { useContext, useEffect, useState } from "react"
import { RxAvatar } from "react-icons/rx"

type Match = {
    match_id: string;
    first_name: string;
    last_name: string;
    age: number;
    image_url?: string;
    chat_id: string;
    last_message?: string;
    last_message_time?: string;
    unread_count?: number;
}

type Conversation = {
    id: string;
    participants: {
        id: string;
        name: string;
        profilePicture?: string;
        age: number;
    }[];
    createdAt: Date;
    lastMessage: {
        id: string;
        chatId: string;
        senderId: string;
        content: string;
        createdAt: Date;
    };
    unreadCount: number;
}

export default function Matches() {
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [matches, setMatches] = useState<Match[]>([])
    const [error, setError] = useState<string | null>(null)

    const router = useRouter()

    const messageContext = useContext(MessageContext)!

    const { setCurrentConversation, conversations } = messageContext
    const moveToChat = (match: Match) => {
        console.log("Navigating to chat with match:", match);

        if (!match.chat_id) {
            console.error("No chat ID found for this match");
            setError("Unable to open chat. Chat ID is missing.");
            return;
        }

        const newConversation: Conversation = {
            id: match.chat_id, 
            participants: [
                {
                    id: match.match_id, 
                    name: `${match.first_name} ${match.last_name}`,
                    profilePicture: match.image_url,
                    age: match.age,
                },
            ],
            createdAt: new Date(),
            lastMessage: {
                id: "1",
                chatId: match.chat_id, 
                senderId: "system", 
                content: match.last_message || "Start the conversation!",
                createdAt: new Date(),
            },
            unreadCount: match.unread_count || 0,
        };

        setCurrentConversation(newConversation);

        // Redirect to the chat page using chat_id
        router.push(`/messages/${newConversation.id}`);
    }

    useEffect(() => {
        const fetchMatches = async () => {
            const accessToken = localStorage.getItem("DaterrAccessToken");
            if (!accessToken) {
                setError("Authentication required. Please log in.");
                setIsLoading(false);
                return;
            }

            try {
                // Fetch matches
                const matchesResponse = await axios.get("http://localhost:4000/v1/user/getmatches", {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });
                console.log(matchesResponse.data)
                setMatches(matchesResponse.data.matches)
                // Fetch chats by userID
                const userId = localStorage.getItem("CurrentUserID");
                const chatsResponse = await axios.get(`http://localhost:4000/v1/user/getconversations`, {
                    headers: {
                        "Authorization": `Bearer ${accessToken}`,
                    },
                });
                const chats = chatsResponse.data.conversations;
                console.log("Chat", chats);
            } catch (error: any) {
                console.error("Error fetching matches or chats:", error);
                setError(error.response?.data?.message || "Failed to load matches");
            } finally {
                setIsLoading(false);
            }
        };

        fetchMatches();
    }, [])

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <LoaderCircle className="w-12 h-12 animate-spin text-primary" />
                <p className="mt-4 text-lg">Loading your matches...</p>
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-red-500 text-lg">{error}</p>
            </div>
        )
    }

    if (matches.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen">
                <p className="text-lg">No matches yet!</p>
            </div>
        )
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Your Matches</h1>
            
            <div className="space-y-2">
                {matches.map(match => (
                    <div 
                        key={match.match_id}
                        className="flex items-center p-4 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                    >
                        {/* Avatar */}
                        <div className="relative mr-4">
                            {match.image_url ? (
                                <img 
                                    src={match.image_url} 
                                    alt={`${match.first_name} ${match.last_name}`}
                                    className="w-14 h-14 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
                                    <RxAvatar className="text-3xl text-gray-400"/>
                                </div>
                            )}
                            {match.unread_count ? (
                                <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    {match.unread_count}
                                </div>
                            ) : null}
                        </div>

                        {/* Match Info */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline">
                                <h2 className="text-lg font-semibold truncate">
                                    {match.first_name} {match.last_name}
                                </h2>
                                <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">
                                    {match.last_message_time}
                                </span>
                            </div>
                            <div className="flex items-center">
                                <p className="text-sm text-gray-500 truncate">
                                    {match.last_message}
                                </p>
                            </div>
                        </div>

                        {/* Message Icon */}
                        <button className="ml-4 text-gray-400 hover:text-primary transition-colors" onClick={() => {
                            moveToChat(match)
                        }}>
                            <MessageCircle className="w-5 h-5"/>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    )
}