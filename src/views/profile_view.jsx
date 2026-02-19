import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
	User,
	UserCog,
	Wallet,
	Building2,
	Users,
	FileText,
	Settings,
	Star,
	HelpCircle,
	LogOut,
	Trash2
} from 'lucide-react'
import AccountView from './account_view'
import AccountSettingsView from './account_settings_view'
import AccountTypeView from './account_type_view'
import ChangeEmailView from './change_email_view'
import ChangePhoneNumberView from './change_phone_number_view'
import VerifyEmailView from './verify_email_view'
import VerifyPhoneNumberView from './verify_phone_number_view'
import NotificationSettingsView from './notification_settings_view'
import TenancyView from './tenancy_view'
import AgreementsView from './agreements_view'
import PrivacyAndSecurityView, { ManageAppView } from './privacy_and_security_view'
import SetLocationView from './set_location_view'
import ChangePasswordView from './change_password_view'
import HelpAndSupportView from './help_and_support_view'
import PaymentsView from './payments_view'
import AddPaymentMethodView from './add_payment_method_view'
import WalletView from './wallet_view'
import ReviewsView from './reviews_view'
import LogoutWidget from '../components/logout_widget'
import DeleteAccountWidget from '../components/delete_account_widget'

const SIDEBAR_SECTIONS = [
	{
		id: 'account',
		label: 'Account',
		icon: User
	},
	{
		id: 'account_settings',
		label: 'Account Settings',
		icon: UserCog
	},
	{
		id: 'wallet',
		label: 'Wallet',
		icon: Wallet
	},
	{
		id: 'payments',
		label: 'Payments',
		icon: Building2
	},
	{
		id: 'tenancy',
		label: 'Tenancy',
		icon: Users
	},
	{
		id: 'agreements',
		label: 'Agreements',
		icon: FileText
	}
]

const SIDEBAR_SECTION_2 = [
	{ id: 'privacy_and_security', label: 'Privacy & Security', icon: Settings },
	{ id: 'reviews_ratings', label: 'Reviews & Ratings', icon: Star },
	{ id: 'help_support', label: 'Help & Support', icon: HelpCircle },
	{ id: 'terms', label: 'Terms and Conditions', icon: FileText }
]

const ProfileView = () => {
	const navigate = useNavigate()
	const [selectedSection, setSelectedSection] = useState('account')
	const [clickedSection, setClickedSection] = useState(false)
	const [isLogoutOpen, setIsLogoutOpen] = useState(false)
	const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false)
	const [accountSettingsSubView, setAccountSettingsSubView] = useState(null)
	const [privacySubView, setPrivacySubView] = useState(null)
	const [changePasswordStep, setChangePasswordStep] = useState('form')
	const [paymentsSubView, setPaymentsSubView] = useState(null)

	const renderMainContent = () => {
		if (selectedSection === 'account_settings') {
			const hasSubView = accountSettingsSubView === 'account_type' || accountSettingsSubView === 'change_email' || accountSettingsSubView === 'verify_email' || accountSettingsSubView === 'phone_preference' || accountSettingsSubView === 'verify_phone' || accountSettingsSubView === 'notification'
			return (
				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
					<div className={hasSubView ? 'max-md:hidden' : 'lg:col-span-2'}>
						<AccountSettingsView
							onAccountTypeClick={() => setAccountSettingsSubView('account_type')}
							onChangeEmailClick={() => setAccountSettingsSubView('change_email')}
							onPhonePreferenceClick={() => setAccountSettingsSubView('phone_preference')}
							onNotificationClick={() => setAccountSettingsSubView('notification')}
							onBack={() => { setSelectedSection('account'); setClickedSection(false) }}
							clickedSection={clickedSection}
						/>
					</div>
					{accountSettingsSubView === 'account_type' && (
						<div>
							<AccountTypeView
								onBack={() => setAccountSettingsSubView(null)}
								clickedSection={clickedSection}
							/>
						</div>
					)}
					{accountSettingsSubView === 'change_email' && (
						<div>
							<ChangeEmailView
								onBack={() => setAccountSettingsSubView(null)}
								onSave={() => setAccountSettingsSubView('verify_email')}
							/>
						</div>
					)}
					{accountSettingsSubView === 'phone_preference' && (
						<div>
							<ChangePhoneNumberView
								onBack={() => setAccountSettingsSubView(null)}
								onSave={() => setAccountSettingsSubView('verify_phone')}
							/>
						</div>
					)}
					{accountSettingsSubView === 'verify_phone' && (
						<div>
							<VerifyPhoneNumberView
								onBack={() => setAccountSettingsSubView('phone_preference')}
								onResendCode={() => {}}
							/>
						</div>
					)}
					{accountSettingsSubView === 'verify_email' && (
						<div>
							<VerifyEmailView
								onBack={() => setAccountSettingsSubView('change_email')}
								onResendCode={() => {}}
							/>
						</div>
					)}
					{accountSettingsSubView === 'notification' && (
						<div>
							<NotificationSettingsView
								onBack={() => setAccountSettingsSubView(null)}
							/>
						</div>
					)}
				</div>
			)
		}
		switch (selectedSection) {
			case 'account':
				return <AccountView clickedSection={clickedSection} 
				 onBack={() => {setSelectedSection('account'), setClickedSection(false)}} />
			case 'tenancy':
				return <TenancyView />
			case 'agreements':
				return (
					<AgreementsView
						onBack={() => {
							setSelectedSection('account')
							setClickedSection(false)
						}}
					/>
				)
			case 'wallet':
				return (
					<WalletView
						onBack={() => {
							setSelectedSection('account')
							setClickedSection(false)
						}}
					/>
				)
			case 'payments': {
				const hasPaymentsSubView = paymentsSubView === 'add_method'
				return (
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
						<div className={hasPaymentsSubView ? 'max-md:hidden' : 'lg:col-span-2'}>
							<PaymentsView
								onBack={() => {
									setSelectedSection('account')
									setClickedSection(false)
								}}
								onPaymentMethodClick={() => setPaymentsSubView('add_method')}
							/>
						</div>
						{paymentsSubView === 'add_method' && (
							<div>
								<AddPaymentMethodView
									onBack={() => setPaymentsSubView(null)}
									onAddNewCard={() => {}}
								/>
							</div>
						)}
					</div>
				)
			}
			case 'privacy_and_security': {
				const hasPrivacySubView =
					privacySubView === 'app_setting' ||
					privacySubView === 'set_location' ||
					privacySubView === 'change_password'
				return (
					<div className='grid grid-cols-1 lg:grid-cols-2 gap-8 items-start'>
						<div className={hasPrivacySubView ? 'max-md:hidden' : 'lg:col-span-2'}>
							<PrivacyAndSecurityView
								onAppSettingClick={() => setPrivacySubView('app_setting')}
								onSetLocationClick={() => setPrivacySubView('set_location')}
								onChangePasswordClick={() =>
									setPrivacySubView('change_password')
								}
								onBack={() => {
									setSelectedSection('account')
									setClickedSection(false)
								}}
							/>
						</div>
						{privacySubView === 'app_setting' && (
							<div>
								<ManageAppView
									onBack={() => setPrivacySubView(null)}
								/>
							</div>
						)}
						{privacySubView === 'set_location' && (
							<div>
								<SetLocationView
									onBack={() => setPrivacySubView(null)}
									onSave={() => setPrivacySubView(null)}
								/>
							</div>
						)}
						{privacySubView === 'change_password' && (
							<div>
								{changePasswordStep === 'form' ? (
									<ChangePasswordView
										onBack={() => {
											setPrivacySubView(null)
											setChangePasswordStep('form')
										}}
										onSubmit={() => setChangePasswordStep('verify')}
									/>
								) : (
									<VerifyPhoneNumberView
										onBack={() => setChangePasswordStep('form')}
										onResendCode={() => {}}
										backLabel='Back to Change password'
										successTitle='Password changed!'
										successSubtitle='Your password has been successfully updated, proceed to login'
										successButtonText='Close'
									/>
								)}
							</div>
						)}
					</div>
				)
			}
			case 'reviews_ratings':
				return (
					<ReviewsView
						onBack={() => {
							setSelectedSection('account')
							setClickedSection(false)
						}}
					/>
				)
			case 'help_support':
				return (
					<HelpAndSupportView
						onBack={() => {
							setSelectedSection('account')
							setClickedSection(false)
						}}
					/>
				)
			case 'terms':
				return (
					<div className='bg-white rounded-2xl border border-gray-200 p-8 text-center text-gray-500'>
						{selectedSection.replace(/_/g, ' ')} content coming soon.
					</div>
				)
			default:
				return <AccountView clickedSection={clickedSection} 
				   onBack={() => {setSelectedSection('account'), setClickedSection(false)}} />
		}
	}

	return (
		<div className='pt-30 pb-10 px-6 md:px-16 lg:px-20 min-h-screen'>
			<div className='flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto'>
				{/* Left sidebar */}
				<aside className={`lg:w-64 shrink-0 border-r border-gray-200 p-4 
					${clickedSection === true ? 'max-md:hidden' : ''}`}>
					<h2 className='text-[20px] font-semibold text-gray-900 mb-4'>
						Profile
					</h2>
					<nav className='space-y-1'>
						{SIDEBAR_SECTIONS.map((item) => {
							const Icon = item.icon
							const isSelected = selectedSection === item.id
							return (
								<button
									key={item.id}
									type='button'
									onClick={() => {setSelectedSection(item.id), setClickedSection(true)}}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[16px] font-medium transition-colors ${
										isSelected
											? 'bg-gray-100 text-gray-900'
											: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
									}`}
								>
									<Icon className='w-5 h-5 shrink-0' />
									{item.label}
								</button>
							)
						})}

						<div className='border-t border-gray-200 my-4' />

						{SIDEBAR_SECTION_2.map((item) => {
							const Icon = item.icon
							const isSelected = selectedSection === item.id
							return (
								<button
									key={item.id}
									type='button'
									onClick={() => { setSelectedSection(item.id); setClickedSection(true) }}
									className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[16px] font-medium transition-colors ${
										isSelected
											? 'bg-gray-100 text-gray-900'
											: 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
									}`}
								>
									<Icon className='w-5 h-5 shrink-0' />
									{item.label}
								</button>
							)
						})}

						<div className='border-t border-gray-200 my-4' />

						<button
							type='button'
							onClick={() => setIsLogoutOpen(true)}
							className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[16px] font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors'
						>
							<LogOut className='w-5 h-5 shrink-0' />
							Log out
						</button>

						<LogoutWidget
							isOpen={isLogoutOpen}
							onClose={() => setIsLogoutOpen(false)}
							onConfirm={() => navigate('/login')}
						/>

						<div className='mt-4'>
							<p className='px-4 py-2 text-[14px] font-bold text-red-600'>
								Dangerous area
							</p>
							<button
								type='button'
								onClick={() => setIsDeleteAccountOpen(true)}
								className='w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-[16px] font-medium text-red-600 hover:bg-red-50 transition-colors'
							>
								<Trash2 className='w-5 h-5 shrink-0' />
								Delete account
							</button>

							<DeleteAccountWidget
								isOpen={isDeleteAccountOpen}
								onClose={() => setIsDeleteAccountOpen(false)}
								onConfirm={() => {
									// TODO: call delete account API then e.g. navigate('/login')
									navigate('/login')
								}}
								userName='emmanuel'
							/>
						</div>
					</nav>
				</aside>

				{/* Main content area */}
				<main className='flex-1 min-w-0'>
					{renderMainContent()}
				</main>
			</div>
		</div>
	)
}

export default ProfileView
