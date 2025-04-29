import {useEffect, useRef, useState} from "react";
import { motion } from "framer-motion";
import { MessageCircle, Send } from "lucide-react";
import { Client } from "@stomp/stompjs";
import "../style/ChatWidget.css";
import apiClient from "../apiClient.tsx";
import {useSelector} from "react-redux";
import {RootState} from "../store/store.tsx";

type ChatMessage = {
    sender: string;
    text: string;
    timestamp: string;
};

interface ChatRoom {
    roomId: string;
    name: string;
}

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [rooms, setRooms] = useState<ChatRoom[]>([]);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [newRoomName,setNewRoomName] = useState("");

    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const email = useSelector((state: RootState) => state.auth.email);

    const toggleChat = () => setIsOpen(!isOpen);

    // 채팅방 목록 로딩
    useEffect(() => {
        if (isOpen && rooms.length === 0) {
            apiClient.get("/chat/rooms")
                .then(res => setRooms(res.data))
                .catch(console.error);
        }
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior:"smooth"});
    }, [messages]);

    // 방 선택되면 WebSocket 연결
    useEffect(() => {
        if (!selectedRoomId) return;

        setMessages([]);

        const client = new Client({
            brokerURL: "ws://localhost:8080/ws/chat",
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("WebSocket 연결 성공");

                client.subscribe(`/topic/public/rooms/${selectedRoomId}`, (message) => {
                    const newMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, newMessage]);
                });

                setStompClient(client);
                setIsConnected(true);
            },
            onStompError: (frame) => {
                console.error("WebSocket 오류 발생:", frame.headers["message"]);
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [selectedRoomId]);

    const createRoom =() =>{
        if(!newRoomName.trim()) return; // 이름없는거 null

        apiClient.post(`/chat/rooms?name=${encodeURIComponent(newRoomName)}`)
            .then(res => {
                const newRoom = res.data;
                setRooms(prev => [...prev, newRoom]);
                setNewRoomName("");

                setSelectedRoomId(newRoom.roomId);
            })
            .catch(console.error);
    }

    const sendMessage = () => {
        if (!input.trim() || !isConnected || !stompClient || !selectedRoomId) {
            console.error("연결 또는 입력 오류");
            return;
        }

        const newMessage = {
            sender: email || "unKnown",
            text: input,
            timestamp: new Date().toLocaleTimeString(),
        };

        stompClient.publish({
            destination: `/app/chat/${selectedRoomId}/send`,
            body: JSON.stringify(newMessage),
        });

        setInput("");
    };

    return (
        <div className="chat-widget">
            <motion.button
                onClick={toggleChat}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="chat-button"
            >
                <MessageCircle size={24} />
            </motion.button>

            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 50 }}
                    className="chat-box"
                >
                    {!selectedRoomId ? (
                        <div className="chat-messages">
                            <div className="chat-header">
                                <p style={{ fontWeight: "bold", fontSize: "16px", margin: 0 }}>
                                    채팅방 선택
                                </p>
                            </div>
                            <div style={{ padding: "0 10px", marginBottom: "10px" }}>
                                <input
                                    value={newRoomName}
                                    onChange={(e) => setNewRoomName(e.target.value)}
                                    placeholder="새 채팅방 이름"
                                    className="chat-input"
                                />
                                <button onClick={createRoom} className="chat-send-button" style={{ marginTop: "5px" }}>
                                    방 생성
                                </button>
                            </div>
                            <ul>
                                {rooms.map((room) => (
                                    <li key={room.roomId}>
                                        <button onClick={() => setSelectedRoomId(room.roomId)}>
                                            {room.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ) : (
                        <>
                            <div className="chat-header" style={{display:"flex", alignItems:"center"}} >
                                <button onClick={() => setSelectedRoomId(null)}
                                style={{
                                    background:"none",
                                    border:"none",
                                    fontSize:"18px",
                                    cursor:"pointer",
                                    marginRight:"8px"
                                }}>
                                    ←
                                </button>
                                <p style={{fontWeight: "bold", fontSize:"16px", marginBottom:"8px" ,textAlign:"center"}}>{rooms.find(room => room.roomId === selectedRoomId)?.name || "알 수 없음"}</p>
                            </div>

                            <div className="chat-messages">
                                {messages.map((msg, idx) => (
                                    <div key={idx} className={msg.sender === email ? "user-message" : "system-message"}>
                                        <div className="message-bubble">
                                            <p className="message-sender">{msg.sender}</p> {/* 보낸 사람 이메일 */}
                                            <span className="message-time-inline">{msg.timestamp}</span>
                                            <p>{msg.text}</p>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef}></div>
                            </div>

                            <div className="chat-input-container">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="메시지를 입력하세요"
                                    className="chat-input"
                                />
                                <button onClick={sendMessage} className="chat-send-button">
                                    <Send size={20} />
                                </button>
                            </div>
                        </>
                    )}
                </motion.div>
            )}
        </div>
    );
};

export default ChatWidget;
