import React from 'react'
import { Mail, Phone, ChevronLeft, ChevronRight, MessageCircle, Star } from 'lucide-react'
import { kSupportWhatsAppNumber, kSupportPhoneNumber } from '../lib/constants'

const SUPPORT_OPTIONS = [
	{
		id: 'live_chat',
		label: 'Live chat',
		description: 'Chat with our support team',
		icon: MessageCircle
	},
	{
		id: 'create_ticket',
		label: 'Create a ticket',
		description: 'Send your request to our official mail',
		icon: Mail
	},
	{
		id: 'whatsapp',
		label: 'WhatsApp',
		description: 'Send us a message on WhatsApp',
		icon: MessageCircle
	},
	{
		id: 'phone',
		label: 'Phone',
		description: 'Call to speak to one of our agents',
		icon: Phone
	},
	{
		id: 'rate_experience',
		label: 'Rate your experience',
		description: 'Give us a review of our app',
		icon: Star
	}
]

const HelpAndSupportView = ({
	onBack,
	onLiveChatClick,
	onCreateTicketClick,
	onWhatsAppClick,
	onPhoneClick,
	onRateExperienceClick
}) => {
	const handleOptionClick = (id) => {
		if (id === 'live_chat') {
			if (onLiveChatClick) {
				onLiveChatClick()
			} else if (typeof window !== 'undefined' && window.Tawk_API) {
				window.Tawk_API.start?.({ showWidget: true })
				setTimeout(() => window.Tawk_API?.maximize?.(), 100)
			}
		}
		if (id === 'create_ticket' && onCreateTicketClick) onCreateTicketClick()
		if (id === 'whatsapp') {
			if (onWhatsAppClick) {
				onWhatsAppClick()
			} else {
				const num = kSupportWhatsAppNumber.replace(/\D/g, '')
				window.open(`https://wa.me/${num}`, '_blank')
			}
		}
		if (id === 'phone') {
			if (onPhoneClick) {
				onPhoneClick()
			} else {
				const num = kSupportPhoneNumber.replace(/\s/g, '')
				window.open(`tel:${num}`, '_self')
			}
		}
		if (id === 'rate_experience' && onRateExperienceClick) onRateExperienceClick()
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8'>
			{onBack && (
				<div className='md:hidden'>
					<button
						type='button'
						onClick={onBack}
						className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors'
					>
						<ChevronLeft className='w-4 h-4' />
						Back
					</button>
				</div>
			)}

			<h2 className='text-[22px] font-semibold text-gray-900 mb-2'>
				Support
			</h2>
			<p className='text-[16px] text-gray-600 mb-6'>
				Hello, what do you want us to do for you?
			</p>

			<ul className='space-y-0'>
				{SUPPORT_OPTIONS.map((item) => {
					const Icon = item.icon
					return (
						<li key={item.id}>
							<button
								type='button'
								onClick={() => handleOptionClick(item.id)}
								className='w-full flex items-center gap-4 py-4 border-b border-gray-100 last:border-b-0 text-left hover:bg-gray-50 rounded-lg transition-colors group'
							>
								<div className='shrink-0 w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center group-hover:bg-gray-200 transition-colors'>
									<Icon className='w-5 h-5 text-gray-700' />
								</div>
								<div className='flex-1 min-w-0'>
									<p className='text-[16px] font-medium text-gray-900'>
										{item.label}
									</p>
									<p className='text-[14px] text-gray-500'>
										{item.description}
									</p>
								</div>
								<ChevronRight className='w-5 h-5 text-gray-400 shrink-0' />
							</button>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default HelpAndSupportView
