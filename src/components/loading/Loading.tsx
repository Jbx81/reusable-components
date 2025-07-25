import React from 'react';

import AuthMessage from './AuthMessage';
import Spinner from '../spinner/Spinner';

type LoadingProps = {
	isAuthInProgress?: boolean;
	customText?: string;
};

const Loading: React.FC<LoadingProps> = ({ isAuthInProgress = false, customText = 'Loading....' }) => (
	<>
		<div className="flex justify-center gap-4 pt-6 text-primaryTextColor">
			<Spinner />
			<h3 id="loading-icon" className="text-lg font-bold">
				{customText}
			</h3>
		</div>
		{isAuthInProgress && <AuthMessage />}
	</>
);

export default Loading;
