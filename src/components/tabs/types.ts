export type TabOptions = {
	message: string;
	disabled: string;
};

export const defaultTabOptions: TabOptions = {
    message: '',
    disabled: '',
};

export const dbNotConfigured: TabOptions = {
    message: 'This cluster does not support mongo database integration',
    disabled: 'true',
};
