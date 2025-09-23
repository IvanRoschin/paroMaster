// app/api/warehouses/route.ts
import { getData } from 'app/lib/novaPoshta';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { city } = await request.json();
    if (!city) {
      return NextResponse.json(
        { success: false, message: 'City not provided' },
        { status: 400 }
      );
    }

    const response = await getData({
      apiKey: process.env.NOVA_API,
      modelName: 'Address',
      calledMethod: 'getWarehouses',
      methodProperties: { CityName: city, Limit: '50', Language: 'UA' },
    });

    if (!response.success) {
      console.error('Failed to fetch warehouses');
    }

    return NextResponse.json({ success: true, data: response.data.data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch warehouses' },
      { status: 500 }
    );
  }
}
