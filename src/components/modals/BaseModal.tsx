/* eslint-disable react/jsx-no-useless-fragment */
import { ReactNode, useRef, useState } from 'react';
import Draggable from 'react-draggable';

import ModalCloseIcon from '../icons/ModalCloseIcon';

export interface BaseDialogProps {
	title: string;
	icon?: JSX.Element;
	open?: boolean;
	content: ReactNode;
	onClose: () => void;
	width?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
	isService?: boolean;
}
const BaseDialog = (props: BaseDialogProps) => {
	const nodeRef = useRef(null);
	const [isDragging, setIsDragging] = useState(false);

	const handleMouseDown = (event) => {
		if (['P', 'LABEL', 'STRONG', 'INPUT'].find((el) => el === event.target.tagName)) {
			event.stopPropagation(); // Prevent draggable behavior
			setIsDragging(false);
		} else {
			setIsDragging(true);
		}
	};

	return (
		<div>
			{props.open && (
				<>
					<div
						className="fixed top-0 left-0 bg-black/50 w-full h-dvh z-[1300] overflow-auto"
						onClick={() => {
							props.onClose();
						}}
					/>
					<Draggable nodeRef={nodeRef} disabled={!isDragging}>
						<div
							className={`${props.width === 'lg' ? 'left-[2%]' : 'left-[35%]'} ${
								props.isService ? 'top-[30%]' : 'top-[2%]'
							} fixed  m-auto z-[1310] rounded border bg-paperBackground transform -translate-x-1/2 -translate-y-1/2 ${
								props.width ? `max-w-screen-${props.width}` : 'max-w-screen-md'
							} max-h-[calc(100%-64px)] w-[calc(100%-64px)] overflow-auto`}
							ref={nodeRef}
						>
							<div className="flex flex-row w-full justify-between px-6 py-4">
								<div id="title" className="flex text-primaryTextColor">
									<h1 className="text-xl font-semibold leading-6">{props.title}</h1>
									{props.icon && <span>{props.icon}</span>}
								</div>
								<button
									className="text-xl leading-6"
									onClick={() => {
										props.onClose();
									}}
								>
									<ModalCloseIcon />
								</button>
							</div>
							<div className="m-4 p-2 overflow-auto" onMouseDown={handleMouseDown}>
								{props.content}
							</div>
						</div>
					</Draggable>
				</>
			)}
		</div>
	);
};
export default BaseDialog;
