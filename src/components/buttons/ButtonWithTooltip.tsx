import { Tooltip } from 'flowbite-react';

const ButtonWithTooltip = ({ content, placement, disabled, onClick, children, customStyle, defaultDisabled = true, dataTest = '' }) => (
	<Tooltip content={content} placement={placement} className="rounded shadow-lg p-1 bg-gray-600 text-buttonTextColor text-center" arrow={false}>
		<button
			className={`flex px-4 py-1.5 rounded text-sm font-normal text-buttonTextColor ${
				disabled && defaultDisabled ? 'bg-disabledColor disabled:text-gray-600 disabled:bg-disabledColor disabled:pointer-events-none' : ''
			} ${customStyle}`}
			disabled={disabled}
			onClick={onClick}
			data-test={dataTest}
		>
			{children}
		</button>
	</Tooltip>
);

export default ButtonWithTooltip;
