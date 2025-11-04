import { NextResponse } from 'next/server';

import { verifyUser } from '@/app/actions/auth.server';

export async function POST(req: Request) {
  const { token } = await req.json();
  return NextResponse.json(await verifyUser(token));
}
