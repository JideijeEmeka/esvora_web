
export const validatePassword = (password) => {
	return {
		hasMoreThan6Chars: password.length > 6,
		hasLetter: /[a-zA-Z]/.test(password),
		hasNumber: /[0-9]/.test(password),
		hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
	}
}
