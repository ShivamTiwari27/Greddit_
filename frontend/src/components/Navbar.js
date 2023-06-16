import { Link, useMatch, useResolvedPath, useParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCube } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";

export default function Navbar() {
    const navigate = useNavigate();
    const logout = () => {
        console.log('Logged out');
        localStorage.clear();
        navigate('/login');
    }

    let d = localStorage.getItem('user');
    const { subname } = useParams();
    return (
        <nav className="bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="text-white font-bold text-xl">
                            Greddit
                        </Link>
                    </div>
                    <div className="flex">
                        <ul className="flex items-center">
                            {d ? (
                                <li className="ml-6">
                                    <button
                                        onClick={logout}
                                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200"
                                    >
                                        <FontAwesomeIcon icon={faCube} size="lg" />
                                        <span className="ml-2">Logout</span>
                                    </button>
                                </li>
                            ) : (
                                <li className="ml-6">
                                    <CustomLink
                                        to="/login"
                                        icon={faCube}
                                        className="text-white hover:text-gray-400"
                                    >
                                        Login
                                    </CustomLink>
                                </li>
                            )}
                            <li className="ml-6">
                                <CustomLink
                                    to="/profile"
                                    icon={faCube}
                                    className="text-white hover:text-gray-400"
                                >
                                    Profile
                                </CustomLink>
                            </li>
                            <li className="ml-6">
                                <CustomLink
                                    to="/mysub"
                                    icon={faCube}
                                    className="text-white hover:text-gray-400"
                                >
                                    My Subs
                                </CustomLink>
                            </li>
                            <li className="ml-6">
                                <CustomLink
                                    to="/sub"
                                    icon={faCube}
                                    className="text-white hover:text-gray-400"
                                >
                                    All Subs
                                </CustomLink>
                            </li>
                            <li className="ml-6">
                                <CustomLink
                                    to="/saved"
                                    icon={faCube}
                                    className="text-white hover:text-gray-400"
                                >
                                    Saved
                                </CustomLink>
                            </li>
                            <li className="ml-6">
                                <CustomLink
                                    to="/chat"
                                    icon={faCube}
                                    className="text-white hover:text-gray-400"
                                >
                                    Chats
                                </CustomLink>
                            </li>
                        </ul>
                    </div>
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
