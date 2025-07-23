import React from 'react';

/**
 * Props for the Select component.
 * @interface SingleSelectProps
 * @property {string} [label] - The label for the select.
 * @property {boolean} [blankFirstOption] - Optional property to display a blank first option.
 * @property {string} [customLabelClass] - Optional custom Tailwind CSS class for the label.
 * @property {string} [customSelectClass] - Optional custom Tailwind CSS class for the select.
 * @property {boolean} [disabled] - Indicates whether the select component is disabled.
 * @property {string[]} [options] - list of options to select.
 * @property {string} [value] - The current value selected.
 * @property {(option: string) => void} [setSelectedOption] - Callback function to update the selected option using parent component state.
 */
interface SingleSelectProps {
	label: string;
	blankFirstOption?: boolean;
	customLabelClass?: string;
	customSelectClass?: string;
	disabled?: boolean;
	defaultSelection?: string;
	options: string[];
	value?: string;
	setSelectedOption?: (e: React.FormEvent<HTMLSelectElement>) => void;
}

const injectHyphenLowerCase = (string: string) => string.split(' ').join('-').toLowerCase();

/**
 * A reusable Single Select component that renders a labeled single select.
 * @component
 * @param {SingleSelectProps} props - The props for the single select component.
 * @returns {JSX.Element} The rendered single select component.
 */
const SingleSelect = ({
	label,
	blankFirstOption = true,
	customLabelClass = '',
	customSelectClass = '',
	disabled = false,
	value,
	defaultSelection = '',
	options,
	setSelectedOption,
}: SingleSelectProps) => {
	/**
	 * This is a standard change handler that is invoked when the user selects an option.
	 * @param {React.FormEvent<HTMLInputElement>} [e] - On Change event passed to change handler.
	 */
	function handler(e: React.FormEvent<HTMLSelectElement>) {
		if (setSelectedOption) {
			setSelectedOption(e);
		}
	}
	return (
		<form className="mx-auto w-full">
			<label
				htmlFor={injectHyphenLowerCase(label)}
				className={`${customLabelClass} bg-defaultBackground mx-2 px-2 mb-2 text-sm font-normal text-secondaryTextColor`}
			>
				{label}
			</label>
			<select
				id={injectHyphenLowerCase(label)}
				disabled={disabled}
				className={`${customSelectClass} bg-gray-50 dark:bg-gray-500 border hover:border-primaryColor border-inputBorderColor text-primaryTextColor text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:placeholder-gray-400 dark:focus:border-blue-500`}
				onChange={handler}
				value={value}
			>
				{defaultSelection && options.indexOf(defaultSelection) === -1 ? <option value={defaultSelection.toLowerCase()}>{defaultSelection}</option> : false}
				{blankFirstOption && <option value=""></option>}
				{options.map((option) => (
					<option key={option} value={option.toLowerCase()}>
						{option}
					</option>
				))}
			</select>
		</form>
	);
};

export default SingleSelect;
