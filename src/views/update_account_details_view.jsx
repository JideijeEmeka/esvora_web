import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { ChevronLeft, ChevronDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { selectBanks } from '../redux/slices/walletSlice'
import walletController from '../controllers/wallet_controller'
import Loader from '../components/loader'

const UpdateAccountDetailsView = ({ method, onBack, onSuccess }) => {
	const banks = useSelector(selectBanks)
	const [accountNumber, setAccountNumber] = useState(method?.account_number ?? method?.accountNumber ?? '')
	const [accountName, setAccountName] = useState(method?.account_name ?? method?.accountName ?? '')
	const [selectedBank, setSelectedBank] = useState(null)
	const [isBankOpen, setIsBankOpen] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [isSubmitting, setIsSubmitting] = useState(false)

	useEffect(() => {
		walletController.listBanks({
			setLoading: setIsLoading,
			onError: () => {}
		})
	}, [])

	useEffect(() => {
		const bankName = method?.bank_name ?? method?.bankName ?? ''
		if (bankName && banks?.length > 0) {
			const match = banks.find((b) => (b.name ?? b.label) === bankName)
			if (match) setSelectedBank({ value: match.code ?? match.id, label: match.name ?? match.label, ...match })
		}
	}, [banks, method])

	const bankName = selectedBank?.name ?? selectedBank?.label ?? ''
	const methodId = method?.id ?? method?.uuid
	const canSubmit =
		methodId &&
		accountNumber.replace(/\D/g, '').length >= 10 &&
		accountNumber.replace(/\D/g, '').length <= 11 &&
		bankName &&
		accountName.trim()

	const handleSubmit = () => {
		if (!canSubmit || isSubmitting) return
		walletController.updateWithdrawalMethod({
			methodId,
			bankName,
			accountNumber: accountNumber.replace(/\D/g, '').trim(),
			accountName: accountName.trim(),
			setLoading: setIsSubmitting,
			onSuccess: () => {
				toast.success('Withdrawal method updated successfully')
				onSuccess?.()
			},
			onError: (m) => toast.error(m ?? 'Failed to update withdrawal method')
		})
	}

	const bankList = Array.isArray(banks) ? banks : []
	const displayBanks = bankList
		.map((b) => ({
			value: b.code ?? b.id,
			label: b.name ?? b.label ?? '',
			...b
		}))
		.filter((b) => b.label)

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

			<h2 className='text-[24px] md:text-[28px] font-bold text-gray-900 mb-2'>
				Update account details
			</h2>
			<p className='text-[14px] text-gray-500 mb-8'>
				Edit your bank account for withdrawals
			</p>

			<div className='space-y-6'>
				<div>
					<label
						htmlFor='account-number-update'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Account number
					</label>
					<input
						id='account-number-update'
						type='text'
						inputMode='numeric'
						value={accountNumber}
						onChange={(e) =>
							setAccountNumber(e.target.value.replace(/\D/g, '').slice(0, 11))
						}
						placeholder='Enter account number'
						className='w-full px-4 py-3 rounded-xl border border-gray-300 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
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
							disabled={isLoading}
							className='w-full px-4 py-3 rounded-xl border border-gray-300 bg-white text-left text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary flex items-center justify-between disabled:opacity-70'
						>
							<span className={`flex items-center gap-2 ${bankName ? 'text-gray-900' : 'text-gray-400'}`}>
								{isLoading ? <Loader size={20} /> : bankName || 'Select bank'}
							</span>
							{!isLoading && (
								<ChevronDown
									className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${
										isBankOpen ? 'rotate-180' : ''
									}`}
								/>
							)}
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
									{displayBanks.map((b) => (
										<li
											key={b.value ?? b.label}
											role='option'
											aria-selected={selectedBank?.value === b.value}
											onClick={() => {
												setSelectedBank(b)
												setIsBankOpen(false)
											}}
											className={`px-4 py-3 text-[15px] cursor-pointer hover:bg-gray-50 ${
												selectedBank?.value === b.value
													? 'bg-primary/5 text-primary font-medium'
													: 'text-gray-900'
											}`}
										>
											{b.label}
										</li>
									))}
								</ul>
							</>
						)}
					</div>
				</div>

				<div>
					<label
						htmlFor='account-name-update'
						className='block text-[14px] font-medium text-gray-700 mb-2'
					>
						Account name
					</label>
					<input
						id='account-name-update'
						type='text'
						value={accountName}
						onChange={(e) => setAccountName(e.target.value)}
						placeholder='Enter account name'
						className='w-full px-4 py-3 rounded-xl border border-gray-300 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
					/>
				</div>
			</div>

			<button
				type='button'
				onClick={handleSubmit}
				disabled={!canSubmit || isSubmitting}
				className='w-full mt-8 px-6 py-4 rounded-xl text-[16px] font-semibold bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
			>
				{isSubmitting ? 'Updating...' : 'Update'}
			</button>
		</div>
	)
}

export default UpdateAccountDetailsView
