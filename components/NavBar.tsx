import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-pink-600 shadow-lg">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/" className="text-white text-2xl font-bold hover:text-gray-200 transition">
            ❤️ LoveMap
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-6">
            <Link href="/map" className="text-white hover:text-gray-300 transition text-lg">
              View Map
            </Link>
            <Link href="/location" className="text-white hover:text-gray-300 transition text-lg">
              Add Location
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}