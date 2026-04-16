import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Loader from '../components/loader'
import { Search, Send, ChevronLeft, Check, Phone, ExternalLink, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import chatController from '../controllers/chat_controller'
import propertyController from '../controllers/property_controller'
import { useGetChatsQuery } from '../repository/chat_repository'
import { normalizeGetChatsResponse } from '../models/chatConversationModel'
import { selectCurrentAccount } from '../redux/slices/accountSlice'
import { normalizePropertyDetails } from '../lib/propertyUtils'
import { getToken } from '../lib/localStorage'

const DICEBEAR_ADVENTURER = 'https://api.dicebear.com/9.x/adventurer/svg'

function getLandlordAvatarSrc(avatar, fallbackSeed = '') {
	const seed = (fallbackSeed ?? '').trim() || `landlord-${Math.random().toString(36).slice(2)}`
	if (avatar && typeof avatar === 'string' && avatar.trim()) {
		if (avatar.startsWith('data:') || avatar.startsWith('http')) return avatar
		return `${DICEBEAR_ADVENTURER}?seed=${encodeURIComponent(avatar)}`
	}
	return `${DICEBEAR_ADVENTURER}?seed=${encodeURIComponent(seed)}`
}

function formatListTime(iso) {
	if (!iso) return ''
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return ''
	const now = new Date()
	const sameDay =
		d.getDate() === now.getDate() &&
		d.getMonth() === now.getMonth() &&
		d.getFullYear() === now.getFullYear()
	if (sameDay) return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
	return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

function formatMessageTime(iso) {
	if (!iso) return ''
	const d = new Date(iso)
	if (Number.isNaN(d.getTime())) return ''
	return d.toLocaleString(undefined, { hour: 'numeric', minute: '2-digit' })
}

/** @param {import('../models/chatMessageModel').ChatMessage} m */
function messageFromMe(m, myUserId) {
	if (!m) return false
	const st = (m.sender_type ?? '').toLowerCase()
	if (st === 'tenant' || st === 'user' || st === 'renter') return true
	if (st === 'agent' || st === 'landlord' || st === 'owner') return false
	if (myUserId && Number(m.sender_id) === myUserId) return true
	return false
}

const MessagesView = () => {
	const account = useSelector(selectCurrentAccount)
	const myUserId = account?.id != null ? Number(account.id) : 0

	const hasToken = !!((getToken() ?? '').trim())
	const { data: chatsRaw, isLoading: loadingChats, refetch: refetchChats } = useGetChatsQuery(undefined, {
		skip: !hasToken
	})
	const conversations = useMemo(() => normalizeGetChatsResponse(chatsRaw).data, [chatsRaw])

	const [pageRefreshing, setPageRefreshing] = useState(false)
	const [selected, setSelected] = useState(/** @type {import('../models/chatConversationModel').ChatConversation|null} */ (null))
	const [showConversation, setShowConversation] = useState(false)

	const [messages, setMessages] = useState([])
	const [loadingMessages, setLoadingMessages] = useState(false)

	const [propertyDetails, setPropertyDetails] = useState(null)
	const [loadingLandlord, setLoadingLandlord] = useState(false)

	const [messageInput, setMessageInput] = useState('')
	const [sending, setSending] = useState(false)

	const [searchQuery, setSearchQuery] = useState('')

	const rawPropertyId = selected?.property?.id
	const propertyId =
		rawPropertyId != null && String(rawPropertyId).trim() !== '' ? String(rawPropertyId).trim() : ''

	const handlePageRefresh = () => {
		setPageRefreshing(true)
		setTimeout(() => {
			window.location.reload()
		}, 50)
	}

	const loadMessages = useCallback((pid) => {
		if (!pid) {
			setMessages([])
			return
		}
		setLoadingMessages(true)
		chatController.getChatMessages(pid, {
			onSuccess: (res) => {
				setMessages(res?.data ?? [])
				setLoadingMessages(false)
			},
			onError: (msg) => {
				toast.error(msg ?? 'Failed to load messages')
				setMessages([])
				setLoadingMessages(false)
			},
			forceRefetch: true
		})
	}, [])

	const loadLandlordFromProperty = useCallback((pid) => {
		if (!pid) {
			setPropertyDetails(null)
			return
		}
		setLoadingLandlord(true)
		propertyController.getPropertyDetails(pid, {
			onSuccess: (raw) => {
				const normalized = normalizePropertyDetails(raw)
				setPropertyDetails(normalized)
				setLoadingLandlord(false)
			},
			onError: (msg) => {
				toast.error(msg ?? 'Failed to load landlord details')
				setPropertyDetails(null)
				setLoadingLandlord(false)
			},
			forceRefetch: true
		})
	}, [])

	useEffect(() => {
		if (!selected || !propertyId) {
			setMessages([])
			setPropertyDetails(null)
			return
		}
		setPropertyDetails(null)
		loadMessages(propertyId)
		loadLandlordFromProperty(propertyId)
	}, [selected, propertyId, loadMessages, loadLandlordFromProperty])

	const handleSelectChat = (conv) => {
		setSelected(conv)
		setShowConversation(true)
	}

	const handleSend = () => {
		const text = messageInput.trim()
		if (!text || !propertyId || sending) return
		setSending(true)
		chatController.sendMessage(propertyId, text, {
			onSuccess: (res) => {
				setMessageInput('')
				if (res?.data) setMessages((prev) => [...prev, res.data])
				else loadMessages(propertyId)
				setSending(false)
				void refetchChats()
			},
			onError: (msg) => {
				toast.error(msg ?? 'Failed to send message')
				setSending(false)
			}
		})
	}

	const filteredConversations = conversations.filter((c) => {
		const q = searchQuery.trim().toLowerCase()
		if (!q) return true
		const agent = (c.agent?.name ?? '').toLowerCase()
		const title = (c.property?.title ?? '').toLowerCase()
		const addr = [c.property?.address, c.property?.city, c.property?.state].filter(Boolean).join(' ').toLowerCase()
		return agent.includes(q) || title.includes(q) || addr.includes(q)
	})

	const landlord = propertyDetails?.landlord
	const displayName = landlord?.name ?? selected?.agent?.name ?? '—'
	const displayEmail = landlord?.email ?? selected?.agent?.email ?? ''
	const displayLocation =
		landlord?.location ??
		([selected?.property?.city, selected?.property?.state].filter(Boolean).join(', ') || '—')
	const displayVerified = landlord?.verified ?? false
	const avatarSeed = displayName + (selected?.agent?.uuid ?? '')

	return (
		<>
			{pageRefreshing && (
				<div
					className='fixed inset-0 z-100 flex items-center justify-center bg-white/85 backdrop-blur-sm'
					aria-live='polite'
					aria-busy='true'
				>
					<Loader />
				</div>
			)}
			<Navbar />
			<div className='pt-30 min-h-screen flex'>
				{/* Left: chat list */}
				<div
					className={`w-full md:w-80 lg:w-96 border-r border-gray-200 flex flex-col bg-white ${
						showConversation ? 'max-md:hidden' : ''
					} md:flex`}
				>
					<div className='p-4 border-b border-gray-200'>
						<div className='flex items-center justify-between gap-2 mb-4'>
							<h2 className='text-[22px] font-semibold text-gray-900'>Chats</h2>
							<button
								type='button'
								onClick={handlePageRefresh}
								disabled={pageRefreshing}
								className='shrink-0 p-2 rounded-full border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors disabled:opacity-50'
								title='Refresh page'
								aria-label='Refresh page'
							>
								<RefreshCw className={`w-5 h-5 ${pageRefreshing ? 'animate-spin' : ''}`} />
							</button>
						</div>
						<div className='relative'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
							<input
								type='text'
								placeholder='Search by name or property'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className='w-full pl-10 pr-4 py-2.5 text-[15px] border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
							/>
						</div>
					</div>
					<div className='flex-1 overflow-y-auto'>
						{loadingChats ? (
							<div className='min-h-[120px]' aria-hidden />
						) : filteredConversations.length === 0 ? (
							<p className='p-4 text-[14px] text-gray-500 text-center'>No conversations yet.</p>
						) : (
							filteredConversations.map((c) => {
								const isActive = selected?.id === c.id
								const last = c.last_message
								const preview = last?.message ? String(last.message) : 'No messages yet'
								const label = c.agent?.name || 'Owner'
								const sub = c.property?.title || c.property?.address || 'Property'
								return (
									<button
										key={c.id}
										type='button'
										onClick={() => handleSelectChat(c)}
										className={`w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 ${
											isActive ? 'bg-gray-100' : ''
										}`}
									>
										<div className='w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden'>
											<img
												src={getLandlordAvatarSrc('', c.agent?.uuid ?? label)}
												alt=''
												className='w-full h-full object-cover'
											/>
										</div>
										<div className='flex-1 min-w-0'>
											<p className='text-[15px] font-medium text-gray-900 truncate'>{label}</p>
											<p className='text-[13px] text-gray-500 truncate'>
												{sub} · {preview}
											</p>
										</div>
										<div className='shrink-0 text-[12px] text-gray-400'>
											{formatListTime(last?.created_at ?? c.updated_at)}
										</div>
									</button>
								)
							})
						)}
					</div>
				</div>

				{/* Center: messages only when a chat is selected */}
				<div
					className={`flex-1 flex flex-col min-w-0 bg-gray-50/50 ${
						showConversation ? 'flex' : 'max-md:hidden'
					} md:flex`}
				>
					{!selected ? (
						<div className='hidden md:flex flex-1 flex-col items-center justify-center text-gray-500 px-8'>
							<p className='text-[16px] font-medium text-gray-700'>Select a chat</p>
							<p className='text-[14px] text-gray-500 mt-2 text-center max-w-sm'>
								Choose a conversation on the left to view messages and reply.
							</p>
						</div>
					) : (
						<>
							<div className='p-4 bg-white border-b border-gray-200 flex items-center gap-3'>
								<button
									type='button'
									onClick={() => setShowConversation(false)}
									className='md:hidden p-1 -ml-1 rounded-full hover:bg-gray-100 transition-colors'
									aria-label='Back to chats'
								>
									<ChevronLeft className='w-6 h-6 text-gray-600' />
								</button>
								<div className='min-w-0'>
									<h3 className='text-[18px] font-semibold text-gray-900 truncate'>
										{selected.agent?.name ?? 'Owner'}
									</h3>
									<p className='text-[14px] text-gray-500 truncate'>
										{selected.property?.title ?? selected.property?.address ?? 'Property'}
									</p>
								</div>
							</div>
							<div className='flex-1 overflow-y-auto p-6 space-y-4'>
								{loadingMessages ? (
									<div className='flex justify-center py-20'>
										<Loader />
									</div>
								) : messages.length === 0 ? (
									<p className='text-center text-[14px] text-gray-500 py-12'>No messages yet. Send the first one.</p>
								) : (
									messages.map((msg) => {
										const mine = messageFromMe(msg, myUserId)
										return (
											<div key={msg.id} className={`flex ${mine ? 'justify-end' : 'justify-start'}`}>
												<div
													className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
														mine
															? 'bg-primary text-white rounded-br-md'
															: 'bg-white border border-gray-200 text-gray-900 rounded-bl-md'
													}`}
												>
													<p className='text-[15px] whitespace-pre-wrap wrap-break-word'>{msg.message}</p>
													<div className='flex items-center gap-2 justify-end mt-1'>
														<span
															className={`text-[11px] ${mine ? 'text-white/75' : 'text-gray-400'}`}
														>
															{formatMessageTime(msg.created_at)}
														</span>
														{mine && <Check className='w-3.5 h-3.5 text-white/80' />}
													</div>
												</div>
											</div>
										)
									})
								)}
							</div>
							<div className='p-4 bg-white border-t border-gray-200'>
								<div className='flex items-center gap-2 bg-gray-100 rounded-full pl-4 pr-2 py-2'>
									<input
										type='text'
										placeholder='Message'
										value={messageInput}
										onChange={(e) => setMessageInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter' && !e.shiftKey) {
												e.preventDefault()
												handleSend()
											}
										}}
										disabled={sending || !propertyId}
										className='flex-1 bg-transparent text-[15px] focus:outline-none disabled:opacity-50'
									/>
									<button
										type='button'
										onClick={handleSend}
										disabled={sending || !messageInput.trim() || !propertyId}
										className='w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed'
										aria-label='Send message'
									>
										<Send className='w-5 h-5' />
									</button>
								</div>
							</div>
						</>
					)}
				</div>

				{/* Right: landlord from property details */}
				<div className='hidden lg:flex w-80 xl:w-96 flex-col border-l border-gray-200 bg-white'>
					{!selected ? (
						<div className='flex-1 flex flex-col items-center justify-center text-gray-500 px-6 text-center'>
							<p className='text-[15px] font-medium text-gray-700'>Landlord</p>
							<p className='text-[13px] text-gray-500 mt-2'>Select a chat to load landlord details for that property.</p>
						</div>
					) : loadingLandlord ? (
						<div className='flex-1 flex items-center justify-center py-20'>
							<Loader />
						</div>
					) : (
						<div className='p-6 overflow-y-auto'>
							<div className='flex flex-col items-center text-center'>
								<img
									src={getLandlordAvatarSrc(landlord?.avatar, avatarSeed)}
									alt=''
									className='w-20 h-20 rounded-full object-cover mb-4 border border-gray-100'
								/>
								<h3 className='text-[18px] font-semibold text-gray-900'>{displayName}</h3>
								{displayEmail ? (
									<p className='text-[14px] text-gray-500 mt-1 break-all'>{displayEmail}</p>
								) : null}
								<p className='text-[14px] text-gray-500 mt-1'>{displayLocation}</p>
								{selected.agent?.phone ? (
									<p className='text-[14px] text-gray-600 mt-2'>{selected.agent.phone}</p>
								) : null}
								{displayVerified && (
									<div className='flex items-center gap-1.5 mt-3 px-3 py-1.5 bg-green-50 text-green-700 rounded-full'>
										<Check className='w-4 h-4' />
										<span className='text-[13px] font-medium'>Verified</span>
									</div>
								)}
								{landlord?.listedProperties != null && (
									<p className='text-[13px] text-gray-500 mt-3'>
										{landlord.listedProperties} listed propert{landlord.listedProperties === 1 ? 'y' : 'ies'}
									</p>
								)}
								<div className='flex gap-3 mt-6'>
									{propertyId ? (
										<Link
											to={`/property-details/${propertyId}`}
											className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600'
											title='View property'
										>
											<ExternalLink className='w-5 h-5' />
										</Link>
									) : null}
									{selected.agent?.phone ? (
										<a
											href={`tel:${selected.agent.phone.replace(/\s/g, '')}`}
											className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors text-gray-600'
											title='Call'
										>
											<Phone className='w-5 h-5' />
										</a>
									) : null}
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<Footer />
		</>
	)
}

export default MessagesView
