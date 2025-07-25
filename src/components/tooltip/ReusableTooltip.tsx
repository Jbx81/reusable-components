import type { Placement } from '@floating-ui/core';
import { Tooltip } from 'flowbite-react';
import type { JSX } from 'react';

interface ReusableTooltipProps {
	content: string | JSX.Element[];
	children: JSX.Element;
	placement?: 'auto' | Placement;
	customStyle?: string;
}

const ReusableTooltip = ({ content, children, placement = 'bottom', customStyle = '' }: ReusableTooltipProps) => (
	<Tooltip
		content={content}
		placement={placement}
		className={`text-center rounded shadow-lg p-1 bg-gray-600 text-buttonTextColor ${customStyle}`}
		arrow={false}
	>
		{children}
	</Tooltip>
);

export default ReusableTooltip;
