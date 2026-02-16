import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropertyOwnerNavbar from '../components/property_owner_navbar'
import { Minus } from 'lucide-react'

const DEFAULT_DOCUMENTS = ['Survey plan', 'Grant of occupation', 'Deeds of assignment']

const AddForSaleDocumentsView = () => {
	const navigate = useNavigate()
	const [documents, setDocuments] = useState([...DEFAULT_DOCUMENTS])

	const handleRemove = (index) => {
		setDocuments((prev) => prev.filter((_, i) => i !== index))
	}

	const handleAdd = () => {
		setDocuments((prev) => [...prev, 'New document'])
	}

	const handleBack = () => {
		navigate(-1)
	}

	const handleSaveAndContinue = () => {
		console.log('Property documents:', documents)
		navigate('/property-owner/add-sale/bedrooms')
	}

	return (
		<>
			<PropertyOwnerNavbar />
			<div className='pt-20 pb-10 px-6 md:px-16 lg:px-20 min-h-screen flex flex-col bg-white'>
				<div className='flex-1 flex flex-col items-center justify-center max-w-3xl mx-auto w-full'>
					<div className='w-full'>
						<div className='flex items-center gap-2 mb-8'>
							<div className='h-2 flex-1 bg-primary rounded-full' />
							<div className='h-2 flex-1 bg-primary rounded-full' />
							<div className='h-2 flex-1 bg-primary rounded-full' />
							<div className='h-2 flex-1 bg-primary rounded-full' />
						</div>

						<h1 className='text-[32px] md:text-[40px] font-bold text-gray-900 mb-8'>
							Property documents
						</h1>

						<div className='space-y-3 mb-6'>
							{documents.map((label, index) => (
								<div
									key={`${label}-${index}`}
									className='flex items-center justify-between px-4 py-3 border border-gray-300 rounded-2xl bg-white'
								>
									<span className='text-[16px] text-gray-900 font-medium'>{label}</span>
									<button
										type='button'
										onClick={() => handleRemove(index)}
										className='w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors'
										aria-label='Remove document'
									>
										<Minus className='w-4 h-4 text-gray-600' />
									</button>
								</div>
							))}
						</div>

						<button
							type='button'
							onClick={handleAdd}
							className='text-[16px] font-medium text-gray-500 hover:text-gray-700 transition-colors mb-8'
						>
							Add +
						</button>

						<div className='flex gap-4 mt-12'>
							<button
								type='button'
								onClick={handleBack}
								className='flex-1 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-[18px] font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all'
							>
								Back
							</button>
							<button
								type='button'
								onClick={handleSaveAndContinue}
								className='flex-1 bg-primary text-white px-8 py-4 rounded-full text-[18px] font-semibold hover:from-purple-700 hover:to-purple-500 transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]'
							>
								Save & continue
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}

export default AddForSaleDocumentsView
