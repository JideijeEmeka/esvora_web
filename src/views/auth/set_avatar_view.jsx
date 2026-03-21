import React, { useMemo, useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { ArrowLeftIcon, CameraIcon } from 'lucide-react'
import { createAvatar } from '@dicebear/core'
import { adventurer } from '@dicebear/collection'
import ButtonWidget from '../../components/button'
import toast from 'react-hot-toast'
import AuthController from '../../controllers/auth_controller'

const AVATAR_COUNT = 12

const SEED_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789'

function randomSeed(length = 32) {
	const arr = new Uint8Array(length)
	crypto.getRandomValues(arr)
	return Array.from(arr, (n) => SEED_CHARS[n % SEED_CHARS.length]).join('')
}

function generateAvatarList() {
	const list = []
	for (let i = 0; i < AVATAR_COUNT; i++) {
		const seed = randomSeed()
		const avatar = createAvatar(adventurer, { seed })
		list.push({
			seed,
			dataUri: avatar.toDataUri(),
		})
	}
	return list
}

const SetAvatarView = () => {
	const navigate = useNavigate()
	const location = useLocation()
	const authController = new AuthController()
	const fileInputRef = useRef(null)

	const firstName = (location.state?.firstName ?? '').trim()
	const lastName = (location.state?.lastName ?? '').trim()

	const avatarList = useMemo(() => generateAvatarList(), [])

	useEffect(() => {
		const seeds = avatarList.map((a) => a.seed)
		console.log('Avatar seeds (12):', seeds)
	}, [avatarList])

	const [selectedIndex, setSelectedIndex] = useState(0)
	const [customDataUri, setCustomDataUri] = useState(null)
	const [isLoading, setIsLoading] = useState(false)

	const displayAvatar = customDataUri ?? avatarList[selectedIndex]?.dataUri ?? null

	const handleFileChange = (e) => {
		const file = e.target.files?.[0]
		if (!file || !file.type.startsWith('image/')) {
			toast.error('Please select an image file')
			return
		}
		const reader = new FileReader()
		reader.onload = () => {
			setCustomDataUri(reader.result)
		}
		reader.readAsDataURL(file)
		e.target.value = ''
	}

	const handleContinue = (e) => {
		e?.preventDefault()
		if (!firstName || !lastName) {
			toast.error('Session expired. Please complete the previous steps.')
			navigate('/update-name')
			return
		}
		const avatarStr = customDataUri
			? String(customDataUri)
			: (avatarList[selectedIndex]?.seed ?? '')
		authController.updateAccount(firstName, lastName, avatarStr || undefined, {
			setLoading: setIsLoading,
			navigate,
			onError: (message) => toast.error(message),
			onSuccess: () => toast.success('Profile updated'),
		})
	}

	return (
		<div className='w-full min-h-screen md:fixed max-md:items-center max-md:justify-start
			flex items-center justify-center px-6 lg:px-30 pt-4 pb-8 flex-col'>
			<div className='w-[400px] max-md:w-full max-md:px-7 flex items-start justify-start'>
				<button
					type="button"
					className='bg-white text-gray-700 px-3 py-1.5 text-[14px]
						mb-2 flex items-center gap-2 hover:bg-primary/80 hover:scale-105 border border-gray-300
						transition rounded-full font-semibold hover:text-white cursor-pointer'
					onClick={() => navigate(-1)}
				>
					<ArrowLeftIcon className='w-4 h-4' /> Back
				</button>
			</div>

			<h1 className='text-[24px] font-semibold max-md:px-10 w-[400px] py-4'>
				Add picture
			</h1>

			{/* Large selected avatar with camera overlay */}
			<div className='w-[400px] max-md:w-full max-md:px-10 flex justify-center mb-6'>
				<div className='relative inline-block'>
					<div className='w-32 h-32 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 shrink-0'>
						{displayAvatar ? (
							<img
								src={displayAvatar}
								alt="Profile"
								className='w-full h-full object-cover'
							/>
						) : (
							<div className='w-full h-full flex items-center justify-center text-gray-400'>
								<span className='text-4xl'>?</span>
							</div>
						)}
					</div>
					<button
						type="button"
						className='absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white shadow cursor-pointer hover:bg-primary/90 transition'
						onClick={() => fileInputRef.current?.click()}
						aria-label="Upload photo"
					>
						<CameraIcon className='w-5 h-5' />
					</button>
					<input
						ref={fileInputRef}
						type="file"
						accept="image/*"
						className='hidden'
						onChange={handleFileChange}
					/>
				</div>
			</div>

			{/* Avatar grid */}
			<div className='w-[400px] max-md:w-full max-md:px-10 flex flex-wrap justify-center gap-3 mb-6'>
				{avatarList.map((item, index) => (
					<button
						key={item.seed}
						type="button"
						onClick={() => {
							setSelectedIndex(index)
							setCustomDataUri(null)
						}}
						className={`w-14 h-14 rounded-full overflow-hidden border-2 bg-gray-100 shrink-0 transition ${
							selectedIndex === index && !customDataUri
								? 'border-primary ring-2 ring-primary/30'
								: 'border-gray-200 hover:border-gray-300'
						}`}
					>
						<img
							src={item.dataUri}
							alt={`Avatar ${index + 1}`}
							className='w-full h-full object-cover'
						/>
					</button>
				))}
			</div>

			<ButtonWidget
				text="Continue"
				onClick={handleContinue}
				loading={isLoading}
				disabled={isLoading}
			/>

			<p className='text-[16px] text-gray-400 w-[400px] mt-4 font-extralight max-md:px-10 max-md:w-full text-center'>
				By continuing, you agree to Esvora's{' '}
				<Link to="/terms" className='text-primary font-light text-[16px] hover:underline'>
					Terms of Service
				</Link>{' '}
				and{' '}
				<Link to="/privacy" className='text-primary font-light text-[16px] hover:underline'>
					Privacy Policy
				</Link>
			</p>
		</div>
	)
}

export default SetAvatarView
