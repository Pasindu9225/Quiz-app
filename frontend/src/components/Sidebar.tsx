import Link from "next/link";

const Sidebar = () => {
  return (
    <aside className="w-64 h-screen bg-gray-900 text-white p-6">
      <h2 className="text-xl font-semibold">Dashboard</h2>
      <nav className="mt-4">
        <ul>
          <li>
            <Link
              href="/"
              className="block py-2 px-4 rounded hover:bg-gray-800"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href="/profile"
              className="block py-2 px-4 rounded hover:bg-gray-800"
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              href="/login"
              className="block py-2 px-4 rounded hover:bg-gray-800"
            >
              Logout
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
