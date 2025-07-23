import { render, screen, fireEvent } from '@testing-library/react';

import SearchableSelect from './SearchableSelect';

const mockOptions = [
	{ label: 'Option 1', filterKey: 'Group 1' },
	{ label: 'Option 2', filterKey: 'Group 1' },
	{ label: 'Option 3', filterKey: 'Group 2' },
];

describe('SearchableSelect Component', () => {
	test('renders with label and default option', () => {
		render(<SearchableSelect label="Test Select" options={mockOptions} />);

		expect(screen.getByText('Test Select')).toBeInTheDocument();
		expect(screen.getByText('Select an option')).toBeInTheDocument();
	});

	test('opens dropdown on click', () => {
		render(<SearchableSelect label="Test Select" options={mockOptions} />);

		fireEvent.click(screen.getByText('Select an option'));
		expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
	});

	test('displays filtered options based on search input', () => {
		render(<SearchableSelect label="Test Select" options={mockOptions} value="Option 1" filterKey="Group 1" />);

		fireEvent.click(screen.getByText('Option 1'));

		fireEvent.change(screen.getByPlaceholderText('Search...'), {
			target: { value: 'Option 2' },
		});

		expect(screen.getByText('Option 2')).toBeInTheDocument();
		expect(screen.queryByText('Option 3')).not.toBeInTheDocument();
	});

	test('does not allow selection when readOnly is true', () => {
		render(<SearchableSelect label="Test Select" options={mockOptions} readOnly />);

		fireEvent.click(screen.getByText('Select an option'));
		expect(screen.queryByPlaceholderText('Search...')).not.toBeInTheDocument();
	});
});
