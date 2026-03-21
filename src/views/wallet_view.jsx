import React, { useState, useEffect, useMemo } from 'react'
import { useSelector } from 'react-redux'
import {
	ChevronLeft,
	ChevronRight,
	Building2,
	Plus,
	Minus,
	RefreshCw
} from 'lucide-react'
import TransactionDetailsView from '../components/transaction_details_view'
import TransactionsView from '../components/transactions_view'
import AddMoneyView from './add_money_view'
import ChooseDepositServiceView from './choose_deposit_service_view'
import WithdrawMoneyView from './withdraw_money_view'
import ChooseWithdrawalMethodView from './choose_withdrawal_method_view'
import ProvideAccountDetailsView from './provide_account_details_view'
import UpdateAccountDetailsView from './update_account_details_view'
import WithdrawReviewView from './withdraw_review_view'
import SuccessWidget from '../components/success_widget'
import { selectFormattedBalance, selectRecentTransactions } from '../redux/slices/walletSlice'
import walletController from '../controllers/wallet_controller'
import Loader from '../components/loader'

const mapApiTransactionToRow = (tx, index) => {
	const desc = tx.description ?? tx.type ?? ''
	const s = (tx.status ?? '').toLowerCase()
	return {
		id: tx.uuid ?? index,
		initials: (desc || 'TX').slice(0, 2).toUpperCase(),
		details: desc || tx.type || 'Transaction',
		category: tx.type ?? 'Transaction',
		amount: tx.formatted_amount ?? `₦${Number(tx.amount ?? 0).toLocaleString()}`,
		status: (tx.status ?? 'Processing').charAt(0).toUpperCase() + (tx.status ?? '').slice(1),
		statusVariant: s.includes('success') || s === 'completed' ? 'success' : 'processing',
		date: tx.formatted_date ?? tx.formatted_datetime ?? tx.created_at ?? '',
		fullDate: tx.formatted_date ?? tx.formatted_datetime ?? tx.created_at ?? '',
		time: tx.formatted_datetime?.split(' ').pop() ?? ''
	}
}

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
	availableBalance = '0.00'
}) => {
	const balance = useSelector(selectFormattedBalance) || '₦0.00'
	const recentTransactionsRaw = useSelector(selectRecentTransactions)
	const transactions = useMemo(
		() => (Array.isArray(recentTransactionsRaw) && recentTransactionsRaw.length > 0
			? recentTransactionsRaw.map(mapApiTransactionToRow)
			: SAMPLE_TRANSACTIONS),
		[recentTransactionsRaw]
	)
	useEffect(() => {
		walletController.getWalletBalance({ onError: () => {} })
		walletController.getRecentTransactions({
			setLoading: setIsRefreshingTransactions,
			onError: () => {}
		})
	}, [])
	const [isRefreshingBalance, setIsRefreshingBalance] = useState(false)
	const [isRefreshingTransactions, setIsRefreshingTransactions] = useState(false)
	const [selectedTransaction, setSelectedTransaction] = useState(null)
	const [showAddMoney, setShowAddMoney] = useState(false)
	const [depositAmount, setDepositAmount] = useState(null)
	const [withdrawSubView, setWithdrawSubView] = useState(null) // null | 'choose' | 'amount' | 'add_account' | 'update_account' | 'review'
	const [selectedWithdrawMethod, setSelectedWithdrawMethod] = useState(null)
	const [methodToEdit, setMethodToEdit] = useState(null)
	const [withdrawPreview, setWithdrawPreview] = useState(null)
	const [showWithdrawSuccess, setShowWithdrawSuccess] = useState(false)
	const [showDepositSuccess, setShowDepositSuccess] = useState(false)
	const [showAllTransactions, setShowAllTransactions] = useState(false)

	const handleRefreshBalance = () => {
		setIsRefreshingBalance(true)
		walletController.getWalletBalance({
			setLoading: setIsRefreshingBalance,
			forceRefetch: true,
			onError: () => {}
		})
	}

	const handleAddMoneyClick = () => {
		setShowAddMoney(true)
		onAddMoneyClick?.()
	}

	const handleAddMoneyBack = () => {
		setShowAddMoney(false)
		setDepositAmount(null)
	}

	const handleAddMoneyContinue = (amount) => {
		setDepositAmount(amount)
		setShowAddMoney(false)
	}

	const handleChooseDepositServiceBack = () => {
		setDepositAmount(null)
		setShowAddMoney(true)
	}

	const handleDepositComplete = ({ reference } = {}) => {
		const finalizeSuccess = () => {
			setDepositAmount(null)
			setShowDepositSuccess(true)
		}
		if (!reference) {
			finalizeSuccess()
			return
		}
		walletController.verifyDeposit({
			reference,
			onSuccess: (res) => {
				// verify payload may be either { success, message, data } or data directly
				const verifyData =
					res?.data && typeof res?.data === 'object' && (res?.data?.payment_transaction || res?.data?.status)
						? res.data
						: (res ?? {})
				const paymentStatus = (verifyData?.payment_transaction?.status ?? '').toLowerCase()
				const depositStatus = (verifyData?.status ?? '').toLowerCase()
				const isSuccess = ['success', 'successful', 'completed', 'paid'].includes(paymentStatus)
					|| ['completed', 'success', 'successful'].includes(depositStatus)
				if (isSuccess) {
					finalizeSuccess()
					return
				}
				setDepositAmount(null)
			},
			onError: () => {
				setDepositAmount(null)
			}
		})
	}

	const handleDepositSuccessClose = () => {
		setShowDepositSuccess(false)
		walletController.getWalletBalance({ forceRefetch: true, onError: () => {} })
		walletController.getRecentTransactions({ forceRefetch: true, onError: () => {} })
	}

	const handleWithdrawClick = () => {
		setWithdrawSubView('choose')
		setSelectedWithdrawMethod(null)
		setWithdrawPreview(null)
	}

	const handleWithdrawBack = () => {
		setWithdrawSubView(null)
		setSelectedWithdrawMethod(null)
		setWithdrawPreview(null)
	}

	const handleChooseMethodBack = () => {
		setWithdrawSubView(null)
		setSelectedWithdrawMethod(null)
	}

	const handleSelectWithdrawMethod = (method) => {
		setSelectedWithdrawMethod(method)
		setWithdrawSubView('amount')
	}

	const handleAddNewMethod = () => {
		setWithdrawSubView('add_account')
	}

	const handleProvideAccountBack = () => {
		setWithdrawSubView('choose')
	}

	const handleProvideAccountSuccess = () => {
		setWithdrawSubView('choose')
	}

	const handleEditMethod = (method) => {
		setMethodToEdit(method)
		setWithdrawSubView('update_account')
	}

	const handleUpdateAccountBack = () => {
		setMethodToEdit(null)
		setWithdrawSubView('choose')
	}

	const handleUpdateAccountSuccess = () => {
		setMethodToEdit(null)
		setWithdrawSubView('choose')
	}

	const handleWithdrawAmountBack = () => {
		setWithdrawSubView('choose')
		setSelectedWithdrawMethod(null)
	}

	const handleWithdrawAmountContinue = ({ preview, withdrawalMethod }) => {
		setWithdrawPreview(preview)
		setSelectedWithdrawMethod(withdrawalMethod)
		setWithdrawSubView('review')
	}

	const handleWithdrawReviewBack = () => {
		setWithdrawSubView('amount')
		setWithdrawPreview(null)
	}

	const handleChangeAccount = () => {
		setWithdrawSubView('choose')
		setWithdrawPreview(null)
		setSelectedWithdrawMethod(null)
	}

	const handleWithdrawConfirm = () => {
		setWithdrawSubView(null)
		setSelectedWithdrawMethod(null)
		setWithdrawPreview(null)
		setShowWithdrawSuccess(true)
	}

	const handleWithdrawSuccessClose = () => {
		setShowWithdrawSuccess(false)
		walletController.getWalletBalance({ forceRefetch: true, onError: () => {} })
		walletController.getRecentTransactions({ forceRefetch: true, onError: () => {} })
	}

	// Add money flow: AddMoneyView → ChooseDepositServiceView (with amount)
	if (showAddMoney) {
		return (
			<AddMoneyView
				onBack={handleAddMoneyBack}
				onContinue={handleAddMoneyContinue}
				availableBalance={balance || availableBalance}
				defaultAmount='100,000'
			/>
		)
	}

	if (depositAmount != null) {
		return (
			<ChooseDepositServiceView
				amount={depositAmount}
				onBack={handleChooseDepositServiceBack}
				onComplete={handleDepositComplete}
			/>
		)
	}

	// Withdraw flow: choose method → amount → review (or add account from choose)
	if (withdrawSubView === 'choose') {
		return (
			<ChooseWithdrawalMethodView
				onBack={handleChooseMethodBack}
				onSelectMethod={handleSelectWithdrawMethod}
				onAddNew={handleAddNewMethod}
				onEditMethod={handleEditMethod}
			/>
		)
	}
	if (withdrawSubView === 'update_account' && methodToEdit) {
		return (
			<UpdateAccountDetailsView
				method={methodToEdit}
				onBack={handleUpdateAccountBack}
				onSuccess={handleUpdateAccountSuccess}
			/>
		)
	}
	if (withdrawSubView === 'add_account') {
		return (
			<ProvideAccountDetailsView
				onBack={handleProvideAccountBack}
				onSuccess={handleProvideAccountSuccess}
			/>
		)
	}
	if (withdrawSubView === 'amount') {
		return (
			<WithdrawMoneyView
				onBack={handleWithdrawAmountBack}
				onContinue={handleWithdrawAmountContinue}
				selectedMethod={selectedWithdrawMethod}
				availableBalance={balance || availableBalance}
				defaultAmount=''
			/>
		)
	}
	if (withdrawSubView === 'review') {
		return (
			<WithdrawReviewView
				onBack={handleWithdrawReviewBack}
				onChangeAccount={handleChangeAccount}
				onWithdraw={handleWithdrawConfirm}
				preview={withdrawPreview}
				withdrawalMethod={selectedWithdrawMethod}
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
			<div className='mb-6 flex items-start gap-3'>
				<div>
					<p className='text-[32px] font-bold text-gray-900 tracking-tight'>
						{balance}
					</p>
					<p className='text-[14px] text-gray-500'>
						Total Balance
					</p>
				</div>
				<button
					type='button'
					onClick={handleRefreshBalance}
					disabled={isRefreshingBalance}
					className='p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors mt-1'
					aria-label='Refresh balance'
				>
					<RefreshCw
						className={`w-5 h-5 ${isRefreshingBalance ? 'animate-spin' : ''}`}
					/>
				</button>
			</div>

			{/* Add money & Withdraw cards */}
			<div className='flex flex-row gap-3 md:gap-4 mb-8'>
				<button
					type='button'
					onClick={handleAddMoneyClick}
					className='flex flex-1 md:flex-initial flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors group min-w-0 md:min-w-[160px] md:max-w-[200px]'
				>
					<div className='relative shrink-0'>
						<div className='w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors'>
							<Building2 className='w-5 h-5 md:w-7 md:h-7 text-gray-700' />
						</div>
						<div className='absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-primary flex items-center justify-center'>
							<Plus className='w-3 h-3 md:w-3.5 md:h-3.5 text-white' strokeWidth={2.5} />
						</div>
					</div>
					<span className='text-[14px] md:text-[16px] font-medium text-gray-900'>
						Add money
					</span>
				</button>
				<button
					type='button'
					onClick={handleWithdrawClick}
					className='flex flex-1 md:flex-initial flex-col items-center justify-center gap-2 md:gap-3 p-4 md:p-6 rounded-xl md:rounded-2xl border border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors group min-w-0 md:min-w-[160px] md:max-w-[200px]'
				>
					<div className='relative shrink-0'>
						<div className='w-10 h-10 md:w-14 md:h-14 rounded-lg md:rounded-xl bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors'>
							<Building2 className='w-5 h-5 md:w-7 md:h-7 text-gray-700' />
						</div>
						<div className='absolute -bottom-0.5 -right-0.5 md:-bottom-1 md:-right-1 w-5 h-5 md:w-6 md:h-6 rounded-full bg-gray-700 flex items-center justify-center'>
							<Minus className='w-3 h-3 md:w-3.5 md:h-3.5 text-white' strokeWidth={2.5} />
						</div>
					</div>
					<span className='text-[14px] md:text-[16px] font-medium text-gray-900'>
						Withdraw
					</span>
				</button>
			</div>

			{/* Transaction table */}
			{isRefreshingTransactions && recentTransactionsRaw.length === 0 ? (
				<div className='flex justify-center py-16'>
					<Loader />
				</div>
			) : (
			<>
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

			<div className='mt-4 flex flex-wrap items-center justify-between gap-3'>
				<p className='text-[14px] text-gray-500'>
					Showing {transactions.length} results
				</p>
				<button
					type='button'
					onClick={() => setShowAllTransactions(true)}
					className='inline-flex items-center gap-1.5 text-[14px] font-medium text-primary hover:text-primary/80 transition-colors'
				>
					See all transactions
					<ChevronRight className='w-4 h-4' />
				</button>
			</div>
			</>
			)}

			{/* All transactions slide-in view */}
			{showAllTransactions && (
				<TransactionsView onClose={() => setShowAllTransactions(false)} />
			)}

			{/* Transaction Details View */}
			{selectedTransaction && (
				<TransactionDetailsView
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

			{/* Deposit success */}
			<SuccessWidget
				isOpen={showDepositSuccess}
				onClose={handleDepositSuccessClose}
				title='Deposit successful'
				subtitle='You have successfully funded your wallet.'
				buttonText='Continue to wallet'
			/>
		</div>
		</>
	)
}

export default WalletView
