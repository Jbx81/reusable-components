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
 * @property {(option: string) => void} [setSelectedOption] - Optional callback function to update the selected option to the parent component state.
 * @property {(input: string) => void} [setInputSearch] - Optional callback function to update the input used for searching to the parent component state.
 * @property {boolean} [error] - Indicates whether there is an error with the validation.
 * @property {string} [errorText] - Information for the user due to validation error.
 */
export interface SingleSelectProps {
	label: string;
	customLabelClass?: string;
	customSelectClass?: string;
	disabled?: boolean;
	defaultSelection?: any | null;
	options: any[];
	value?: string;
	setSelectedOption?: (option: any) => void;
	setInputSearch?: (input: string) => void;
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
	options,
	setSelectedOption,
	setInputSearch,
	error,
	errorText,
}: SingleSelectProps) => {
	const [inputValue, setInputValue] = React.useState('');
	const [optionList, setOptionList] = React.useState<typeof options>(options);
	const [open, setOpen] = React.useState(false);

	/**
	 * This is a custom click handler that is invoked when the selects an option.
	 * It sets the option name as the input value and then passes the option to the parent component.
	 * @param {(typeof options)[0]} [option] - Selected option.
	 */
	function selectHandler(option: (typeof options)[0]) {
		setInputValue(option.name);
		setOpen(false);
		if (setSelectedOption) {
			setSelectedOption(option);
		}
	}

	const filterOptions = () => {
		let filteredOptions: any = [];
		filteredOptions = inputValue ? options!.filter((item) => item.name.toLowerCase().includes(inputValue.toLowerCase())) : options;
		if (defaultSelection) {
			const defaultFilteredOptions = filteredOptions.filter((team) => team.id !== defaultSelection.id);
			setOptionList(defaultFilteredOptions);
		} else {
			setOptionList(filteredOptions);
		}
	};
	/**
	 * This is a standard change handler that is invoked when the user types in the input.
	 * It will also invoke the filterOptions() function to display a filtered list of options based
	 * on the input.
	 * @param {React.ChangeEvent<HTMLInputElement>} [event] - On Change event passed to change handler.
	 */
	function inputHandler(event: React.ChangeEvent<HTMLInputElement>) {
		setInputValue(event.target.value);
		if (setInputSearch) {
			setInputSearch(event.target.value);
		}

		filterOptions();
	}

	React.useEffect(() => {
		if (!inputValue) {
			filterOptions();
		}
	}, [inputValue]);

	return (
		<form className="mx-auto w-full">
			<label
				htmlFor={injectHyphenLowerCase(label)}
				className={`${customLabelClass} bg-defaultBackground mx-2 px-2 mb-2 text-sm font-normal ${error ? 'text-errorColor' : 'text-secondaryTextColor'}`}
			>
				{label}
			</label>
			<input
				id={injectHyphenLowerCase(label)}
				type="search"
				aria-label={label}
				value={inputValue}
				onChange={inputHandler}
				onClick={() => selectHandler}
				onBlur={() => setOpen(false)}
				onFocus={() => setOpen(true)}
				disabled={disabled}
				className={`${customSelectClass} bg-gray-50 dark:bg-gray-500 border hover:border-primaryColor ${
					error
						? 'border-errorColor text-errorColor focus:ring-errorColor focus:border-errorColor'
						: 'border-inputBorderColor text-primaryTextColor focus:ring-blue-500 focus:border-blue-500'
				}text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-400`}
			/>

			<div className="relative bg-defaultBackground">
				<ul className="h-full overflow-auto" aria-label="option">
					{open && optionList.length > 0 ? (
						<div className="absolute top-0 z-10 w-full border bg-defaultBackground border-black shadow-lg animate-in">
							<div className="h-full overflow-auto">
								{optionList.map((option) => (
									<li
										data-testid="option"
										key={option.id}
										onMouseDown={(e) => {
											e.preventDefault();
											e.stopPropagation();
										}}
										onClick={() => selectHandler(option)}
										className={'p-2 text-base cursor-pointer hover:bg-selectOptionHover hover:text-white'}
									>
										{option.name}
									</li>
								))}
							</div>
						</div>
					) : null}
				</ul>
			</div>

			{error && <p className="mt-1 ml-2 text-xs text-errorColor">{errorText}</p>}
		</form>
	);
};

export default SingleSelect;
