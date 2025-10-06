import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET, // использовать только на сервере
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { paramsToSign } = body || {};

    if (!paramsToSign) {
      return NextResponse.json(
        { error: 'No paramsToSign provided' },
        { status: 400 }
      );
    }

    if (!process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: 'CLOUDINARY_API_SECRET is not set' },
        { status: 500 }
      );
    }

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      process.env.CLOUDINARY_API_SECRET
    );

    return NextResponse.json({ signature, timestamp: paramsToSign.timestamp });
  } catch (error) {
    console.error('Cloudinary sign error:', error);
    return NextResponse.json(
      { error: 'Failed to generate signature' },
      { status: 500 }
    );
  }
}
