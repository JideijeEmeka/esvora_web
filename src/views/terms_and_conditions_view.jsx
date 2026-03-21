import React from 'react'
import { ChevronLeft } from 'lucide-react'

const SECTIONS = [
	{
		title: '1. Acceptance of Terms',
		content: 'By accessing or using Esvora ("the Platform"), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you may not use our services. We reserve the right to modify these terms at any time; continued use of the Platform constitutes acceptance of such changes.'
	},
	{
		title: '2. Description of Service',
		content: 'Esvora is a property rental and real estate platform that connects property owners, landlords, and tenants. We facilitate property listings, rental agreements, inspections, payments, and related services. The Platform acts as an intermediary and does not own, manage, or control the properties listed.'
	},
	{
		title: '3. User Accounts and Registration',
		content: 'To access certain features, you must create an account and provide accurate, current information. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must notify us immediately of any unauthorized use. We reserve the right to suspend or terminate accounts that violate these terms or engage in fraudulent activity.'
	},
	{
		title: '4. User Responsibilities',
		content: 'Users must provide accurate information when listing or inquiring about properties. Property owners warrant that they have the right to list properties and that listings are truthful and compliant with applicable laws. Tenants agree to use the Platform in good faith. All users must not engage in harassment, discrimination, fraud, or any unlawful conduct. Users are solely responsible for their interactions and agreements with other users.'
	},
	{
		title: '5. Listings and Property Information',
		content: 'Property listings must be accurate and up to date. Esvora does not verify the accuracy of listings and is not responsible for misrepresentation. Property owners must ensure compliance with local housing laws, zoning regulations, and licensing requirements. We may remove listings that violate our policies or applicable law without notice.'
	},
	{
		title: '6. Payments and Fees',
		content: 'Esvora may charge fees for the use of the Platform, including but not limited to listing fees, service fees, or transaction fees. Payment terms will be communicated at the time of the transaction. All payments are subject to our refund and cancellation policies. Users are responsible for any taxes arising from their use of the Platform.'
	},
	{
		title: '7. Deposits and Rent',
		content: 'Deposits and rent payments facilitated through the Platform are subject to the terms agreed between property owners and tenants. Esvora may hold funds in escrow as described in our payment policies. Disputes regarding deposits or rent should be resolved between the parties; we may provide assistance but are not obligated to intervene.'
	},
	{
		title: '8. Privacy and Data Protection',
		content: 'Your use of the Platform is also governed by our Privacy Policy. We collect and process personal data in accordance with applicable data protection laws. By using the Platform, you consent to the collection, use, and sharing of your information as described in our Privacy Policy.'
	},
	{
		title: '9. Intellectual Property',
		content: 'All content on the Platform, including text, graphics, logos, and software, is the property of Esvora or its licensors. You may not copy, modify, distribute, or create derivative works without our express written permission. User-generated content remains the property of the user, but you grant Esvora a license to use, display, and distribute such content in connection with the Platform.'
	},
	{
		title: '10. Limitation of Liability',
		content: 'To the fullest extent permitted by law, Esvora shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Platform. Our total liability for any claim shall not exceed the fees you paid to Esvora in the twelve months preceding the claim. We do not warrant that the Platform will be uninterrupted or error-free.'
	},
	{
		title: '11. Indemnification',
		content: 'You agree to indemnify and hold Esvora, its affiliates, and their respective officers, directors, and employees harmless from any claims, damages, losses, or expenses arising from your use of the Platform, your violation of these terms, or your violation of any third-party rights.'
	},
	{
		title: '12. Termination',
		content: 'We may terminate or suspend your access to the Platform at any time for violation of these terms or for any other reason. You may close your account at any time. Upon termination, your right to use the Platform ceases immediately. Provisions that by their nature should survive termination shall remain in effect.'
	},
	{
		title: '13. Governing Law and Disputes',
		content: 'These Terms and Conditions shall be governed by the laws of the jurisdiction in which Esvora operates. Any disputes arising from these terms or your use of the Platform shall be resolved through binding arbitration or in the courts of that jurisdiction, as applicable.'
	},
	{
		title: '14. Contact Information',
		content: 'For questions about these Terms and Conditions, please contact us through the Help & Support section in your profile or via the contact information provided on our website.'
	}
]

const TermsAndConditionsView = ({ onBack }) => {
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

			<h1 className='text-[26px] font-bold text-gray-900 mb-2'>
				Terms and Conditions
			</h1>
			<p className='text-[14px] text-gray-500 mb-8'>
				Last updated: March 2025
			</p>

			<div className='space-y-8'>
				{SECTIONS.map((section) => (
					<section key={section.title}>
						<h2 className='text-[18px] font-semibold text-gray-900 mb-3'>
							{section.title}
						</h2>
						<p className='text-[15px] text-gray-600 leading-relaxed'>
							{section.content}
						</p>
					</section>
				))}
			</div>
		</div>
	)
}

export default TermsAndConditionsView
