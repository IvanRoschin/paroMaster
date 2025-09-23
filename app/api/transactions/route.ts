// app/api/transactions/route.ts
import { NextRequest, NextResponse } from 'next/server';

import { getTransactionList } from '@/actions/wayForPay';

export async function GET(req: NextRequest) {
  const now = Math.floor(Date.now() / 1000);
  const halfYearAgo = now - 182 * 24 * 60 * 60;

  const oneMonth = 30 * 24 * 60 * 60; // 30 дней в секундах

  let start = halfYearAgo;
  let allTransactions: any[] = [];

  try {
    while (start < now) {
      const end = Math.min(start + oneMonth, now);

      const part = await getTransactionList(start, end);
      allTransactions = [...allTransactions, ...part];

      start = end + 1; // чтобы не дублировать границу
    }

    return NextResponse.json(allTransactions);
  } catch (err: any) {
    console.error('WayForPay API error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
