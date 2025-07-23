import { useEffect } from 'react';

type FilterSearchProps = {
	propertyName: string;
	list: any[];
	setFilteredCallback: any;
	setSearchedValue: any;
	searchedValue?: string;
};

/**
 * FilterSearch component.
 * @param {object} props - The component props.
 * @param {string} props.propertyName - The name of the property to filter on.
 * @param {Array} props.list - The list to filter.
 * @param {Function} props.setFilteredCallback - The callback function to set the filtered rows.
 * @param {Function} props.setSearchedValue - The callback function to set the searched value.
 * @param {string} props.searchedValue - The current searched value.
 * @returns {JSX.Element} The FilterSearch component.
 */
export default function FilterSearch({ propertyName, list, setFilteredCallback, setSearchedValue, searchedValue }: FilterSearchProps) {
	const requestSearch = (searchedVal: string) => {
		let filteredRows: any = [];
		filteredRows = searchedVal
			? list.filter((key) => {
					if (typeof key === 'string') {
						return key.toLocaleLowerCase().includes(searchedVal.toLowerCase());
					}
					return key[propertyName].toLowerCase().includes(searchedVal.toLowerCase());
			  })
			: list;
		setFilteredCallback(filteredRows);
		setSearchedValue(searchedVal);
	};

	useEffect(() => {
		if (searchedValue) {
			requestSearch(searchedValue);
		}
	}, [list]);

	return (
		<input
			id="filter-search"
			className="ml-2 pb-1 rounded-md border-secondaryTextColor"
			aria-label="filter-search"
			placeholder="Search list"
			type="search"
			onChange={(e) => requestSearch(e.target.value)}
		/>
	);
}
