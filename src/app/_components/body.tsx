"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const BodyNoAuth = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        '/second.jpg',
    ];

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 5000); 

        return () => clearInterval(intervalId);
    }, [images.length]);

    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative flex-grow">
                <div className="absolute inset-0">
                    <Image
                        src={images[currentImageIndex] ?? ''}
                        alt={`Background image ${currentImageIndex + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="absolute inset-0 bg-red-500 bg-opacity-70 flex items-center justify-center">
                    <div className="text-center text-white p-6 max-w-2xl">
                        <h1 className="text-4xl font-bold mb-6">Get more from your area.</h1>
                        <div className="bg-white rounded-full flex items-center p-2 mb-4">
                            <p className="text-black text-lg flex-grow text-left pl-4">
                                Ready to chat to our AI bot to get your food?
                            </p>
                            <button className="bg-red-500 text-white rounded-full p-2">
                                <ArrowRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <footer className="bg-white border-t border-black py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap justify-center gap-4 text-sm">
                        {['Help', 'Status', 'Press', 'Team', 'Accelerator', 'Privacy'].map((item) => (
                            <Link key={item} href="/" className="text-gray-600 hover:text-gray-900">
                                {item}
                            </Link>
                        ))}
                    </nav>
                </div>
            </footer>
        </div>
    );
};

export default BodyNoAuth;