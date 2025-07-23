const Button = ({ disabled = false, onClick, children, customStyle }) => (
	<button
		type="button"
		className={`flex justify-center px-4 py-1.5 rounded text-sm font-normal ${
			disabled ? 'text-gray-600 bg-disabledColor disabled:text-gray-600 disabled:bg-disabledColor disabled:pointer-events-none' : 'text-buttonTextColor'
		} ${customStyle}`}
		disabled={disabled}
		onClick={onClick}
	>
		{children}
	</button>
);

export default Button;
