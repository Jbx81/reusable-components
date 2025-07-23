/*eslint-disable */
import * as React from 'react';

type Options = { id: string; name: string };

/**
 * Props for the MultiSelect component.
 * @interface MultiSelectProps
 * @property {string} label - The label for the select.
 * @property {string} placeholder - The placeholder text in the input field.
 * @property {string} [customLabelClass] - Optional custom Tailwind CSS class for the label.
 * @property {string} [customSelectClass] - Optional custom Tailwind CSS class for the select.
 * @property {{ id: string; name: string }[] | null} [defaultSelection] - Optional prop to pass as default pre-selected choices.
 * @property {{id: string, name: string}[]} [options] - list of options to select.
 * @property {(option: string) => void} [setSelectedOption] - Callback function to update the selected option to the parent component state.
 * @property {boolean} [error] - Indicates whether there is an error with the validation.
 * @property {string} [errorText] - Information for the user due to validation error.
 */
interface MultiSelectProps {
	label: string;
	placeholder: string;
	customLabelClass?: string;
	customSelectClass?: string;
	defaultSelection?: Options[] | null;
	options: Options[];
	setSelectedOption: (options: Options[]) => void;
	error?: boolean;
	errorText?: string;
}

const injectHyphenLowerCase = (string: string) => string.split(' ').join('-').toLowerCase();

/**
 * A reusable Multi Select component that renders a labeled multi select.
 * @component
 * @param {MultiSelectProps} [props] - The props for the multi select component.
 * @returns {JSX.Element} The rendered multi select component.
 */
function MultiSelect({
	label,
	placeholder,
	customLabelClass = '',
	customSelectClass = '',
	defaultSelection,
	options,
	setSelectedOption,
	error = false,
	errorText = '',
}: MultiSelectProps) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [open, setOpen] = React.useState(false);
	const [selected, setSelected] = React.useState<Options[]>(defaultSelection || []);
	const [inputValue, setInputValue] = React.useState('');
	const [selectables, setSelectables] = React.useState<Options[]>(options ?? []);

	/**
	 * Filters the available options based on the current input value and selected items.
	 *
	 * This function updates the state of selectable options by removing any options that
	 * are already selected and filtering the remaining options based on the input value.
	 * If there is no input value, it simply returns the options that are not selected.
	 * @function
	 * @returns {void} This function does not return a value. It updates the state of selectable options.
	 * @example
	 * // Assuming inputValue is 'react' and options contains a list of framework options
	 * filterSelectables();
	 * // This will filter out selected frameworks and return those that include 'react' in their name.
	 */
	const filterSelectables = () => {
		const filteredRows = options.filter(
			(option) => !selected.some((sel) => sel.id === option.id) && (inputValue ? option.name.toLowerCase().includes(inputValue.toLowerCase()) : true)
		);

		setSelectables(filteredRows);
	};

	const handleUnselect = React.useCallback((option: Options) => {
		setSelected((prev) => prev.filter((s) => s.id !== option.id));
		filterSelectables();
	}, []);

	const handleKeyDown = React.useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
		const input = inputRef.current;
		if (input) {
			if (e.key === 'Escape') {
				input.blur();
			}
		}
	}, []);

	/**
	 *
	 * @param option
	 */
	function handler(option: Options) {
		setInputValue('');
		setSelected((prev) => [...prev, option]);
	}

	React.useEffect(() => {
		setSelectedOption(selected);
		filterSelectables();
	}, [selected]);

	React.useEffect(() => {
		if (defaultSelection && !selected.length) {
			setSelected(defaultSelection);
		}
	}, [defaultSelection]);

	React.useEffect(() => filterSelectables(), [inputValue]);

	return (
		<form className="mx-auto w-full pt-2">
			{label ? (
				<label
					htmlFor={injectHyphenLowerCase(label)}
					aria-label={injectHyphenLowerCase(label)}
					className={`${customLabelClass} bg-defaultBackground mx-2 px-2 my-4 text-sm font-normal ${error ? 'text-errorColor' : 'text-secondaryTextColor'}`}
				>
					{label}
				</label>
			) : null}
			<div onKeyDown={handleKeyDown} aria-label={label} id={injectHyphenLowerCase(label)} className="group rounded-md text-sm ">
				<div
					className={`flex flex-wrap gap-1 mb-1 border-t border-l border-r rounded-lg ${
						error
							? 'border-errorColor text-errorColor focus:ring-errorColor focus:border-errorColor'
							: 'border-inputBorderColor text-secondaryTextColor focus:ring-blue-500 focus:border-blue-500'
					}`}
				>
					{selected.map((option) => (
						<div key={option.id} className="bg-buttonBg ml-2 px-2 mt-2 rounded-lg py-1 h-8 text-white">
							{option.name}
							<button
								className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										handleUnselect(option);
									}
								}}
								onMouseDown={(e) => {
									e.preventDefault();
									e.stopPropagation();
									filterSelectables();
								}}
								onClick={() => handleUnselect(option)}
							>
								<p className="h-3 w-3 text-muted-foreground hover:text-primaryTextColor">X</p>
							</button>
						</div>
					))}

					<input
						type="search"
						ref={inputRef}
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onClick={filterSelectables}
						onBlur={() => setOpen(false)}
						onFocus={() => setOpen(true)}
						placeholder={selected.length ? '' : placeholder}
						className={`${customSelectClass} italic bg-gray-50 dark:bg-gray-500 border hover:border-primaryColor ${
							error
								? 'border-errorColor text-errorColor focus:ring-errorColor focus:border-errorColor'
								: 'border-inputBorderColor text-secondaryTextColor focus:ring-blue-500 focus:border-blue-500'
						}text-sm rounded-lg block w-full p-2.5 dark:placeholder-gray-950`}
					/>
				</div>

				<div className="relative bg-defaultBackground">
					<ul className="h-full overflow-auto" data-testid={injectHyphenLowerCase(label)}>
						{open && selectables.length > 0 ? (
							<div className="absolute top-0 z-10 w-full border bg-defaultBackground border-black shadow-lg animate-in">
								<div className="h-full overflow-auto">
									{selectables.map((option) => (
										<li
											key={option.id}
											onMouseDown={(e) => {
												e.preventDefault();
												e.stopPropagation();
											}}
											onClick={() => handler(option)}
											onSelect={filterSelectables}
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
			</div>
			{error && <p className="mt-1 ml-2 text-xs text-errorColor">{errorText}</p>}
		</form>
	);
}
export default MultiSelect;
