import { NextRequest, NextResponse } from "next/server";
import { processPayPalPayment } from "@/lib/actions/paypal.action";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Verify PayPal webhook signature (in production)
    // const isValid = await verifyPayPalWebhook(request, body);
    // if (!isValid) {
    //   return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
    // }

    const { event_type, resource } = body;

    // Handle different PayPal webhook events
    if (event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const orderCode = resource.custom_id;
      const orderId = resource.id;
      const amount = parseFloat(resource.amount.value);
      const currency = resource.amount.currency_code;
      const status = resource.status;

      const result = await processPayPalPayment({
        orderId,
        orderCode,
        amount: amount * 24000, // Convert USD to VND
        currency,
        status,
        payerEmail: resource.payer?.email_address,
        payerId: resource.payer?.payer_id,
      });

      if (result.success) {
        return NextResponse.json({ 
          success: true, 
          message: "Payment processed successfully" 
        });
      } else {
        return NextResponse.json({ 
          success: false, 
          message: result.message 
        }, { status: 400 });
      }
    }

    // Handle other webhook events if needed
    return NextResponse.json({ 
      success: true, 
      message: "Webhook received but no action taken" 
    });

  } catch (error) {
    console.error("PayPal Webhook Error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server error" 
    }, { status: 500 });
  }
}

// Handle GET requests for webhook verification
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const challenge = searchParams.get("challenge");
  
  if (challenge) {
    // PayPal webhook verification
    return NextResponse.json({ challenge });
  }
  
  return NextResponse.json({ 
    message: "PayPal webhook endpoint is active" 
  });
}
