/* eslint-disable */

import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function getPlaces() {
    const filePath = path.join(process.cwd(), 'data.json');
    const jsonData = await fs.readFile(filePath, 'utf8');
    return JSON.parse(jsonData);
}

export async function POST() {
    const places = await getPlaces();
    
    const transformedPlaces = places.map((place: any) => ({
        title: place.title || `Unnamed Place`,
        price: place.price || null,
        address: place.address || '',
        city: place.city || '',
        state: place.state || '',
        countryCode: place.countryCode || null,
        phone: place.phone || null,
        latitude: place.location?.lat || null,
        longitude: place.location?.lng || null,
        totalScore: place.totalScore || 0,
        reviewsCount: place.reviewsCount || 0,
        categories: place.categories || ['Uncategorized'],
        url: place.url || '',
        imageUrl: place.imageUrl || null,
        imageUrls: place.imageUrls || [],
        website: place.website || null,
        reserveTableUrl: place.reserveTableUrl || null,
        googleFoodUrl: place.googleFoodUrl || null,
      }));
    const result = await prisma.place.createMany({
        data: transformedPlaces,
        skipDuplicates: true,
    });

    return NextResponse.json({ insertedCount: result.count });
}

export async function GET() {
    const dbPlaces = await prisma.place.findMany();
    return NextResponse.json(dbPlaces);
}