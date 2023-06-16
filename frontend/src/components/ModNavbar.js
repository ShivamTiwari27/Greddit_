import { Link, useMatch, useResolvedPath, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";

export default function ModNavbar() {
    const { subname } = useParams();
    return (
        <nav className="bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center"></div>
                    <ul className="flex space-x-4">
                        <li>
                            <CustomLink to={`/sub/mod/${subname}/users`} icon={faCube} className="text-white hover:text-gray-400">Users</CustomLink>
                        </li>

                        <li>
                            <CustomLink to={`/sub/mod/${subname}/joinreq`} icon={faCube} className="text-white hover:text-gray-400">Join Req</CustomLink>
                        </li>

                        <li>
                            <CustomLink to={`/sub/mod/${subname}/stats`} icon={faCube} className="text-white hover:text-gray-400">Stats</CustomLink>
                        </li>

                        <li>
                            <CustomLink to={`/sub/mod/${subname}/reports`} icon={faCube} className="text-white hover:text-gray-400">Reports</CustomLink>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>

    );
};

function CustomLink({ to, children, icon, ...props }) {
    const resolvedPath = useResolvedPath(to);
    const isAct = useMatch({ path: resolvedPath.pathname, end: true });

    return (
        <div className="navbar-icon">
            <li className={isAct ? "active" : ""}>
                {icon && (
                    <FontAwesomeIcon
                        icon={icon}
                        className="text-white cube-icon"
                    />
                )}
                <Link to={to} {...props}>
                    {children}
                </Link>
            </li>
        </div>
    );
}
