import React from 'react';

interface TableProps<T> {
	headers: { title: string; width?: string }[]; // Header titles with optional widths
	data: T[];
	renderRow: (item: T) => React.ReactNode;
	customStyle?: string;
}

const Table = <T,>({ headers, data, renderRow, customStyle = '' }: TableProps<T>) => (
	<table className={`w-full text-left ${customStyle}`}>
		<thead className="bg-defaultBackground">
			<tr className="text-xl font-bold">
				{headers.map((header, index) => (
					<th
						key={index}
						scope="col"
						className={`px-6 py-3 ${header.width || ''}`} // Apply width if provided
					>
						{header.title}
					</th>
				))}
			</tr>
		</thead>
		<tbody className="text-base">
			{data.map((item, index) => (
				<tr key={index} className="border-y border-inputBorderColor hover:bg-gray-200/60 dark:hover:bg-gray-600">
					{renderRow(item)}
				</tr>
			))}
		</tbody>
	</table>
);

export default Table;
