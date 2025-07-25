import { LeftOutlined, RightOutlined } from '@ant-design/icons';

const Pagination = ({ beginningPageIndex, endingPageIndex, length, setRowsPerPage, decrementPageNumber, incrementPageNumber }) => {
	const isBeginningPage = beginningPageIndex === 1;
	const isEndingPage = endingPageIndex > length;

	const navIconStyle = 'flex items-center px-1 h-8 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:pointer-events-none';

	return (
		<nav className="flex justify-end text-xs items-center pt-4" aria-label="Table navigation">
			<span>Rows per page:</span>{' '}
			<select
				id="underline_select"
				className="bg-paperBackground text-sm border-0 focus:outline-none focus:ring-0 focus:border-gray-200 peer"
				defaultValue="10"
				onChange={setRowsPerPage}
			>
				<option>5</option>
				<option>10</option>
				<option>15</option>
				<option>50</option>
			</select>
			<span>
				<span>
					{beginningPageIndex} {'-'} {endingPageIndex > length ? length : endingPageIndex}
				</span>{' '}
				of <span>{length}</span>
			</span>
			<ul className="inline-flex pl-6">
				<li>
					<button onClick={decrementPageNumber} className={navIconStyle} disabled={isBeginningPage}>
						{<LeftOutlined color={isBeginningPage ? 'disabled' : 'inherit'} />}
					</button>
				</li>
				<li>
					<button onClick={incrementPageNumber} className={navIconStyle} disabled={isEndingPage}>
						{<RightOutlined color={isEndingPage ? 'disabled' : 'inherit'} />}
					</button>
				</li>
			</ul>
		</nav>
	);
};

export default Pagination;
