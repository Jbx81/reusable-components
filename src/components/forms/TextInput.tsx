import React from 'react';

/**
 * Props for the TextInput component.
 * @interface TextInputProps
 * @property {string} [type] - The type for the input field.
 * @property {string} [label] - The label for the input field.
 * @property {string} [placeholder] - Optional placeholder text.
 * @property {string} [customLabelClass] - Optional custom Tailwind CSS class for the label.
 * @property {string} [customInputClass] - Optional custom Tailwind CSS class for the input.
 * @property {boolean} [disabled] - Indicates whether the input is disabled.
 * @property {boolean} [readOnly] - Indicates whether the input is read-only.
 * @property {string} [value] - The current value of the input.
 * @property {boolean} [error] - Indicates whether there is an error with the validation.
 * @property {string} [helperText] - Information for the user.
 * @property {string} [errorText] - Information for the user due to validation error.
 * @property {(input: string) => void} [setInputValue] - Callback function to update the input value using parent component state.
 */
interface TextInputProps {
	type?: 'text' | 'email' | 'password' | 'tel' | 'url';
	label?: string;
	placeholder?: string;
	customLabelClass?: string;
	customInputClass?: string;
	disabled?: boolean;
	readOnly?: boolean;
	value: string;
	error?: boolean;
	helperText?: string;
	errorText?: string;
	setInputValue?: (input: string) => void;
	ariaLabel?: string;
}

const injectHyphenLowerCase = (string: string) => string.split(' ').join('-').toLowerCase();

/**
 * A reusable TextInput component that renders a labeled input field that can be read-only, disabled or receive inputs.
 * @component
 * @param {TextInputProps} props - The props for the TextInput component.
 * @returns {JSX.Element} The rendered TextInput component.
 */
const TextInput = ({
	type = 'text',
	label,
	placeholder = '',
	ariaLabel,
	customLabelClass = '',
	customInputClass = '',
	disabled = false,
	readOnly = false,
	value,
	setInputValue,
	error,
	helperText,
	errorText,
}: TextInputProps) => {
	/**
	 * This is a standard change handler that is invoked when the user types in the input.
	 * @param {React.ChangeEvent<HTMLInputElement>} [e] - On Change event passed to change handler.
	 */
	function handler(e: React.ChangeEvent<HTMLInputElement>) {
		if (setInputValue) {
			setInputValue(e.target.value);
		}
	}
	return (
		<div className="mx-auto w-full">
			{label && (
				<label
					htmlFor={injectHyphenLowerCase(label)}
					className={`bg-defaultBackground mx-2 px-2 mb-2 text-sm font-normal ${error ? 'text-errorColor' : 'text-secondaryTextColor'} ${customLabelClass}`}
				>
					{label}
				</label>
			)}
			<input
				type={type}
				id={label ? injectHyphenLowerCase(label) : injectHyphenLowerCase(value)}
				aria-label={ariaLabel ?? label}
				placeholder={placeholder}
				disabled={disabled}
				readOnly={readOnly}
				className={`${customInputClass} bg-gray-50 dark:bg-gray-500 border hover:border-primaryColor ${
					error
						? 'border-errorColor text-errorColor focus:ring-errorColor focus:border-errorColor'
						: 'border-inputBorderColor text-primaryTextColor focus:ring-blue-500 focus:border-blue-500'
				} text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full p-2.5  dark:placeholder-gray-400`}
				onChange={handler}
				value={value}
			/>
			{helperText && <p className="mt-1 ml-2 text-xs text-secondaryTextColor">{helperText}</p>}
			{error && <p className="mt-1 ml-2 text-xs text-errorColor">{errorText}</p>}
		</div>
	);
};

export default TextInput;
