import React, { useState } from 'react'
import { ChevronLeft, ChevronDown } from 'lucide-react'

const BANKS = [
	'Access Bank',
	'Citibank Nigeria',
	'EcoBank Nigeria',
	'Fidelity Bank',
	'First Bank of Nigeria',
	'First City Monument Bank',
	'Globus Bank',
	'Guaranty Trust Bank',
	'Heritage Bank',
	'Keystone Bank',
	'Kuda Bank',
	'Opay',
	'PalmPay',
	'Polaris Bank',
	'Providus Bank',
	'Stanbic IBTC Bank',
	'Standard Chartered Nigeria',
	'Sterling Bank',
	'SunTrust Bank',
	'Union Bank of Nigeria',
	'United Bank for Africa',
	'Wema Bank',
	'Zenith Bank'
]

const AddBankAccountDetailsView = ({
	onBack,
	onAddAccount,
	withdrawAmount
}) => {
	const [accountNumber, setAccountNumber] = useState('')
	const [bank, setBank] = useState('')
	const [isBankOpen, setIsBankOpen] = useState(false)

	const canSubmit =
		accountNumber.length >= 10 && accountNumber.length <= 11 && bank.length > 0

	const handleAddAccount = () => {
		if (!canSubmit) return
		onAddAccount?.({ accountNumber: accountNumber.trim(), bank, withdrawAmount })
	}

	return (
		<div className='bg-white rounded-2xl border border-gray-200 p-6 lg:p-8 max-w-2xl mx-auto'>
			{onBack && (
				<button
					type='button'
					onClick={onBack}
					className='flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-gray-900 mb-8 transition-colors'
				>
					<ChevronLeft className='w-4 h-4' />
					Back
				</button>
			)}

			<div className='text-center mb-8'>
				<h2 className='text-[24px] md:text-[28px] font-bold text-gray-900 mb-2'>
					Add account
				</h2>
				<p className='text-[14px] text-gray-500'>
					Add your local account for easy payments.
				</p>
			</div>

			<div className='space-y-6'>
				<div>
					<label
						htmlFor='account-number'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Account number
					</label>
					<input
						id='account-number'
						type='text'
						inputMode='numeric'
						value={accountNumber}
						onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 11))}
						placeholder='Enter account number.'
						className='w-full px-4 py-3 rounded-xl border border-gray-300 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
						aria-label='Account number'
					/>
				</div>

				<div>
					<label className='block text-[14px] font-medium text-gray-700 mb-2'>
						Bank
					</label>
					<div className='relative'>
						<button
							type='button'
							onClick={() => setIsBankOpen((prev) => !prev)}
							className='w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-left text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary flex items-center justify-between'
							aria-haspopup='listbox'
							aria-expanded={isBankOpen}
						>
							<span className={bank ? 'text-gray-900' : 'text-gray-400'}>
								{bank || 'Select bank.'}
							</span>
							<ChevronDown
								className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${
									isBankOpen ? 'rotate-180' : ''
								}`}
							/>
						</button>
						{isBankOpen && (
							<>
								<div
									className='fixed inset-0 z-10'
									onClick={() => setIsBankOpen(false)}
									aria-hidden='true'
								/>
								<ul
									className='absolute z-20 w-full mt-1 max-h-48 overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-lg py-1'
									role='listbox'
								>
									{BANKS.map((b) => (
										<li
											key={b}
											role='option'
											aria-selected={bank === b}
											onClick={() => {
												setBank(b)
												setIsBankOpen(false)
											}}
											className={`px-4 py-3 text-[15px] cursor-pointer hover:bg-gray-50 ${
												bank === b ? 'bg-primary/5 text-primary font-medium' : 'text-gray-900'
											}`}
										>
											{b}
										</li>
									))}
								</ul>
							</>
						)}
					</div>
				</div>
			</div>

			<button
				type='button'
				onClick={handleAddAccount}
				disabled={!canSubmit}
				className='w-full mt-8 px-6 py-4 rounded-xl text-[16px] font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 transition-colors'
			>
				Add account
			</button>
		</div>
	)
}

export default AddBankAccountDetailsView
