'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';

const NavBar = () => {
  const router = useRouter();
  const { data: session, status } = useSession();

  // when a genre is selected, redirect to Movies page with genre passed into URL
  const handleGenreSelect = (genre: string) => {
    router.push(`/Movies?genre=${genre}`);
  };

  // checks session to see if user is logged in. if so - log out, if not - send to register page.
  const handleAuthAction = async () => {
    if (session) {
      await signOut({ redirect: true, callbackUrl: '/' });
    } else {
      router.push('/auth/register');
    }
  };


  return (
    <div className="navbar rounded-md bg-base-200 shadow-xl">
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-2xl lg:text-3xl font-bold">
          AWOL
        </Link>
      </div>
      <div className="navbar-center lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <details>
              <summary>Genres</summary>
              <ul className="flex flex-row p-2 bg-base-100 rounded-box shadow-xl">

              <li>
                    <button
                      onClick={() => handleGenreSelect('all')}
                    >
                      ALL
                    </button>
                  </li>

                  <li>
                    <button
                      onClick={() => handleGenreSelect('action')}
                    >
                      Action
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleGenreSelect('horror')}
                    >
                      Horror
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleGenreSelect('fantasy')}
                    >
                      Fantasy
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => handleGenreSelect('scifi')}
                    >
                      Sci-Fi
                    </button>
                  </li>

              </ul>
            </details>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
      <p className="text-sm">Welcome, {session?.user?.name}.</p>
      {/* button changes based on login status, displays a loading spinner until the session is retrieved */}
        <button 
          onClick={handleAuthAction}
          className="btn btn-primary"
        >
          {status === 'loading' ? (
            <span className="loading loading-spinner"></span>
          ) : session ? (
            'Sign Out'
          ) : (
            'Sign In'
          )}
        </button>
      </div>
    </div>
  );
};

export default NavBar;
