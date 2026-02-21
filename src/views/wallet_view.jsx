import React, { useState } from 'react'
import {
	ChevronLeft,
	Building2,
	Plus,
	Minus,
	ArrowDownToLine,
	Search,
	Filter,
	Calendar,
	ChevronDown
} from 'lucide-react'
import PaymentDetailsView from '../components/payment_details_view'
import AddMoneyView from './add_money_view'
import WithdrawMoneyView from './withdraw_money_view'
import AddBankAccountDetailsView from './add_bank_account_details_view'
import WithdrawReviewView from './withdraw_review_view'
import SuccessWidget from '../components/success_widget'

const SAMPLE_TRANSACTIONS = [
	{
		id: 1,
		initials: 'OE',
		details: 'Osaite Emmanuel',
		category: 'Shortlet',
		amount: 'NGN 32,000.00',
		status: 'Successful',
		statusVariant: 'success',
		date: '26 Dec',
		fullDate: '26 Dec',
		time: '04:32 PM'
	},
	{
		id: 2,
		initials: 'OE',
		details: 'Osaite Emmanuel',
		category: 'Rental',
		amount: 'NGN 32,000.00',
		status: 'Processing',
		statusVariant: 'processing',
		date: '26 Dec',
		fullDate: '26 Dec',
		time: '02:15 PM'
	},
	{
		id: 3,
		initials: 'OE',
		details: 'Osaite Emmanuel',
		category: 'Rental',
		amount: 'NGN 32,000.00',
		status: 'Successful',
		statusVariant: 'success',
		date: '26 Dec',
		fullDate: '26 Dec',
		time: '10:45 AM'
	},
	{
		id: 4,
		initials: 'OE',
		details: 'Osaite Emmanuel',
		category: 'Rental',
		amount: 'NGN 32,000.00',
		status: 'Successful',
		statusVariant: 'success',
		date: '26 Dec',
		fullDate: '26 Dec',
		time: '09:20 AM'
	}
]

const WalletView = ({
	onBack,
	onAddMoneyClick,
	balance = '₦123,000.00',
	transactions = SAMPLE_TRANSACTIONS,
	availableBalance = '350.00'
}) => {
	const [searchQuery, setSearchQuery] = useState('')
	const [selectedTransaction, setSelectedTransaction] = useState(null)
	const [showAddMoney, setShowAddMoney] = useState(false)
	const [showWithdraw, setShowWithdraw] = useState(false)
	const [showAddBankAccount, setShowAddBankAccount] = useState(false)
	const [showWithdrawReview, setShowWithdrawReview] = useState(false)
	const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false)
	const [withdrawAmount, setWithdrawAmount] = useState(null)
	const [withdrawAccountDetails, setWithdrawAccountDetails] = useState(null)

	const handleAddMoneyClick = () => {
		setShowAddMoney(true)
		onAddMoneyClick?.()
	}

	const handleAddMoneyBack = () => {
		setShowAddMoney(false)
	}

	const handleAddMoneyContinue = (amount) => {
		console.log('Amount to add:', amount)
		setShowAddMoney(false)
	}

	const handleWithdrawClick = () => {
		setShowWithdraw(true)
	}

	const handleWithdrawBack = () => {
		setShowWithdraw(false)
	}

	const handleWithdrawContinue = (amount) => {
		setWithdrawAmount(amount)
		setShowWithdraw(false)
		setShowAddBankAccount(true)
	}

	const handleAddBankAccountBack = () => {
		setShowAddBankAccount(false)
		setShowWithdraw(true)
	}

	const handleAddAccount = (payload) => {
		setWithdrawAccountDetails({ accountNumber: payload.accountNumber, bank: payload.bank })
		setShowAddBankAccount(false)
		setShowWithdrawReview(true)
	}

	const handleWithdrawReviewBack = () => {
		setShowWithdrawReview(false)
		setShowAddBankAccount(true)
	}

	const handleChangeAccount = () => {
		setShowWithdrawReview(false)
		setShowAddBankAccount(true)
	}

	const handleWithdrawConfirm = () => {
		console.log('Withdraw confirmed', { withdrawAmount, withdrawAccountDetails })
		setShowWithdrawReview(false)
		setShowWithdrawSuccess(true)
	}

	const handleWithdrawSuccessClose = () => {
		setShowWithdrawSuccess(false)
		setWithdrawAmount(null)
		setWithdrawAccountDetails(null)
	}

	// Show Add Money View if active
	if (showAddMoney) {
		return (
			<AddMoneyView
				onBack={handleAddMoneyBack}
				onContinue={handleAddMoneyContinue}
				availableBalance={availableBalance}
				defaultAmount='123,000'
			/>
		)
	}

	// Show Withdraw View if active
	if (showWithdraw) {
		return (
			<WithdrawMoneyView
				onBack={handleWithdrawBack}
				onContinue={handleWithdrawContinue}
				availableBalance={availableBalance}
				defaultAmount=''
			/>
		)
	}

	// Show Add Bank Account Details (after withdraw amount)
	if (showAddBankAccount) {
		return (
			<AddBankAccountDetailsView
				onBack={handleAddBankAccountBack}
				onAddAccount={handleAddAccount}
				withdrawAmount={withdrawAmount}
			/>
		)
	}

	// Show Withdraw Review (after add account)
	if (showWithdrawReview) {
		return (
			<WithdrawReviewView
				onBack={handleWithdrawReviewBack}
				onChangeAccount={handleChangeAccount}
				onWithdraw={handleWithdrawConfirm}
				accountNumber={withdrawAccountDetails?.accountNumber}
				bank={withdrawAccountDetails?.bank}
				withdrawAmount={withdrawAmount}
			/>
		)
	}

	return (
		<>
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

			{/* Balance */}
			<div className='mb-6'>
				<p className='text-[32px] font-bold text-gray-900 tracking-tight'>
					{balance}
				</p>
				<p className='text-[14px] text-gray-500'>
					Total Balance
				</p>
			</div>

			{/* Add money & Withdraw cards */}
			<div className='flex flex-wrap gap-4 mb-8'>
				<button
					type='button'
					onClick={handleAddMoneyClick}
					className='flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors group min-w-[160px] max-w-[200px]'
				>
					<div className='relative shrink-0'>
						<div className='w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors'>
							<Building2 className='w-7 h-7 text-gray-700' />
						</div>
						<div className='absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center'>
							<Plus className='w-3.5 h-3.5 text-white' strokeWidth={2.5} />
						</div>
					</div>
					<span className='text-[16px] font-medium text-gray-900'>
						Add money
					</span>
				</button>
				<button
					type='button'
					onClick={handleWithdrawClick}
					className='flex flex-col items-center gap-3 p-6 rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors group min-w-[160px] max-w-[200px]'
				>
					<div className='relative shrink-0'>
						<div className='w-14 h-14 rounded-xl bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors'>
							<Building2 className='w-7 h-7 text-gray-700' />
						</div>
						<div className='absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center'>
							<Minus className='w-3.5 h-3.5 text-white' strokeWidth={2.5} />
						</div>
					</div>
					<span className='text-[16px] font-medium text-gray-900'>
						Withdraw
					</span>
				</button>
			</div>

			{/* Search and filters */}
			<div className='flex flex-col sm:flex-row gap-3 mb-6'>
				<div className='relative flex-1'>
					<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400' />
					<input
						type='search'
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						placeholder='Search transaction'
						className='w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 text-[16px] text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
						aria-label='Search transaction'
					/>
				</div>
				<div className='flex gap-2'>
					<button
						type='button'
						className='inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors'
					>
						<Filter className='w-4 h-4' />
						Filter
						<ChevronDown className='w-4 h-4' />
					</button>
					<button
						type='button'
						className='inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-gray-300 text-[14px] font-medium text-gray-700 hover:bg-gray-50 transition-colors'
					>
						<Calendar className='w-4 h-4' />
						Date/time
						<ChevronDown className='w-4 h-4' />
					</button>
				</div>
			</div>

			{/* Transaction table */}
			<div className='overflow-x-auto -mx-2'>
				<table className='w-full min-w-[600px]'>
					<thead>
						<tr className='border-b border-gray-200'>
							<th className='text-left py-3 px-2 text-[12px] font-semibold text-gray-500 uppercase tracking-wider'>
								Details
							</th>
							<th className='text-left py-3 px-2 text-[12px] font-semibold text-gray-500 uppercase tracking-wider'>
								Category
							</th>
							<th className='text-left py-3 px-2 text-[12px] font-semibold text-gray-500 uppercase tracking-wider'>
								Amount
							</th>
							<th className='text-left py-3 px-2 text-[12px] font-semibold text-gray-500 uppercase tracking-wider'>
								Status
							</th>
							<th className='text-left py-3 px-2 text-[12px] font-semibold text-gray-500 uppercase tracking-wider'>
								Date
							</th>
						</tr>
					</thead>
					<tbody>
						{transactions.map((tx) => (
							<tr
								key={tx.id}
								onClick={() => setSelectedTransaction(tx)}
								className='border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer'
							>
								<td className='py-4 px-2'>
									<div className='flex items-center gap-3'>
										<div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[14px] font-semibold text-gray-700 shrink-0'>
											{tx.initials}
										</div>
										<span className='text-[14px] font-medium text-gray-900'>
											Payment from {tx.details}
										</span>
									</div>
								</td>
								<td className='py-4 px-2 text-[14px] text-gray-600'>
									{tx.category}
								</td>
								<td className='py-4 px-2 text-[14px] font-medium text-gray-900'>
									{tx.amount}
								</td>
								<td className='py-4 px-2'>
									<span
										className={`inline-flex px-2.5 py-1 rounded-full text-[12px] font-medium ${
											tx.statusVariant === 'success'
												? 'bg-green-100 text-green-800'
												: 'bg-amber-100 text-amber-800'
										}`}
									>
										{tx.status}
									</span>
								</td>
								<td className='py-4 px-2 text-[14px] text-gray-600'>
									{tx.date}
								</td>
							</tr>
						))}
					</tbody>
				</table>
			</div>

			<p className='mt-4 text-[14px] text-gray-500'>
				Showing {transactions.length} results
			</p>

			{/* Payment Details View */}
			{selectedTransaction && (
				<PaymentDetailsView
					transaction={selectedTransaction}
					onClose={() => setSelectedTransaction(null)}
				/>
			)}

			{/* Withdraw success */}
			<SuccessWidget
				isOpen={showWithdrawSuccess}
				onClose={handleWithdrawSuccessClose}
				title='Request successful'
				subtitle="You have successfully requested for a withdrawal. your account will be credited shortly"
				buttonText='Continue to wallet'
			/>
		</div>
		</>
	)
}

export default WalletView
