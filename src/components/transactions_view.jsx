import React, { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { X, ChevronLeft, ChevronRight, Search, Filter, ChevronDown, RefreshCw } from 'lucide-react'
import {
	selectWalletTransactions,
	selectWithdrawalTransactions,
	selectDepositTransactions
} from '../redux/slices/walletSlice'
import walletController from '../controllers/wallet_controller'
import Loader from './loader'
import TransactionDetailsView from './transaction_details_view'
import WithdrawalTransactionDetailsView from './withdrawal_transaction_details_view'
import DepositTransactionDetailsView from './deposit_transaction_details_view'
import FilterWalletTransactionsView from './filter_wallet_transactions_view'

const TABS = [
	{ key: 'all', label: 'All' },
	{ key: 'deposits', label: 'Deposits' },
	{ key: 'withdrawals', label: 'Withdrawals' }
]

const mapApiTransactionToRow = (tx, index) => {
	const desc = tx.description ?? tx.type ?? ''
	const s = (tx.status ?? '').toLowerCase()
	return {
		id: tx.uuid ?? tx.id ?? index,
		initials: (desc || 'TX').slice(0, 2).toUpperCase(),
		details: desc || tx.type || 'Transaction',
		category: tx.type ?? 'Transaction',
		amount: tx.formatted_amount ?? `₦${Number(tx.amount ?? 0).toLocaleString()}`,
		status: (tx.status ?? 'Processing').charAt(0).toUpperCase() + (tx.status ?? '').slice(1),
		statusVariant: s.includes('success') || s === 'completed' ? 'success' : 'processing',
		date: tx.formatted_date ?? tx.formatted_datetime ?? tx.created_at ?? '',
		fullDate: tx.formatted_date ?? tx.formatted_datetime ?? tx.created_at ?? '',
		time: tx.formatted_datetime?.split?.(' ').pop() ?? '',
		raw: tx
	}
}

const mapWithdrawalToRow = (w, index) => {
	const s = (w.status ?? '').toLowerCase()
	const method = w.withdrawal_method ?? w.withdrawalMethod ?? {}
	const bank = method.bank_name ?? method.bankName ?? 'Bank'
	return {
		id: w.id ?? index,
		initials: (bank || 'WD').slice(0, 2).toUpperCase(),
		details: `Withdrawal to ${method.account_number_masked ?? method.account_number ?? method.accountNumber ?? '****'}`,
		category: 'Withdrawal',
		amount: `₦${Number(w.amount ?? w.net_amount ?? 0).toLocaleString()}`,
		status: (w.status ?? '').charAt(0).toUpperCase() + (w.status ?? '').slice(1),
		statusVariant: s.includes('success') || s === 'completed' ? 'success' : 'processing',
		date: w.created_at ?? '',
		fullDate: w.created_at ?? '',
		time: '',
		raw: w,
		type: 'withdrawal'
	}
}

const mapDepositToRow = (d, index) => {
	const s = (d.status ?? '').toLowerCase()
	return {
		id: d.uuid ?? d.id ?? index,
		initials: 'DP',
		details: d.description ?? 'Deposit',
		category: 'Deposit',
		amount: `₦${Number(d.amount ?? 0).toLocaleString()}`,
		status: (d.status ?? '').charAt(0).toUpperCase() + (d.status ?? '').slice(1),
		statusVariant: s.includes('success') || s === 'completed' ? 'success' : 'processing',
		date: d.created_at ?? d.completed_at ?? '',
		fullDate: d.created_at ?? d.completed_at ?? '',
		time: '',
		raw: d,
		type: 'deposit'
	}
}

const TransactionsView = ({ onClose }) => {
	const walletTx = useSelector(selectWalletTransactions)
	const withdrawalList = useSelector(selectWithdrawalTransactions)
	const depositList = useSelector(selectDepositTransactions)
	const [activeTab, setActiveTab] = useState('all')
	const [searchQuery, setSearchQuery] = useState('')
	const [filterResult, setFilterResult] = useState(null)
	const [showFilter, setShowFilter] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [selectedItem, setSelectedItem] = useState(null)
	const [selectedType, setSelectedType] = useState(null) // 'transaction' | 'withdrawal' | 'deposit'

	const hasActiveFilter =
		filterResult != null &&
		filterResult.tabKey === activeTab &&
		(filterResult.fromDate != null || filterResult.toDate != null || filterResult.status != null)

	const allTransactions = useMemo(
		() => (walletTx?.transactions ?? []).map(mapApiTransactionToRow),
		[walletTx?.transactions]
	)
	const withdrawals = useMemo(
		() => (withdrawalList ?? []).map(mapWithdrawalToRow),
		[withdrawalList]
	)
	const deposits = useMemo(
		() => (depositList ?? []).map(mapDepositToRow),
		[depositList]
	)

	const listByTab = {
		all: allTransactions,
		deposits,
		withdrawals
	}
	const items = useMemo(() => {
		let list = listByTab[activeTab] ?? []
		if (list && hasActiveFilter && filterResult) {
			const f = filterResult
			list = list.filter((item) => {
				const raw = item.raw ?? item
				const createdStr = raw.created_at ?? raw.createdAt ?? item.fullDate ?? item.date
				let dt = null
				if (createdStr) {
					dt = new Date(createdStr)
					if (isNaN(dt.getTime())) dt = null
				}
				if (f.fromDate) {
					const fromStart = new Date(f.fromDate)
					fromStart.setHours(0, 0, 0, 0)
					if (dt == null || dt < fromStart) return false
				}
				if (f.toDate) {
					const toEnd = new Date(f.toDate)
					toEnd.setHours(23, 59, 59, 999)
					if (dt == null || dt > toEnd) return false
				}
				if (f.status) {
					const itemStatus = (item.status ?? raw.status ?? '').toLowerCase()
					if (itemStatus !== f.status.toLowerCase()) return false
				}
				return true
			})
		}
		const q = searchQuery.trim().toLowerCase()
		if (q) {
			list = list.filter((i) =>
				(i.details ?? '').toLowerCase().includes(q) ||
				(i.category ?? '').toLowerCase().includes(q) ||
				(i.amount ?? '').toLowerCase().includes(q) ||
				(i.status ?? '').toLowerCase().includes(q)
			)
		}
		return list
	}, [activeTab, listByTab, searchQuery, filterResult, hasActiveFilter])

	const emptyMessages = {
		all: 'No transactions yet',
		deposits: 'No deposits yet',
		withdrawals: 'No withdrawals yet'
	}

	const loadForTab = (tab) => {
		setIsLoading(true)
		if (tab === 'all') {
			walletController.getTransactions({
				setLoading: setIsLoading,
				forceRefetch: true,
				onError: () => {}
			})
		} else if (tab === 'withdrawals') {
			walletController.getWithdrawalTransactions({
				setLoading: setIsLoading,
				onError: () => {}
			})
		} else if (tab === 'deposits') {
			walletController.getDepositTransactions({
				setLoading: setIsLoading,
				onError: () => {}
			})
		} else {
			setIsLoading(false)
		}
	}

	useEffect(() => {
		loadForTab(activeTab)
	}, [activeTab])

	const handleRefresh = () => {
		loadForTab(activeTab)
	}

	const handleItemClick = (item) => {
		setSelectedItem(item)
		setSelectedType(item?.type ?? 'transaction')
	}

	return (
		<>
			<div className='fixed inset-0 bg-black/20 z-40' onClick={onClose} />
			<div className='fixed right-0 top-0 bottom-0 w-full max-w-[560px] bg-white shadow-2xl z-50 flex flex-col'>
				<div className='p-6 border-b border-gray-200 shrink-0'>
					<div className='flex items-center justify-between mb-4'>
						<h2 className='text-[20px] font-semibold text-gray-900'>Transactions</h2>
						<button type='button' onClick={onClose} className='w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100' aria-label='Close'>
							<X className='w-5 h-5 text-gray-600' />
						</button>
					</div>

					{/* Tabs */}
					<div className='flex gap-1 p-1 rounded-lg bg-gray-100 mb-4'>
						{TABS.map((t) => (
							<button
								key={t.key}
								type='button'
								onClick={() => setActiveTab(t.key)}
								className={`flex-1 py-2 rounded-md text-[14px] font-medium transition-colors ${
									activeTab === t.key ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
								}`}
							>
								{t.label}
							</button>
						))}
					</div>

					{/* Search and filter */}
					<div className='flex gap-2'>
						<div className='relative flex-1'>
							<Search className='absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400' />
							<input
								type='search'
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								placeholder='Search transaction'
								className='w-full pl-9 pr-3 py-2 rounded-lg border border-gray-200 text-[14px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary'
							/>
						</div>
						<button
							type='button'
							onClick={handleRefresh}
							disabled={isLoading}
							className='p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-50'
							aria-label='Refresh'
						>
							<RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
						</button>
						<button
							type='button'
							onClick={() => setShowFilter(true)}
							className={`inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border text-[14px] font-medium transition-colors ${
								hasActiveFilter
									? 'border-primary bg-primary/5 text-primary'
									: 'border-gray-200 text-gray-700 hover:bg-gray-50'
							}`}
						>
							<Filter className={`w-4 h-4 ${hasActiveFilter ? 'text-primary' : ''}`} />
							Filter
							<ChevronDown className='w-4 h-4' />
						</button>
					</div>
				</div>

				<div className='flex-1 overflow-y-auto p-6'>
					{isLoading && items.length === 0 ? (
						<div className='flex justify-center py-16'><Loader /></div>
					) : items.length === 0 ? (
						<p className='text-[14px] text-gray-500 text-center py-8'>{emptyMessages[activeTab] ?? 'No data'}</p>
					) : (
						<div className='space-y-0 divide-y divide-gray-100'>
							{items.map((item) => (
								<button
									key={item.id}
									type='button'
									onClick={() => handleItemClick(item)}
									className='w-full flex items-center gap-3 py-4 text-left hover:bg-gray-50/80 transition-colors'
								>
									<div className='w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-[14px] font-semibold text-gray-700 shrink-0'>
										{item.initials}
									</div>
									<div className='flex-1 min-w-0'>
										<p className='text-[14px] font-medium text-gray-900 truncate'>{item.details}</p>
										<p className='text-[12px] text-gray-500'>{item.category} · {item.date}</p>
									</div>
									<div className='text-right shrink-0'>
										<p className='text-[14px] font-medium text-gray-900'>{item.amount}</p>
										<span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium ${item.statusVariant === 'success' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}`}>
											{item.status}
										</span>
									</div>
								</button>
							))}
						</div>
					)}
				</div>
			</div>

			{selectedItem && selectedType === 'withdrawal' && (
				<WithdrawalTransactionDetailsView
					withdrawal={selectedItem.raw}
					onClose={() => { setSelectedItem(null); setSelectedType(null) }}
					elevated
				/>
			)}
			{selectedItem && selectedType === 'deposit' && (
				<DepositTransactionDetailsView
					deposit={selectedItem.raw}
					onClose={() => { setSelectedItem(null); setSelectedType(null) }}
					elevated
				/>
			)}
			{selectedItem && selectedType === 'transaction' && (
				<TransactionDetailsView
					transaction={selectedItem}
					onClose={() => { setSelectedItem(null); setSelectedType(null) }}
					elevated
				/>
			)}

			{showFilter && (
				<FilterWalletTransactionsView
					initialTabKey={activeTab}
					initialFilter={filterResult}
					onApply={(result) => {
						const hasAny = result?.fromDate != null || result?.toDate != null || result?.status != null
						setFilterResult(hasAny ? result : null)
					}}
					onClose={() => setShowFilter(false)}
				/>
			)}
		</>
	)
}

export default TransactionsView
