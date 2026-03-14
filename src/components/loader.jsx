import React from 'react'
import { ClipLoader } from 'react-spinners'

const PRIMARY_COLOR = '#680093'

function Loader({
	color = PRIMARY_COLOR,
	size = 40,
	speedMultiplier = 1,
	loading = true,
	cssOverride = {},
	className = '',
	...rest
}) {
	if (!loading) return null

	return (
		<div
			className={`inline-flex items-center justify-center ${className}`.trim()}
			role="status"
			aria-label="Loading"
		>
			<ClipLoader
				color={color}
				size={size}
				speedMultiplier={speedMultiplier}
				loading={loading}
				cssOverride={cssOverride}
				{...rest}
			/>
		</div>
	)
}

export default Loader
