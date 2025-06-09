'use client'
import { createContext, useContext, useState, Dispatch, SetStateAction, useEffect } from "react";
import axios from "axios";
import {AuthContext} from "../contexts/AuthContext"

export interface User {
    id: string;
    name: string;
    profilePicture?: string;
    age?: number;
    gender?: string;
    bio?: string;
    interests?: string[];
    photos?: string[];
    location?: string;
  }
  

export interface Message {
    id: string;
    chatId: string;
    senderId: string;
    content: string;
    createdAt: Date;
    readAt?: Date;
}

export interface Conversation {
    id: string;
    participants: User[];
    createdAt: Date;
    lastMessage?: Message;
    unreadCount: number;
}

interface MessageContextType {
    conversations: Conversation[];
    currentConversation: Conversation | null;
    setCurrentConversation: Dispatch<SetStateAction<Conversation | null>>,
    messages: Message[];
    sendMessage: (recieverId: string, content: string) => void;
    messageText: string;
    setMessageText: Dispatch<SetStateAction<string>>;
    // fetchMessages: (conversationId: string) => Promise<void>; // Added fetchMessages method
    getConversationWithUser: (userId: string) => Conversation | undefined;
    startConversation: (user: User) => Conversation;
    sendTypingIndicator: (conversationId: string) => Promise<void>;
}

export const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const useMessages = () => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error("useMessages must be used within a MessagesProvider");
    }
    return context;
};

export const MessageProvider = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useContext(AuthContext)!;
    const [convos, setConvos] = useState<Conversation[]>([]);
    const [currentConversation, setCurrentConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageText, setMessageText] = useState<string>('')
    const accessToken = localStorage.getItem("DaterrAccessToken")!;

    useEffect(() => {
        // if (!isAuthenticated) return; // Ensure the user is authenticated

        const fetchConversations = async () => {
            try {
                const response = await axios.get("http://localhost:4000/v1/user/getconversations", {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });
                setConvos(response.data);
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
            }
        };

        fetchConversations();
    }, [accessToken]);

    // const fetchMessages = async (conversationId: string) => {
    //     try {
    //         const response = await axios.get(`http://localhost:4000/v1/getmessages/${conversationId}`, {
    //             headers: {
    //                 Authorization: `Bearer ${accessToken}`,
    //             },
    //         });
    //         setMessages(response.data.messages);
    //     } catch (error) {
    //         console.error("Failed to fetch messages:", error);
    //     }
    // };

    return (
        <MessageContext.Provider
            value={{
                conversations: convos,
                currentConversation,
                setCurrentConversation,
                messages,
                messageText,
                setMessageText,
                //fetchMessages,
                sendMessage: (recieverId: string, content: string) => {
                    if (!content.trim()) return;

                    const newMessage: Message = {
                        id: Date.now().toString(),
                        chatId: "", // Assign the appropriate chatId here
                        senderId: accessToken[1],
                        content,
                        createdAt: new Date(),
                        readAt: undefined, 
                    };

                    setMessages((prevMessages) => [...prevMessages, newMessage]);

                    setConvos((prevConvos) =>
                        prevConvos?.map((conv) => {
                            if (conv.participants.some((p) => p.id === recieverId)) {
                                return {
                                    ...conv,
                                    lastMessage: newMessage,
                                    unreadCount: 0,
                                };
                            }
                            return conv;
                        })
                    );
                },
                startConversation: (user: User) => {
                    const newConversation: Conversation = {
                        id: Date.now().toString(),
                        participants: [user],
                        unreadCount: 0,
                        createdAt: new Date(),
                    };
                    setConvos((prevConvos) => [...prevConvos, newConversation]);
                    return newConversation;
                },
                sendTypingIndicator: async (conversationId: string) => {
                    try {
                        await axios.post(
                            `http://localhost:4000/v1/typing/${conversationId}`,
                            {},
                            {
                                headers: {
                                    Authorization: `Bearer ${accessToken}`,
                                },
                            }
                        );
                    } catch (error) {
                        console.error("Failed to send typing indicator:", error);
                    }
                },
                getConversationWithUser: (userId: string) =>
                    convos.find((conv) => conv.participants.some((p) => p.id === userId)),
            }}
        >
            {children}
        </MessageContext.Provider>
    );
};