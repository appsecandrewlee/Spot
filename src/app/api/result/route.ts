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
        totalScore: place.totalScore || 0,
        reviewsCount: place.reviewsCount || 0,
        street: place.street || '',
        city: place.city || '',
        state: place.state || '',
        countryCode: place.countryCode || '',
        website: place.website || null,
        phone: place.phone || null,
        categoryName: place.categoryName || 'Uncategorized',
        url: place.url || ''
    }));

    console.log('Transformed places:', transformedPlaces);

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