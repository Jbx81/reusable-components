import { AxiosResponse } from 'axios';

const handleAxiosResponse = <Type,>(req: Promise<AxiosResponse<Type | any>>): Promise<Type> =>
	new Promise((resolve, reject) => {
		req.then((res: AxiosResponse<Type>) => resolve(res.data)).catch((e: Error) => reject(e));
	});

export default handleAxiosResponse;
