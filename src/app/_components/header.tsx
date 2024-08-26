/* eslint-disable */


"use client"
import React, { useEffect, useRef, useState, MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';

interface ModalProps {
  show: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const HeaderNoAuth: React.FC = () => {
  const [showGetStartedModal, setShowGetStartedModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  
  const toggleGetStartedModal = () => setShowGetStartedModal(!showGetStartedModal);
  const toggleSignInModal = () => setShowSignInModal(!showSignInModal);

  const handleGoogleSignIn = () => {
    router.push('/api/auth/signin/google');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setShowGetStartedModal(false);
        setShowSignInModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as unknown as EventListener);
    };
  }, []);

  
  const Modal: React.FC<ModalProps> = ({ show, onClose, title, children }) => {
    if (!show) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div ref={modalRef} className="bg-white p-8 rounded-lg max-w-md w-full relative">
          <button onClick={onClose} className="absolute top-4 right-4 text-2xl">&times;</button>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-6">{title}</h2>
          </div>
          {children}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className="border-b border-black sticky top-0 z-50 bg-white">
        <div className="size h-[70px] flex items-center justify-between">
          <Link href="/">
            <img
              className="h-[5rem]"
              src="/katchup.svg"
              alt="logo"
            />
          </Link>
          <div className="flex items-center gap-5">
            <div className="hidden text-sm sm:flex items-center gap-5">
              {[
                { title: "Our story", path: "/" },
              ].map((link, index) => (
                <Link key={index} href={link.path}>
                  {link.title}
                </Link>
              ))}
            </div>
            <button 
              className="hidden text-sm sm:flex items-center gap-5"
              onClick={toggleSignInModal}
            >
              Sign In
            </button>
            <button 
              className="text-white rounded-full px-3 p-2 text-sm font-medium bg-black"
              onClick={toggleGetStartedModal}
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      <Modal 
        show={showGetStartedModal} 
        onClose={toggleGetStartedModal}
        title="Join Spot."
      >
        <button className="w-full py-2 px-4 border border-gray-300 rounded-full mb-4 flex items-center justify-center"
          onClick={handleGoogleSignIn}>
          
          <Image src="/google.png" alt="Google" width={20} height={20} className="mr-2" />
          Sign in with Google
        </button>
        <p className="text-center text-sm mb-4">
          Already have an account? <Link href="/" className="text-green-600">Sign in</Link>
        </p>
        <p className="text-xs text-center text-gray-500">
          Click "Sign up" to agree to Spot's <Link href="/terms" className="underline">Terms of Service</Link> and acknowledge that Spot's <Link href="/privacy" className="underline">Privacy Policy</Link> applies to you.
        </p>
      </Modal>

      <Modal 
        show={showSignInModal} 
        onClose={toggleSignInModal}
        title="Sign In"
      >
        <button className="w-full py-2 px-4 border border-gray-300 rounded-full mb-4 flex items-center justify-center"
          onClick={handleGoogleSignIn}>
          <Image src="/google.png" alt="Google" width={20} height={20} className="mr-2" />
          Sign in with Google
        </button>
        <p className="text-center text-sm mb-4">
          No account? <Link href="/" className="text-green-600">Create one</Link>
        </p>
        <p className="text-xs text-center text-gray-500">
          Click "Sign in" to agree to Spot's <Link href="/terms" className="underline">Terms of Service</Link> and acknowledge that Spot's <Link href="/" className="underline">Privacy Policy</Link> applies to you.
        </p>
      </Modal>
    </>
  );
};

export default HeaderNoAuth;