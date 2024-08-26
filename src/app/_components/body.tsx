"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BodyNoAuth = () => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const images = [
        '/second.jpg',
    ];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="relative flex-grow">
                <div className="absolute inset-0">
                    <Image
                        src={images[currentImageIndex] ?? ''}
                        alt={`Carousel image ${currentImageIndex + 1}`}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
                </div>
                <div className="absolute inset-0 flex items-center justify-between px-4">
                    <button onClick={prevImage} className="z-10 p-2 bg-black bg-opacity-50 rounded-full text-white">
                        <ChevronLeft size={24} />
                    </button>
                    <button onClick={nextImage} className="z-10 p-2 bg-black bg-opacity-50 rounded-full text-white">
                        <ChevronRight size={24} />
                    </button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-6">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-[1.3rem] md:text-[1.5rem] font-normal leading-7 mb-4">
                            A place to find your comfort needs, through AI
                        </p>
                        <button className="bg-white text-black rounded-full px-6 py-2 text-[1.2rem] hover:bg-gray-200 transition duration-300">
                            Start ordering!
                        </button>
                    </div>
                </div>
            </div>
            <footer className="bg-white border-t border-black py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <nav className="flex flex-wrap justify-center gap-4 text-sm">
                        {['Help', 'Status','Press', 'Team', 'Accelerator', 'Privacy'].map((item) => (
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