import { getWebpayTransaction } from '@/lib/webpay';
import { NextResponse } from 'next/server';

// Helper to handle the commit logic
async function handleCommit(token: string, origin: string) {
  try {
    const transaction = getWebpayTransaction();

    const response = await transaction.commit(token);

    // response.response_code === 0 means authorized
    const status = response.response_code === 0 ? 'success' : 'failed';
    
    const params = new URLSearchParams({
      status: status,
      amount: response.amount.toString(),
      order: response.buy_order,
      auth_code: response.authorization_code || '',
      date: response.transaction_date || ''
    });

    // Use status 303 to force GET method on redirect
    return NextResponse.redirect(`${origin}/webpay/return?${params.toString()}`, { status: 303 });

  } catch (error: any) {
    console.error('Webpay Commit Error:', error);
    // Use status 303 to force GET method on redirect
    return NextResponse.redirect(`${origin}/webpay/return?status=error&message=${encodeURIComponent(error.message)}`, { status: 303 });
  }
}

export async function POST(request: Request) {
  try {
    const origin = new URL(request.url).origin;
    const formData = await request.formData();
    const token = formData.get('token_ws') as string;
    const tbkToken = formData.get('TBK_TOKEN') as string;
    const tbkOrdenCompra = formData.get('TBK_ORDEN_COMPRA') as string;

    // Handle aborted payment
    if (tbkToken && !token) {
      return NextResponse.redirect(`${origin}/webpay/return?status=aborted&order=${tbkOrdenCompra}`, { status: 303 });
    }

    if (!token) {
      return NextResponse.json({ error: "Token no recibido" }, { status: 400 });
    }

    return await handleCommit(token, origin);

  } catch (error: any) {
    const origin = new URL(request.url).origin;
    console.error('Webpay POST Error:', error);
    return NextResponse.redirect(`${origin}/webpay/return?status=error&message=${encodeURIComponent(error.message)}`, { status: 303 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const origin = url.origin;
    const searchParams = url.searchParams;
    
    const token = searchParams.get('token_ws');
    const tbkToken = searchParams.get('TBK_TOKEN');
    const tbkOrdenCompra = searchParams.get('TBK_ORDEN_COMPRA');

    // Handle aborted payment
    if (tbkToken && !token) {
      return NextResponse.redirect(`${origin}/webpay/return?status=aborted&order=${tbkOrdenCompra}`, { status: 303 });
    }

    if (!token) {
       return NextResponse.json({ error: "Token no recibido en GET" }, { status: 400 });
    }

    return await handleCommit(token, origin);

  } catch (error: any) {
    const origin = new URL(request.url).origin;
    console.error('Webpay GET Error:', error);
    return NextResponse.redirect(`${origin}/webpay/return?status=error&message=${encodeURIComponent(error.message)}`, { status: 303 });
  }
}
