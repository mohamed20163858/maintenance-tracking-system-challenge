"use client";

import Link from "next/link";
import { useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold">
              My App
            </Link>
          </div>

          {/* Hamburger Menu for Mobile */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            >
              <svg
                className={`h-6 w-6 ${isOpen ? "hidden" : "block"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
              <svg
                className={`h-6 w-6 ${isOpen ? "block" : "hidden"}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Menu Items */}
          <div
            className={`md:flex items-center space-x-4 ${
              isOpen ? "block" : "hidden"
            } md:block`}
          >
            <Link href="/" className="hover:bg-blue-700 px-3 py-2 rounded-md">
              Dashboard
            </Link>
            <Link
              href="/equipment"
              className="hover:bg-blue-700 px-3 py-2 rounded-md"
            >
              Equipment Table
            </Link>
            <Link
              href="/maintenance"
              className="hover:bg-blue-700 px-3 py-2 rounded-md"
            >
              Maintenance Table
            </Link>
            <Link
              href="/equipment/new"
              className="hover:bg-blue-700 px-3 py-2 rounded-md"
            >
              Create Equipment
            </Link>
            <Link
              href="/maintenance/new"
              className="hover:bg-blue-700 px-3 py-2 rounded-md"
            >
              Create Maintenance Reocrd
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
