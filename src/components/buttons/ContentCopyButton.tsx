import { CopyOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';

import ButtonWithTooltip from './ButtonWithTooltip';

type ContentCopyButtonProps = {
	value?: string;
	customClass?: string;
	textColor?: string;
	hoverTextColor?: string;
	iconSize?: string;
};

const ContentCopyButton: React.FC<ContentCopyButtonProps> = (props) => {
	const copyTooltipText = 'Copy to clipboard';
	const copiedTooltipText = 'Copied!';

	const [copyTooltip, setCopyTooltip] = useState<string>(copyTooltipText);

	useEffect(() => {
		setCopyTooltip(copyTooltipText);
	}, [props]);

	return (
		<ButtonWithTooltip
			content={copyTooltip}
			placement="top-end"
			onClick={() => {
				navigator.clipboard.writeText(props.value as string);
				setCopyTooltip(copiedTooltipText);
			}}
			customStyle={`${props.textColor ? `text-${props.textColor}` : 'text-primaryTextColor'} ${
				props.hoverTextColor ? `hover:text-${props.hoverTextColor}` : 'hover:text-primaryColor'
			}`}
			disabled={false}
		>
			<CopyOutlined className={`${props.iconSize ? `text-${props.iconSize}` : 'text-2xl'}`} />
		</ButtonWithTooltip>
	);
};

export default ContentCopyButton;
