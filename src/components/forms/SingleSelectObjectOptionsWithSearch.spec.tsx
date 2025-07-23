import { screen, render, logRoles } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SingleSelectObjectOptionsWithSearch, { SingleSelectProps } from './SingleSelectObjectOptionsWithSearch';

const testOptions = [
	{ id: 'testOptionIdOne', name: 'testOptionNameOne' },
	{ id: 'testOptionIdTwo', name: 'testOptionNameTwo' },
];
const testProps: SingleSelectProps = {
	label: 'test label',
	options: testOptions,
};

describe('Single Select with search using object options', () => {
	it('should render a form with a search input', () => {
		// Arrange

		// Act
		const { container } = render(<SingleSelectObjectOptionsWithSearch label={testProps.label} options={testProps.options} />);
		logRoles(container);
		const searchInput = screen.getByRole('searchbox');

		// Assert
		expect(searchInput).toBeInTheDocument();
	});

	it('should filter the selectable options based on the search input', async () => {
		// Arrange
		const user = userEvent.setup();

		// Act
		render(<SingleSelectObjectOptionsWithSearch label={testProps.label} options={testProps.options} />);

		const searchInput = screen.getByRole('searchbox');
		user.click(searchInput);
		await user.type(searchInput, 'two');
		const options = await screen.getAllByTestId('option');
		const secondOption = options[0];

		// Assert
		expect(options).toHaveLength(1);
		expect(secondOption).toHaveTextContent('testOptionNameTwo');
	});
});
