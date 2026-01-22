import { getWebpayTransaction } from '@/lib/webpay';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, sessionId, buyOrder } = body;

    const returnUrl = `${request.headers.get('origin')}/api/webpay/commit`;

    const transaction = getWebpayTransaction();
    
    const response = await transaction.create(
      buyOrder,
      sessionId,
      amount,
      returnUrl
    );

    return NextResponse.json({
      token: response.token,
      url: response.url,
    });
  } catch (error: any) {
    console.error('Webpay Create Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
