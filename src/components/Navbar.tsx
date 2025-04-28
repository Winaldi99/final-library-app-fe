import {
  Disclosure,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems
} from "@headlessui/react";
import { BellIcon } from "@heroicons/react/16/solid";
import { NavLink } from "react-router-dom";
import { useAuth } from "../utils/AuthProvider";

const navigation = [{ name: "Post", to: "/posts", current: false },
                    { name: "Books", to: "/books", current: false },
                    { name: "Categories", to: "/categories", current: false },
                    { name: "Review", to: "/review", current: false }];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Navbar = () => {
  const { logout } = useAuth();
  return (
    <Disclosure as="nav" className="bg-gradient-to-r from-indigo-500 to-purple-600 shadow-md">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">
              {/* Mobile menu button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md p-2 text-indigo-100 hover:bg-indigo-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition duration-150">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  ) : (
                    <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                    </svg>
                  )}
                </Disclosure.Button>
              </div>
              
              <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                <div className="flex shrink-0 items-center">
                  <img
                    alt="Your Company"
                    src="https://tailwindui.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                    className="h-9 w-auto bg-white p-1 rounded-md shadow-sm"
                  />
                </div>
                <div className="hidden sm:ml-8 sm:block">
                  <div className="flex space-x-4">
                    {navigation.map((item) => (
                      <NavLink
                        to={item.to}
                        key={item.name}
                        className={({ isActive }) => {
                          return classNames(
                            isActive
                              ? "bg-indigo-700 text-white"
                              : "text-indigo-100 hover:bg-indigo-600 hover:text-white",
                            "rounded-md px-4 py-2 text-sm font-medium transition-colors duration-200"
                          );
                        }}
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0 space-x-3">
                <button
                  type="button"
                  className="relative rounded-full bg-indigo-600 p-2 text-indigo-100 hover:text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600 transition duration-150"
                >
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="size-5" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative">
                  <div>
                    <MenuButton className="relative flex rounded-full bg-indigo-600/10 ring-2 ring-white/50 hover:ring-white p-0.5 text-sm focus:outline-none transition duration-150">
                      <span className="sr-only">Open user menu</span>
                      <img
                        alt="User profile"
                        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="size-8 rounded-full object-cover"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black/5 transition focus:outline-none data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
                  >
                    <MenuItem>
                      {({active}) => (
                        <a
                          href="#"
                          className={`${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'} flex items-center px-4 py-2 text-sm transition-colors duration-150`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                          Your Profile
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({active}) => (
                        <a
                          href="#"
                          className={`${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'} flex items-center px-4 py-2 text-sm transition-colors duration-150`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                          </svg>
                          Settings
                        </a>
                      )}
                    </MenuItem>
                    <MenuItem>
                      {({active}) => (
                        <a
                          onClick={() => logout()}
                          className={`${active ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'} flex items-center px-4 py-2 text-sm transition-colors duration-150 cursor-pointer`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V7.414l-5-5H3zm7 2a1 1 0 00-1 1v7a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          Sign out
                        </a>
                      )}
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              {navigation.map((item) => (
                <NavLink
                  to={item.to}
                  key={item.name}
                  className={({isActive}) => 
                    classNames(
                      isActive 
                        ? 'bg-indigo-700 text-white' 
                        : 'text-indigo-100 hover:bg-indigo-600 hover:text-white',
                      'block rounded-md px-3 py-2 text-base font-medium transition-colors duration-150'
                    )
                  }
                >
                  {item.name}
                </NavLink>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;