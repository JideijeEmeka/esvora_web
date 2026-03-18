import React, { useState } from 'react'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import { Search, Send, Paperclip, Mic, ExternalLink, Phone, Check, ChevronLeft } from 'lucide-react'

const MOCK_CHATS = [
	{ id: 1, name: 'Osaite Emmanuel', avatar: null, lastMessage: 'You: Good morning', time: 'Now', unread: false },
	{ id: 2, name: 'Osaite Emmanuel', avatar: null, lastMessage: 'See you later', time: 'Yesterday', unread: true },
	{ id: 3, name: 'Osaite Emmanuel', avatar: null, lastMessage: "You: thanks I'll see yo...", time: 'Tuesday', unread: false }
]

const MOCK_MESSAGES = [
	{ id: 1, text: 'Hello good morning John, when are you coming to check the house', fromMe: false, time: '12:45 am', seen: true },
	{ id: 2, text: 'Good morning! I will be there by 2pm today.', fromMe: true, time: '12:46 am', seen: true },
	{ id: 3, text: 'Great, I will be expecting you.', fromMe: false, time: '12:47 am', seen: true }
]

const MOCK_CONTACT = {
	name: 'Osaite Emmanuel',
	email: 'emmanuelosaite@gmail.com',
	location: 'Lagos, Nigeria',
	avatar: null,
	verified: true
}

const MessagesView = () => {
	const [searchQuery, setSearchQuery] = useState('')
	const [filterTab, setFilterTab] = useState('All')
	const [activeChat, setActiveChat] = useState(MOCK_CHATS[0])
	const [messageInput, setMessageInput] = useState('')
	const [showTyping, setShowTyping] = useState(true)
	const [showConversation, setShowConversation] = useState(false)

	const handleSend = () => {
		if (!messageInput.trim()) return
		setMessageInput('')
	}

	const handleSelectChat = (chat) => {
		setActiveChat(chat)
		setShowConversation(true)
	}

	return (
		<>
			<Navbar />
			<div className='pt-30 min-h-screen flex'>
				{/* Left: Chat list - hidden on mobile when viewing conversation, always shown on md+ */}
				<div className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-white ${
					showConversation ? 'max-md:hidden' : ''
				} md:flex`}>
					<div className='p-4 border-b border-gray-200'>
						<h2 className='text-[22px] font-semibold text-gray-900 mb-4'>Chats</h2>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='text'
								placeholder='Search contacts'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full pl-10 pr-4 py-2.5 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
							/>
						</div>
						<div className='flex gap-2 mt-3'>
							{['All', 'Read', 'Unread'].map((tab) => (
								<button
									key={tab}
									type='button'
									onClick={() => setFilterTab(tab)}
									className={`px-4 py-2 text-[14px] font-medium rounded-lg transition-colors ${
										filterTab === tab
											? 'bg-primary text-white'
											: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
									}`}
								>
									{tab}
								</button>
							))}
						</div>
					</div>
					<div className='flex-1 overflow-y-auto'>
						{MOCK_CHATS.map((chat) => (
							<button
								key={chat.id}
								type='button'
								onClick={() => handleSelectChat(chat)}
								className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
									activeChat?.id === chat.id ? 'bg-gray-100' : ''
								}`}
							>
								<div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0 text-xl'>
									👤
								</div>
								<div className='flex-1 min-w-0'>
									<p className='text-[15px] font-medium text-gray-900 truncate'>{chat.name}</p>
									<p className='text-[13px] text-gray-500 truncate'>{chat.lastMessage}</p>
								</div>
								<div className='shrink-0 text-[12px] text-gray-400'>{chat.time}</div>
							</button>
						))}
					</div>
				</div>

				{/* Center: Conversation - hidden on mobile until chat selected, always on md+ */}
				<div className={`flex-1 flex flex-col min-w-0 bg-gray-50/50 ${
					showConversation ? 'flex' : 'max-md:hidden'
				} md:flex`}>
					<div className='p-4 bg-white border-b border-gray-200 flex items-center gap-3'>
						<button
							type='button'
							onClick={() => setShowConversation(false)}
							className='md:hidden p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors'
							aria-label='Back to chats'
						>
							<ChevronLeft className='w-6 h-6 text-gray-600' />
						</button>
						<div>
							<h3 className='text-[18px] font-semibold text-gray-900'>{activeChat?.name}</h3>
							<p className='text-[14px] text-green-600'>Available</p>
						</div>
					</div>
					<div className='flex-1 overflow-y-auto p-6 space-y-4'>
						<p className='text-center text-[13px] text-gray-400 mb-4'>Yesterday</p>
						{MOCK_MESSAGES.map((msg) => (
							<div
								key={msg.id}
								className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
							>
								<div
									className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
										msg.fromMe
											? 'bg-gray-200 text-gray-900 rounded-br-md'
											: 'bg-white border border-gray-200 text-gray-900 rounded-bl-md border-l-2 border-l-primary'
									}`}
								>
									<p className='text-[15px]'>{msg.text}</p>
									<div className='flex items-center gap-2 justify-end mt-1'>
										<span className='text-[11px] text-gray-400'>{msg.time}</span>
										{msg.fromMe && msg.seen && <Check className='w-3.5 h-3.5 text-primary' />}
									</div>
								</div>
							</div>
						))}
						{showTyping && (
							<div className='flex justify-start'>
								<div className='flex gap-1 px-4 py-2 bg-white rounded-2xl border border-gray-200'>
									<span className='w-2 h-2 rounded-full bg-gray-400 animate-bounce' style={{ animationDelay: '0ms' }} />
									<span className='w-2 h-2 rounded-full bg-gray-400 animate-bounce' style={{ animationDelay: '150ms' }} />
									<span className='w-2 h-2 rounded-full bg-gray-400 animate-bounce' style={{ animationDelay: '300ms' }} />
								</div>
							</div>
						)}
					</div>
					<div className='p-4 bg-white border-t border-gray-200'>
						<div className='flex items-center gap-2 bg-gray-100 rounded-full pl-4 pr-2 py-2'>
							<input
								type='text'
								placeholder='Message'
								value={messageInput}
								onChange={(e) => setMessageInput(e.target.value)}
								onKeyDown={(e) => e.key === 'Enter' && handleSend()}
								className='flex-1 bg-transparent text-[15px] focus:outline-none'
							/>
							<button
								type='button'
								onClick={handleSend}
								className='w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0'
							>
								<Send className='w-5 h-5' />
							</button>
							<button type='button' className='p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500'>
								<Paperclip className='w-5 h-5' />
							</button>
							<button type='button' className='p-2 rounded-full hover:bg-gray-200 transition-colors text-gray-500'>
								<Mic className='w-5 h-5' />
							</button>
						</div>
					</div>
				</div>

				{/* Right: Contact details */}
				<div className='hidden lg:flex w-80 xl:w-96 flex-col border-l border-gray-200 bg-white'>
					<div className='p-6'>
						<div className='flex flex-col items-center text-center'>
							<div className='w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center text-3xl mb-4'>
								👤
							</div>
							<h3 className='text-[18px] font-semibold text-gray-900'>{MOCK_CONTACT.name}</h3>
							<p className='text-[14px] text-gray-500 mt-1'>{MOCK_CONTACT.email}</p>
							<p className='text-[14px] text-gray-500'>{MOCK_CONTACT.location}</p>
							{MOCK_CONTACT.verified && (
								<div className='flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-green-50 text-green-700 rounded-full'>
									<Check className='w-4 h-4' />
									<span className='text-[13px] font-medium'>Verified</span>
								</div>
							)}
							<div className='flex gap-3 mt-6'>
								<button
									type='button'
									className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600'
									title='View profile'
								>
									<ExternalLink className='w-5 h-5' />
								</button>
								<button
									type='button'
									className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600'
									title='Call'
								>
									<Phone className='w-5 h-5' />
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Footer />
		</>
	)
}

export default MessagesView
