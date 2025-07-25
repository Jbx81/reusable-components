import { Tooltip } from 'flowbite-react';
import { useState, type JSX } from 'react';

import RouterLink from '../links/RouterLink';
import React from 'react';

export const Tabs = ({ children, index }: { children: JSX.Element | JSX.Element[]; index: number }) => {
	const [activeTab, setActiveTab] = useState(index > 0 ? index : 0);

	const handleClick = (e: React.MouseEvent<HTMLButtonElement>, newActiveTab: number): void => {
		e.preventDefault();
		setActiveTab(newActiveTab);
	};

	/**
	 * Renders a tab button with optional tooltip functionality.
	 *
	 * This function creates a button element for a tab, which can be either a simple button or a button with a tooltip
	 * if a message is provided in the tab options. The button's appearance and behavior are determined by the
	 * properties of the `child` component passed to this function.
	 * @param {object} child - The child component containing properties for the tab button.
	 * @param {object} child.props - The properties of the child component.
	 * @param {string} child.props.label - The label to be displayed on the button.
	 * @param {object} child.props.taboptions - Options for the tab button.
	 * @param {string} child.props.taboptions.message - Optional message to be displayed in a tooltip.
	 * @param {string} child.props.taboptions.disabled - Indicates if the button should be disabled ('true' or 'false').
	 * @param {string} [child.props.link] - Optional link to be used if the button should act as a link.
	 * @param {number} child.props.index - The index of the tab, used for identifying the active tab.
	 * @returns {JSX.Element} button - A button element wrapped in a tooltip if a message is provided, otherwise just the button.
	 * @example
	 * const tabButton = renderTabButton({
	 *     props: {
	 *         label: 'Home',
	 *         taboptions: {
	 *             message: 'Go to home page',
	 *             disabled: 'false'
	 *         },
	 *         index: 0,
	 *         link: '/home'
	 *     }
	 * });
	 */
	interface TabOptions {
		message?: string;
		disabled: 'true' | 'false';
	}

	interface TabChildProps {
		label: string;
		taboptions: TabOptions;
		link?: string;
		index: number;
		children?: JSX.Element | JSX.Element[]; // Add children property
	}

	interface TabChild {
		props: TabChildProps;
	}

	function renderTabButton(child: TabChild): JSX.Element {
		const { message } = child.props.taboptions;

		const button = (
			<button
				key={child.props.label}
				disabled={child.props.taboptions.disabled === 'true'}
				className={`${
					activeTab === child.props.index ? 'border-b-2 border-primaryColor text-primaryColor' : 'text-primaryTextColor'
				} flex-4 px-5 py-3 font-medium ${child.props.taboptions.disabled === 'true' ? '' : 'active:bg-buttonBgHover'} ease-in-out active:rounded-md`}
				onClick={(e) => handleClick(e, child.props.index)}
			>
				{child.props.link ? <RouterLink linkTo={child.props.link}>{child.props.label}</RouterLink> : child.props.label}
			</button>
		);

		if (!message) {
			return button as JSX.Element;
		}

		return (
			<Tooltip
				content={child.props.taboptions.message ? child.props.taboptions.message : ''}
				placement={'right'}
				className="bg-gray-600 text-buttonTextColor text-center rounded shadow-lg p-1"
				arrow={false}
			>
				{button}
			</Tooltip>
		) as JSX.Element;
	}

	interface TabContentChild {
		props: TabChildProps;
	}

	const renderTabContent = (child: TabContentChild): JSX.Element | null => {
		if (child.props.index === activeTab) {
			return <div key={`${child.props?.index}-${child.props?.label.replace(/\s+/g, '-')}`}>{child.props.children}</div>;
		}
		return null;
	};

	return (
		<div className="mx-auto">
			<div
				key={
					Array.isArray(children)
						? children.map((child) => `${child.props?.index}-${child.props?.label.replace(/\s+/g, '-')}`).join(',')
						: `${children.props?.index}-${children.props?.label.replace(/\s+/g, '-') ?? ''}`
				}
				className="border-b border-inputBorderColor text-primaryColor flex"
			>
				{React.isValidElement(children) ? renderTabButton(children) : children.map(renderTabButton)}
			</div>
			<div className="py-4">{children.props ? renderTabContent(children) : children.map(renderTabContent)}</div>
		</div>
	);
};

export const Tab = ({ label, taboptions, children, index, link = '' }) => (
	<div data-label={label} data-taboptions={taboptions} data-link={link} data-index={index}>
		{children}
	</div>
);
