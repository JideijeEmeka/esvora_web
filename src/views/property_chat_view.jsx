import React, { useCallback, useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { ChevronLeft, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../components/navbar'
import Footer from '../components/footer'
import Loader from '../components/loader'
import chatController from '../controllers/chat_controller'
import { selectCurrentAccount } from '../redux/slices/accountSlice'
import { getToken } from '../lib/localStorage'

function formatChatTime(iso) {
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

const PropertyChatView = () => {
	const { id } = useParams()
	const navigate = useNavigate()
	const account = useSelector(selectCurrentAccount)
	const myUserId = account?.id != null ? Number(account.id) : 0

	const [messages, setMessages] = useState([])
	const [loading, setLoading] = useState(true)
	const [sending, setSending] = useState(false)
	const [input, setInput] = useState('')

	const load = useCallback(() => {
		if (!id) return
		setLoading(true)
		chatController.getChatMessages(id, {
			onSuccess: (res) => {
				setMessages(res?.data ?? [])
				setLoading(false)
			},
			onError: (msg) => {
				toast.error(msg ?? 'Failed to load chat')
				setLoading(false)
			},
			forceRefetch: true
		})
	}, [id])

	useEffect(() => {
		if (!id) {
			navigate('/explore', { replace: true })
			return
		}
		if (!((getToken() ?? '').trim())) {
			window.scrollTo(0, 0)
			navigate('/login', { state: { from: `/property-details/${id}/chat` } })
			return
		}
		load()
	}, [id, load, navigate])

	const handleSend = () => {
		const text = input.trim()
		if (!text || !id) return
		setSending(true)
		chatController.sendMessage(id, text, {
			onSuccess: (res) => {
				setInput('')
				if (res?.data) setMessages((prev) => [...prev, res.data])
				else load()
				setSending(false)
			},
			onError: (msg) => {
				toast.error(msg ?? 'Failed to send message')
				setSending(false)
			}
		})
	}

	const backToProperty = () => {
		window.scrollTo(0, 0)
		navigate(`/property-details/${id}`)
	}

	return (
		<>
			<Navbar />
			<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col max-w-3xl mx-auto w-full'>
				<button
					type='button'
					onClick={backToProperty}
					className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-4 transition-colors self-start'
				>
					<ChevronLeft className='w-5 h-5' />
					Back to property
				</button>
				<h1 className='text-[22px] font-semibold text-gray-900 mb-2'>Chat with owner</h1>
				<p className='text-[14px] text-gray-500 mb-6'>Messages for this listing</p>

				{loading ? (
					<div className='flex flex-1 items-center justify-center py-20'>
						<Loader />
					</div>
				) : (
					<>
						<div className='flex-1 border border-gray-200 rounded-2xl bg-gray-50/80 p-4 min-h-[320px] max-h-[55vh] overflow-y-auto flex flex-col gap-3'>
							{messages.length === 0 ? (
								<p className='text-[14px] text-gray-500 text-center py-12'>No messages yet. Say hello to the owner.</p>
							) : (
								messages.map((m) => {
									const mine = messageFromMe(m, myUserId)
									return (
										<div
											key={m.id}
											className={`flex ${mine ? 'justify-end' : 'justify-start'}`}
										>
											<div
												className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-[15px] ${
													mine
														? 'bg-primary text-white rounded-br-md'
														: 'bg-white text-gray-900 border border-gray-200 rounded-bl-md'
												}`}
											>
												<p className='whitespace-pre-wrap break-words'>{m.message}</p>
												<p
													className={`text-[11px] mt-1 ${
														mine ? 'text-white/75' : 'text-gray-400'
													}`}
												>
													{formatChatTime(m.created_at)}
												</p>
											</div>
										</div>
									)
								})
							)}
						</div>
						<div className='mt-4 flex gap-2 items-end'>
							<textarea
								value={input}
								onChange={(e) => setInput(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter' && !e.shiftKey) {
										e.preventDefault()
										handleSend()
									}
								}}
								rows={2}
								placeholder='Type a message…'
								className='flex-1 resize-none rounded-xl border border-gray-300 px-4 py-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20'
							/>
							<button
								type='button'
								disabled={sending || !input.trim()}
								onClick={handleSend}
								className='shrink-0 h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
								aria-label='Send message'
							>
								<Send className='w-5 h-5' />
							</button>
						</div>
					</>
				)}
			</div>
			<Footer />
		</>
	)
}

export default PropertyChatView
