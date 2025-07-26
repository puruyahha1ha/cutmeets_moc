'use client'

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../_components/providers/AuthProvider';

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    content: string;
    timestamp: string;
    read: boolean;
    type: 'text' | 'image' | 'booking';
    bookingData?: {
        service: string;
        date: string;
        time: string;
        status: 'pending' | 'confirmed' | 'cancelled';
    };
}

interface Conversation {
    id: string;
    participantId: string;
    participantName: string;
    participantType: 'customer' | 'assistant';
    participantSalon?: string;
    lastMessage: Message;
    unreadCount: number;
    isOnline: boolean;
    lastSeen: string;
}

export default function MessagesPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // 未認証の場合はリダイレクト
    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }
    }, [isAuthenticated, router]);

    // モックデータ
    useEffect(() => {
        if (user) {
            const mockConversations: Conversation[] = [
                {
                    id: 'conv_1',
                    participantId: 'assistant_1',
                    participantName: '田中 美香',
                    participantType: 'assistant',
                    participantSalon: 'SALON TOKYO',
                    lastMessage: {
                        id: 'msg_3',
                        conversationId: 'conv_1',
                        senderId: 'assistant_1',
                        senderName: '田中 美香',
                        content: 'ありがとうございます！当日お待ちしております。',
                        timestamp: '2024-01-15T14:30:00Z',
                        read: false,
                        type: 'text'
                    },
                    unreadCount: 1,
                    isOnline: true,
                    lastSeen: '2024-01-15T14:30:00Z'
                },
                {
                    id: 'conv_2',
                    participantId: 'assistant_2',
                    participantName: '佐藤 リナ',
                    participantType: 'assistant',
                    participantSalon: 'Hair Studio Grace',
                    lastMessage: {
                        id: 'msg_8',
                        conversationId: 'conv_2',
                        senderId: user.id,
                        senderName: user.name,
                        content: 'カラーの相談をしたいのですが',
                        timestamp: '2024-01-14T16:20:00Z',
                        read: true,
                        type: 'text'
                    },
                    unreadCount: 0,
                    isOnline: false,
                    lastSeen: '2024-01-14T18:45:00Z'
                }
            ];

            setConversations(mockConversations);
            setIsLoading(false);
        }
    }, [user]);

    // 選択された会話のメッセージを取得
    useEffect(() => {
        if (selectedConversation) {
            const mockMessages: Message[] = [
                {
                    id: 'msg_1',
                    conversationId: selectedConversation.id,
                    senderId: user?.id || '',
                    senderName: user?.name || '',
                    content: 'こんにちは！カットの予約をお願いしたいのですが、明日の午後は空いていますでしょうか？',
                    timestamp: '2024-01-15T13:00:00Z',
                    read: true,
                    type: 'text'
                },
                {
                    id: 'msg_2',
                    conversationId: selectedConversation.id,
                    senderId: selectedConversation.participantId,
                    senderName: selectedConversation.participantName,
                    content: 'こんにちは！ご連絡ありがとうございます。明日の14時からでしたら空いております。カットのご希望はございますか？',
                    timestamp: '2024-01-15T13:15:00Z',
                    read: true,
                    type: 'text'
                },
                {
                    id: 'msg_3',
                    conversationId: selectedConversation.id,
                    senderId: selectedConversation.participantId,
                    senderName: selectedConversation.participantName,
                    content: '',
                    timestamp: '2024-01-15T13:20:00Z',
                    read: true,
                    type: 'booking',
                    bookingData: {
                        service: 'カット',
                        date: '2024-01-16',
                        time: '14:00',
                        status: 'pending'
                    }
                },
                {
                    id: 'msg_4',
                    conversationId: selectedConversation.id,
                    senderId: user?.id || '',
                    senderName: user?.name || '',
                    content: 'ナチュラルな感じでお願いします！予約承認いただき、ありがとうございます。',
                    timestamp: '2024-01-15T14:00:00Z',
                    read: true,
                    type: 'text'
                },
                {
                    id: 'msg_5',
                    conversationId: selectedConversation.id,
                    senderId: selectedConversation.participantId,
                    senderName: selectedConversation.participantName,
                    content: 'ありがとうございます！当日お待ちしております。',
                    timestamp: '2024-01-15T14:30:00Z',
                    read: false,
                    type: 'text'
                }
            ];

            setMessages(mockMessages);
            
            // 未読メッセージを既読にする
            setConversations(prev => prev.map(conv => 
                conv.id === selectedConversation.id 
                    ? { ...conv, unreadCount: 0, lastMessage: { ...conv.lastMessage, read: true } }
                    : conv
            ));
        }
    }, [selectedConversation, user]);

    // メッセージ送信
    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedConversation || isSending) return;

        setIsSending(true);
        
        const message: Message = {
            id: `msg_${Date.now()}`,
            conversationId: selectedConversation.id,
            senderId: user?.id || '',
            senderName: user?.name || '',
            content: newMessage.trim(),
            timestamp: new Date().toISOString(),
            read: false,
            type: 'text'
        };

        // メッセージを追加
        setMessages(prev => [...prev, message]);
        setNewMessage('');

        // 会話リストを更新
        setConversations(prev => prev.map(conv => 
            conv.id === selectedConversation.id 
                ? { ...conv, lastMessage: message }
                : conv
        ));

        // テキストエリアのリサイズをリセット
        const textarea = document.querySelector('textarea');
        if (textarea) {
            textarea.style.height = 'auto';
        }

        setTimeout(() => setIsSending(false), 500);
    };

    // テキストエリアの自動リサイズ
    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewMessage(e.target.value);
        
        // 自動リサイズ
        e.target.style.height = 'auto';
        const newHeight = Math.min(e.target.scrollHeight, 100);
        e.target.style.height = newHeight + 'px';
    };

    // メッセージを最下部にスクロール
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

        if (diffDays === 0) {
            return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
        } else if (diffDays === 1) {
            return '昨日 ' + date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
        } else {
            return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
        }
    };

    const formatMessageTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    };

    const renderMessage = (message: Message) => {
        const isOwn = message.senderId === user?.id;

        if (message.type === 'booking') {
            return (
                <div key={message.id} className="flex justify-center my-4">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 max-w-sm mx-4">
                        <div className="flex items-center mb-2">
                            <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span className="font-medium text-blue-900 text-sm">予約確認</span>
                        </div>
                        <div className="text-sm text-blue-800 space-y-1">
                            <p><span className="font-medium">サービス:</span> {message.bookingData?.service}</p>
                            <p><span className="font-medium">日時:</span> {message.bookingData?.date} {message.bookingData?.time}</p>
                            <p><span className="font-medium">ステータス:</span> 
                                <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                                    message.bookingData?.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                    message.bookingData?.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {message.bookingData?.status === 'confirmed' ? '確定' :
                                     message.bookingData?.status === 'pending' ? '確認中' : 'キャンセル'}
                                </span>
                            </p>
                        </div>
                        <div className="text-xs text-blue-600 mt-2 text-center">{formatMessageTime(message.timestamp)}</div>
                    </div>
                </div>
            );
        }

        return (
            <div key={message.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-3`}>
                <div className={`max-w-[280px] md:max-w-md px-3 py-2 rounded-2xl break-words ${
                    isOwn 
                        ? 'bg-pink-500 text-white rounded-br-md' 
                        : 'bg-white text-gray-900 border border-gray-200 rounded-bl-md shadow-sm'
                }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <div className={`text-xs mt-1 ${isOwn ? 'text-pink-100' : 'text-gray-500'}`}>
                        {formatMessageTime(message.timestamp)}
                    </div>
                </div>
            </div>
        );
    };

    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">読み込み中...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* モバイル用ヘッダー */}
            <header className="md:hidden bg-white border-b border-gray-200 sticky top-16 z-40">
                <div className="px-4 py-4">
                    <div className="flex items-center justify-between">
                        {selectedConversation ? (
                            <>
                                <button
                                    onClick={() => setSelectedConversation(null)}
                                    className="flex items-center text-gray-600 hover:text-pink-500"
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    戻る
                                </button>
                                <h1 className="text-lg font-semibold text-gray-900">{selectedConversation.participantName}</h1>
                                <div className="w-10"></div>
                            </>
                        ) : (
                            <>
                                <Link href="/profile" className="flex items-center text-gray-600 hover:text-pink-500">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                    プロフィール
                                </Link>
                                <h1 className="text-lg font-semibold text-gray-900">メッセージ</h1>
                                <div className="w-20"></div>
                            </>
                        )}
                    </div>
                </div>
            </header>

            <div className="flex h-screen md:h-[calc(100vh-4rem)]">
                {/* 会話リスト */}
                <div className={`${selectedConversation ? 'hidden md:flex' : 'flex'} w-full md:w-1/3 bg-white border-r border-gray-200 flex-col`}>
                    {/* デスクトップ用ヘッダー */}
                    <div className="hidden md:block p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h1 className="text-lg font-semibold text-gray-900">メッセージ</h1>
                            <Link href="/profile" className="text-gray-400 hover:text-gray-600">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </Link>
                        </div>
                    </div>

                    {/* 会話リスト */}
                    <div className="flex-1 overflow-y-auto">
                        {isLoading ? (
                            <div className="flex items-center justify-center p-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center p-8">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">メッセージがありません</h3>
                                <p className="text-gray-600 mb-4">アシスタント美容師とのやり取りがここに表示されます</p>
                                <Link
                                    href="/search"
                                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-pink-500 to-red-500 text-white rounded-lg hover:from-pink-600 hover:to-red-600 transition-all"
                                >
                                    アシスタント美容師を探す
                                </Link>
                            </div>
                        ) : (
                            conversations.map((conversation) => (
                                <div
                                    key={conversation.id}
                                    onClick={() => setSelectedConversation(conversation)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                                        selectedConversation?.id === conversation.id ? 'bg-pink-50 border-pink-200' : ''
                                    }`}
                                >
                                    <div className="flex items-start space-x-3">
                                        <div className="relative">
                                            <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                {conversation.participantName.charAt(0)}
                                            </div>
                                            {conversation.isOnline && (
                                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className="font-medium text-gray-900 truncate">
                                                    {conversation.participantName}
                                                </h3>
                                                <span className="text-xs text-gray-500">
                                                    {formatTime(conversation.lastMessage.timestamp)}
                                                </span>
                                            </div>
                                            
                                            {conversation.participantSalon && (
                                                <p className="text-xs text-gray-500 mb-1">{conversation.participantSalon}</p>
                                            )}
                                            
                                            <div className="flex items-center justify-between">
                                                <p className="text-sm text-gray-600 truncate">
                                                    {conversation.lastMessage.type === 'booking' ? '📅 予約確認' : conversation.lastMessage.content}
                                                </p>
                                                {conversation.unreadCount > 0 && (
                                                    <span className="bg-pink-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                                                        {conversation.unreadCount}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* メッセージエリア */}
                <div className={`${selectedConversation ? 'flex' : 'hidden md:flex'} flex-1 flex-col bg-white`}>
                    {selectedConversation ? (
                        <>
                            {/* デスクトップ用チャットヘッダー */}
                            <div className="hidden md:block bg-white border-b border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="relative">
                                            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white font-semibold">
                                                {selectedConversation.participantName.charAt(0)}
                                            </div>
                                            {selectedConversation.isOnline && (
                                                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                                            )}
                                        </div>
                                        <div>
                                            <h2 className="font-semibold text-gray-900">{selectedConversation.participantName}</h2>
                                            <p className="text-xs text-gray-500">
                                                {selectedConversation.isOnline ? 'オンライン' : `最終ログイン: ${formatTime(selectedConversation.lastSeen)}`}
                                            </p>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/assistant/${selectedConversation.participantId}`}
                                        className="text-pink-500 hover:text-pink-600 text-sm font-medium"
                                    >
                                        プロフィール
                                    </Link>
                                </div>
                            </div>

                            {/* メッセージリスト */}
                            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 bg-gray-50">
                                {messages.map(renderMessage)}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* メッセージ入力 */}
                            <div className="bg-white border-t border-gray-200 p-3 md:p-4">
                                <div className="flex items-end space-x-2 md:space-x-3">
                                    <div className="flex-1">
                                        <textarea
                                            value={newMessage}
                                            onChange={handleTextareaChange}
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    sendMessage();
                                                }
                                            }}
                                            placeholder="メッセージを入力..."
                                            className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 outline-none resize-none text-sm md:text-base min-h-[40px]"
                                            rows={1}
                                            style={{ maxHeight: '100px', height: '40px' }}
                                        />
                                    </div>
                                    <button
                                        onClick={sendMessage}
                                        disabled={!newMessage.trim() || isSending}
                                        className={`p-2 rounded-full transition-colors flex-shrink-0 ${
                                            newMessage.trim() && !isSending
                                                ? 'bg-pink-500 text-white hover:bg-pink-600'
                                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        }`}
                                    >
                                        {isSending ? (
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center bg-gray-50">
                            <div className="text-center p-6">
                                <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">会話を選択してください</h3>
                                <p className="text-gray-600 text-sm md:text-base">左側から会話を選択してメッセージを開始しましょう</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}