import React from 'react';

/**
 * Props for the Checkbox component.
 * @interface CheckboxProps
 * @property {string} label - The label for the checkbox.
 * @property {"left" | "right"} labelPlacement - The placement of the label for the checkbox.
 * @property {string} [customLabelClass] - Optional custom Tailwind CSS class for the label.
 * @property {string} [customCheckboxClass] - Optional custom Tailwind CSS class for the checkbox.
 * @property {boolean} [disabled] - Indicates whether the checkbox is disabled.
 * @property {string} [value] - The current value of the checkbox.
 * @property {boolean} [isChecked] - Indicates whether the checkbox is checked using parent component state.
 * @property {(checked: boolean) => void} [setCheckedValue] - Callback function to update the checked value using parent component state.
 */
interface CheckboxProps {
	label: string;
	labelPlacement?: 'left' | 'right';
	customLabelClass?: string;
	customCheckboxClass?: string;
	disabled?: boolean;
	value?: string;
	isChecked: boolean;
	setCheckedValue?: (checked: boolean) => void;
	marginBot?: string;
}

const injectHyphenLowerCase = (string: string) => string.split(' ').join('-').toLowerCase();

/**
 * A reusable Checkbox component that renders a labeled checkbox.
 * @component
 * @param {CheckboxProps} props - The props for the checkbox component.
 * @returns {JSX.Element} The rendered checkbox component.
 */
const Checkbox = ({
	label,
	labelPlacement = 'right',
	customLabelClass = '',
	customCheckboxClass = '',
	disabled = false,
	value,
	isChecked,
	setCheckedValue,
	marginBot = '4',
}: CheckboxProps) => {
	/**
	 * This is a standard change handler that is invoked when the user check or unchecks the checkbox.
	 * @param {React.ChangeEvent<HTMLInputElement>} [e] - On Change event passed to change handler.
	 */
	function handler(e: React.ChangeEvent<HTMLInputElement>) {
		if (setCheckedValue) {
			setCheckedValue(e.target.checked);
		}
	}

	const checkboxId = injectHyphenLowerCase(label);
	const checkboxClasses = `${customCheckboxClass} border-[2px] size-5 text-primaryColor bg-${isChecked ? 'primaryColor' : 'defaultBackground'} border-${
		isChecked ? 'inputBorderColor' : 'primaryTextColor'
	} rounded focus:ring-primaryColor ring-offset-paperBackground focus:ring-2`;
	const labelClasses = `${customLabelClass} text-primaryTextColor ${labelPlacement === 'right' ? 'ms-3' : 'ms-1 mr-3 text-sm font-normal'}`;

	return (
		<div className={`flex items-center ${marginBot ? `mb-${marginBot}` : ''}`}>
			{labelPlacement === 'left' && (
				<label htmlFor={checkboxId} className={labelClasses}>
					{label}
				</label>
			)}
			<input type="checkbox" id={checkboxId} disabled={disabled} className={checkboxClasses} onChange={handler} value={value} checked={isChecked} />
			{labelPlacement === 'right' && (
				<label htmlFor={checkboxId} className={labelClasses}>
					{label}
				</label>
			)}
		</div>
	);
};

export default Checkbox;
