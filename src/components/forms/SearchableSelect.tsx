import { useState, useEffect, useRef } from 'react';

interface Option {
	label: string;
	filterKey: string;
}

interface SearchableSelectProps {
	label: string;
	options: Option[];
	filterKey?: string;
	setSelectedOption?: (value: string) => void;
	value?: string;
	readOnly?: boolean;
	onValidate?: (value: string) => void;
}

const SearchableSelect = ({ label, options, filterKey, setSelectedOption, value, readOnly = false, onValidate }: SearchableSelectProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [selectedOption, setSelectedOptionState] = useState(value || '');
	const [filteredOptions, setFilteredOptions] = useState<string[]>([]);
	const [searchTerm, setSearchTerm] = useState('');
	const selectRef = useRef<HTMLDivElement>(null);
	const [currentFilterKey, setCurrentFilterKey] = useState(filterKey || '');

	useEffect(() => {
		if (value) {
			setSelectedOptionState(value);
		}
		if (filterKey) {
			setCurrentFilterKey(filterKey);
		}
	}, [value, filterKey]);

	useEffect(() => {
		if (filterKey) {
			setCurrentFilterKey(filterKey);
			if (filterKey !== currentFilterKey && currentFilterKey !== '') {
				setSelectedOptionState('');
			}
			setSearchTerm('');
			const optionsForKey = options.filter((item) => item.filterKey === filterKey).map((item) => item.label);
			setFilteredOptions(optionsForKey);
		} else {
			setFilteredOptions([]);
		}
	}, [filterKey, options]);

	useEffect(() => {
		if (selectedOption) {
			if (onValidate) {
				onValidate(selectedOption);
			}
		}
	}, [selectedOption]);

	const handleOptionClick = (option: string) => {
		setSelectedOptionState(option);
		if (!readOnly && setSelectedOption) {
			setSelectedOption(option);
			setIsOpen(false);
		}
	};

	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchTerm(event.target.value);
	};

	const filteredAndSearchedOptions = filteredOptions.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<div className="relative w-full" ref={selectRef}>
			<label htmlFor={label.split(' ').join('-').toLowerCase()} className="bg-defaultBackground mb-2 text-sm font-normal text-secondaryTextColor">
				{label}
			</label>
			<div
				className={`p-2.5 bg-paperBackground border hover:border-primaryColor border-inputBorderColor text-primaryTextColor rounded-lg focus:ring-blue-500 focus:border-blue-500 ${
					readOnly ? 'cursor-default' : 'cursor-pointer'
				}`}
				onClick={() => !readOnly && setIsOpen(!isOpen)}
			>
				<div className="whitespace-pre-line bg-paperBackground">{selectedOption || 'Select an option'}</div>
			</div>
			{isOpen && !readOnly && (
				<div className="absolute z-10 bg-defaultBackground border border-gray-300 rounded-lg shadow-lg w-full mt-1">
					<input type="text" placeholder="Search..." value={searchTerm} onChange={handleSearchChange} className="p-2 border-b border-gray-300 w-full" />
					{filteredAndSearchedOptions.length > 0 ? (
						filteredAndSearchedOptions.map((option, index) => (
							<div key={index} onClick={() => handleOptionClick(option)}>
								<div className="p-2 hover:bg-buttonBgHover cursor-pointer bg-paperBackground rounded-lg">{option}</div>
							</div>
						))
					) : (
						<div className="p-2 text-gray-500">No options available</div>
					)}
				</div>
			)}
		</div>
	);
};

export default SearchableSelect;
