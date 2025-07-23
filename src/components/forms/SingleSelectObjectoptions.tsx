import React from 'react';

/**
 * Props for the Select component.
 * @interface SingleSelectProps
 * @property {string} label - The label for the select.
 * @property {string} [customLabelClass] - Optional custom Tailwind CSS class for the label.
 * @property {string} [customSelectClass] - Optional custom Tailwind CSS class for the select.
 * @property {boolean} [disabled] - Indicates whether the select component is disabled.
 * @property {{ id: string; name: string } | null} [defaultSelection] - Optional prop to pass as default option pre-selected.
 * @property {{id: string, name: string}[]} [options] - list of options to select.
 * @property {string} [value] - The current value selected.
 * @property {(option: string) => void} [setSelectedOption] - Callback function to update the selected option to the parent component state.
 * @property {boolean} [error] - Indicates whether there is an error with the validation.
 * @property {string} [errorText] - Information for the user due to validation error.
 */
interface SingleSelectProps {
	label: string;
	customLabelClass?: string;
	customSelectClass?: string;
	disabled?: boolean;
	defaultSelection?: any | null;
	options: any[];
	value?: string;
	setSelectedOption?: (option: any) => void;
	error?: boolean;
	errorText?: string;
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
	customLabelClass = '',
	customSelectClass = '',
	disabled = false,
	defaultSelection,
	value,
	options,
	setSelectedOption,
	error,
	errorText,
}: SingleSelectProps) => {
	/**
	 * This is a custom select handler that is invoked when the selects an option.
	 * It grabs the id from the event that is passed, finds the selected object by id from the list of options,
	 * then passes the option to the parent component.
	 * @param {React.ChangeEvent<HTMLSelectElement>} [event] - On Change event passed to change handler.
	 */
	function handler(event: React.ChangeEvent<HTMLSelectElement>) {
		const selectedId = event.target.value;
		const selectedObj = options.find((o) => o.id === selectedId);
		if (setSelectedOption) {
			setSelectedOption(selectedObj);
		}
	}

	const optionList = defaultSelection ? options.filter((team) => team.id !== defaultSelection.id) : options;
	return (
		<form className="mx-auto w-full">
			{label ? (
				<label
					htmlFor={injectHyphenLowerCase(label)}
					className={`${customLabelClass} bg-defaultBackground mx-2 px-2 mb-2 text-sm font-normal ${error ? 'text-errorColor' : 'text-secondaryTextColor'}`}
				>
					{label}
				</label>
			) : null}
			<select
				id={injectHyphenLowerCase(label)}
				aria-label={label}
				disabled={disabled}
				className={`${customSelectClass} bg-gray-50 dark:bg-gray-500 border hover:border-primaryColor ${
					error
						? 'border-errorColor text-errorColor focus:ring-errorColor focus:border-errorColor'
						: 'border-inputBorderColor text-primaryTextColor focus:ring-blue-500 focus:border-blue-500'
				}text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400`}
				onChange={handler}
				value={value}
			>
				{defaultSelection && <option value={defaultSelection.id}>{defaultSelection.name}</option>}
				{!defaultSelection && <option value=""></option>}
				{optionList.map((option) => (
					<option key={option.id} value={option.id}>
						{option.name}
					</option>
				))}
			</select>
			{error && <p className="mt-1 ml-2 text-xs text-errorColor">{errorText}</p>}
		</form>
	);
};

export default SingleSelect;
