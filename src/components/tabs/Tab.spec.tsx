import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';

import { Tabs, Tab, defaultTabOptions } from './Tab'; // Adjust the import path as necessary

// Mock RouterLink component
jest.mock('../RouterLink');

describe('Tabs Component', () => {
	test('renders a single tab and displays its content', () => {
		render(
			<Tabs index={0}>
				<Tab label="Tab 1" taboptions={defaultTabOptions} index={0}>
					<div>Content for Tab 1</div>
				</Tab>
			</Tabs>
		);

		// Check if the tab button is rendered
		expect(screen.getByText('Tab 1')).toBeInTheDocument();
		// Check if the content is displayed
		expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
	});

	test('switches between tabs and displays the correct content', () => {
		render(
			<Tabs index={0}>
				<Tab label="Tab 1" taboptions={defaultTabOptions} index={0}>
					<div>Content for Tab 1</div>
				</Tab>
				<Tab label="Tab 2" taboptions={defaultTabOptions} index={1}>
					<div>Content for Tab 2</div>
				</Tab>
			</Tabs>
		);

		// Initially, Tab 1 content should be visible
		expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
		expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();

		// Click on Tab 2
		fireEvent.click(screen.getByText('Tab 2'));

		// Now, Tab 2 content should be visible
		expect(screen.getByText('Content for Tab 2')).toBeInTheDocument();
		expect(screen.queryByText('Content for Tab 1')).not.toBeInTheDocument();
	});

	test('disables a tab and prevents switching', () => {
		render(
			<Tabs index={0}>
				<Tab label="Tab 1" taboptions={defaultTabOptions} index={0}>
					<div>Content for Tab 1</div>
				</Tab>
				<Tab label="Tab 2" taboptions={{ ...defaultTabOptions, disabled: 'true' }} index={1}>
					<div>Content for Tab 2</div>
				</Tab>
			</Tabs>
		);

		// Initially, Tab 1 content should be visible
		expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();

		// Click on Tab 2 (which is disabled)
		fireEvent.click(screen.getByText('Tab 2'));

		// Content for Tab 1 should still be visible
		expect(screen.getByText('Content for Tab 1')).toBeInTheDocument();
		expect(screen.queryByText('Content for Tab 2')).not.toBeInTheDocument();
	});

	test('renders tooltip when message is provided', () => {
		render(
			<Tabs index={0}>
				<Tab label="Tab 1" taboptions={{ message: 'This is a tooltip', disabled: '' }} index={0}>
					<div>Content for Tab 1</div>
				</Tab>
			</Tabs>
		);

		// Check if the tooltip is rendered
		const tabButton = screen.getByText('Tab 1');
		expect(tabButton).toBeInTheDocument();

		// Simulate mouse over to show tooltip
		fireEvent.mouseOver(tabButton);

		// Check if the tooltip content is displayed
		expect(screen.getByText('This is a tooltip')).toBeInTheDocument();
	});
});
