import { EyeFilled, EyeInvisibleFilled, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { AxiosError } from 'axios';
import { Tooltip } from 'flowbite-react';
import moment from 'moment';
import { useState, useEffect, ReactNode } from 'react';

import BaseModal from './BaseModal';
import useCombinedContext from '../../../contexts/CombinedContextHook';
import AppsService from '../../../features/myApps/services/AppsService';
import ProjectService from '../../../features/myApps/services/ProjectService';
import scanningDeployStrings from '../../../features/myApps/strings/scanningDeployStrings';
import AppKeys from '../../../models/applications/AppKeys';
import ButtonWithTooltip from '../buttons/ButtonWithTooltip';
import ContentCopyButton from '../buttons/ContentCopyButton';
import Spinner from '../spinner/Spinner';

const getWarningIcon = (remainingDays) => {
	if (remainingDays < 30) {
		return <ExclamationCircleOutlined style={{ color: 'red', marginRight: '0.5rem', cursor: 'pointer' }} />;
	}
	if (remainingDays < 60) {
		return <ExclamationCircleOutlined style={{ color: 'yellow', marginRight: '0.5rem', cursor: 'pointer' }} />;
	}
	return null;
};

const KeyItem = ({ keyObj, secretVisible, toggleSecretVisibility, handleDeleteKey, isDeleteDisabled }) => {
	const expirationDate = moment(keyObj.expires_on).utc();
	const remainingDays = expirationDate.diff(moment.utc(), 'days');
	const warningIcon = getWarningIcon(remainingDays);

	return (
		<div key={keyObj.id} className="bg-defaultBackground shadow-md rounded-lg p-4 mb-4">
			<div className="flex items-center justify-between">
				<input
					className="flex-grow bg-paperBackground text-primaryTextColor border border-gray-300 rounded-md p-2 mr-2"
					type={secretVisible[keyObj.index] ? 'text' : 'password'}
					value={keyObj.key}
					readOnly
				/>
				<ButtonWithTooltip
					content={`${secretVisible[keyObj.index] ? 'Hide' : 'Show'} Key`}
					disabled={false}
					placement="top"
					customStyle=""
					onClick={() => toggleSecretVisibility(keyObj.index)}
				>
					<span className="text-primaryTextColor hover:text-primaryColor">
						{secretVisible[keyObj.index] ? <EyeFilled style={{ fontSize: 21 }} /> : <EyeInvisibleFilled style={{ fontSize: 21 }} />}
					</span>
				</ButtonWithTooltip>
				<ContentCopyButton value={keyObj.key} />
				<ButtonWithTooltip
					content={isDeleteDisabled ? 'You cannot delete a key if it is the only one left' : 'Delete Key'}
					disabled={isDeleteDisabled}
					defaultDisabled={false}
					placement="top"
					customStyle="bg-defaultBackground"
					onClick={() => {
						handleDeleteKey(keyObj.id);
					}}
				>
					<DeleteOutlined style={{ fontSize: 21, color: isDeleteDisabled ? 'gray' : 'red' }} />
				</ButtonWithTooltip>
			</div>
			<div className="flex items-center">
				<div className="text-gray-500 mt-2 flex items-center">
					<Tooltip
						placement="top"
						content={`This key expires in ${remainingDays} days, please create a new key and replace it in your deployment and scanning pipelines. Once the key has expired, it will no longer work.`}
						arrow={false}
					>
						{warningIcon}
					</Tooltip>
					Expires on: {expirationDate.format('DD-MM-YYYY')}
				</div>
			</div>
		</div>
	);
};

const KeyList = ({ keys, secretVisible, toggleSecretVisibility, handleDeleteKey }) => {
	const isDeleteDisabled = keys.length <= 1;

	return (
		<>
			{keys.map((keyObj, index) => (
				<KeyItem
					key={keyObj.id}
					keyObj={{ ...keyObj, index }}
					secretVisible={secretVisible}
					toggleSecretVisibility={toggleSecretVisibility}
					handleDeleteKey={handleDeleteKey}
					isDeleteDisabled={isDeleteDisabled}
				/>
			))}
		</>
	);
};

const getKeys = async (params) => {
	const { activeSecret, activeAppId, activeProjectId, changeActiveSecret, changeAPIError } = params;
	try {
		let key: AppKeys;
		if (activeSecret.type === scanningDeployStrings.ScanningApiKeyType) {
			key = await AppsService.getAppScanningKey(activeAppId);
			changeActiveSecret({
				type: scanningDeployStrings.ScanningApiKeyType,
				keys: key.keys,
				description: scanningDeployStrings.ScanningApiKeyDescription,
			});
		} else if (activeSecret.type === scanningDeployStrings.DeploymentApiKeyType) {
			key = await ProjectService.getProjectDeploymentKey(activeAppId, activeProjectId);
			changeActiveSecret({
				type: scanningDeployStrings.DeploymentApiKeyType,
				keys: key.keys,
				description: scanningDeployStrings.DeploymentApiKeyDescription,
			});
		}
	} catch (e) {
		const axiosError = e as AxiosError;
		// Handle 404 error when no API keys are found
		if (axiosError.response?.status === 404) {
			// Keep the current state with empty keys
			changeActiveSecret({
				type: activeSecret.type,
				keys: [],
				description: activeSecret.description,
			});
		} else {
			changeAPIError(e as Error | AxiosError);
		}
	}
};

const createNewKey = async (params) => {
	const { activeSecret, activeAppId, activeProjectId, changeAPIError } = params;
	try {
		if (activeSecret.type === scanningDeployStrings.ScanningApiKeyType) {
			await AppsService.createAppScanningKey(activeAppId);
		} else {
			await ProjectService.createProjectDeploymentKey(activeAppId, activeProjectId);
		}
		await getKeys(params);
	} catch (e) {
		changeAPIError(e as Error | AxiosError);
	}
};

const toggleSecretVisibility = (index, setSecretVisible) => {
	setSecretVisible((prev) => {
		const updatedVisibility = [...prev];
		updatedVisibility[index] = !updatedVisibility[index];
		return updatedVisibility;
	});
};

const handleDeleteKey = async (params) => {
	const { keyId, activeSecret, activeAppId, activeProjectId, changeAPIError, setLoading } = params;
	if (activeSecret.keys.length <= 1) return;
	setLoading(true);
	try {
		if (activeSecret.type === scanningDeployStrings.ScanningApiKeyType) {
			await AppsService.deleteAppScanningKey(activeAppId, keyId);
		} else {
			await ProjectService.deleteProjectDeploymentKey(activeAppId, activeProjectId, keyId);
		}
		await getKeys(params);
		setLoading(false);
	} catch (e) {
		changeAPIError(e as Error | AxiosError);
	}
};

const onClose = (changeActiveSecret, changeActiveAppId, changeActiveProjectId) => {
	changeActiveSecret({ type: '', keys: [], description: '' });
	changeActiveAppId('');
	changeActiveProjectId('');
};

const ViewSecretDialog: React.FC = () => {
	const { activeSecret, activeAppId, activeProjectId, changeActiveSecret, changeActiveAppId, changeActiveProjectId, changeAPIError } = useCombinedContext();

	const [secretVisible, setSecretVisible] = useState<boolean[]>([]);
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		if (activeSecret.keys) {
			setSecretVisible(new Array(activeSecret.keys.length).fill(false));
		}
	}, [activeSecret]);

	const keys = activeSecret.keys || [];
	const isMaxKeysReached = keys.length >= 2;

	const params = {
		activeSecret,
		activeAppId,
		activeProjectId,
		changeActiveSecret,
		changeAPIError,
		setLoading,
	};

	const ViewSecretContent: ReactNode = (
		<>
			<div className="flex flex-col p-4">
				{keys.length > 0 ? (
					<KeyList
						keys={keys}
						secretVisible={secretVisible}
						toggleSecretVisibility={(index) => toggleSecretVisibility(index, setSecretVisible)}
						handleDeleteKey={(keyId) => {
							handleDeleteKey({ keyId, ...params });
						}}
					/>
				) : (
					<div className="text-center py-8">
						<p className="text-gray-500 text-lg mb-2">No API keys found for this application</p>
						<p className="text-gray-400 text-sm">Click "Add New Key" to create your first API key</p>
					</div>
				)}
			</div>
			<div className="flex items-center justify-between mt-4">
				<div className="flex-grow flex justify-center">{loading && <Spinner />}</div>
				<ButtonWithTooltip
					content={isMaxKeysReached ? 'You can have a max of 2 keys at once' : `Add New ${activeSecret.type}`}
					disabled={loading || isMaxKeysReached}
					placement="top"
					customStyle="bg-blue-500 "
					onClick={async () => {
						setLoading(true);
						await createNewKey(params);
						setLoading(false);
					}}
				>
					Add New Key
				</ButtonWithTooltip>
			</div>
		</>
	);

	return (
		<BaseDialog
			title={activeSecret.type}
			open={activeSecret.type !== '' && activeSecret.keys !== undefined}
			onClose={() => onClose(changeActiveSecret, changeActiveAppId, changeActiveProjectId)}
			content={ViewSecretContent}
		/>
	);
};

export default ViewSecretDialog;
