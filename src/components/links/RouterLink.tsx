import { Link } from 'react-router-dom';

/**
 * Renders a reusable link component with a customClass property for customization.
 * @param {object} props - The props for the link component.
 * @param {React.ReactNode} props.children - The content to be rendered inside the link.
 * @param {string} props.linkTo - The destination URL for the link.
 * @param {string} [props.target] - The target attribute for the link (default is '_self').
 * @param {string} [props.customClass] - Additional custom Tailwind CSS class(es) to be applied to the component.
 * @returns {React.ReactElement} The rendered link component.
 */
function RouterLink({ children, linkTo, target = '_self', customClass = '' }) {
	return (
		<span className="focus:bg-slate-500">
			<Link to={linkTo} target={target} className={`flex ${customClass}`}>
				{children}
			</Link>
		</span>
	);
}

export default RouterLink;
