"use client";

import React, { useState } from "react";
import { PayPalButtons, PayPalScriptProvider, ReactPayPalScriptOptions } from '@paypal/react-paypal-js';
import { toast } from "react-toastify";
import { formatMoney } from "@/utils";
import { processPayPalPayment } from "@/lib/actions/paypal.action";

interface PayPalPaymentProps {
  orderData: {
    _id: string;
    code: string;
    amount: number;
    total: number;
    course: {
      title: string;
    };
  };
  onPaymentSuccess: () => void;
  onPaymentError: (error: any) => void;
}

const PayPalPayment: React.FC<PayPalPaymentProps> = ({
  orderData,
  onPaymentSuccess,
  onPaymentError
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const initialOptions: ReactPayPalScriptOptions = {
    clientId: "AX7qHRqcGfU5u6U3CymBDAnRj4NiJRt4YY3xs5K86s0bFyHbeHnQn14uOe5F4c_Atvlslzflrea1toD2",
    currency: "USD",
    intent: "capture",
    components: "buttons",
  };

  const createOrder = (data: any, actions: any) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: (orderData.total / 24000).toFixed(2), // Convert VND to USD (approximate rate)
            currency_code: "USD",
          },
          description: `Khóa học: ${orderData.course.title}`,
          custom_id: orderData.code,
        },
      ],
      application_context: {
        brand_name: "TMdemy",
        landing_page: "NO_PREFERENCE",
        user_action: "PAY_NOW",
        return_url: `${window.location.origin}/payment-success/${orderData.code}`,
        cancel_url: `${window.location.origin}/payment/${orderData.code}`,
      },
    });
  };

  const onApprove = async (data: any, actions: any) => {
    setIsProcessing(true);
    
    try {
      const order = await actions.order.capture();
      
      console.log("PayPal Order:", order);
      
      // Process the payment on the backend
      const result = await processPayPalPayment({
        orderId: order.id,
        orderCode: orderData.code,
        amount: orderData.total,
        currency: "USD",
        status: order.status,
        payerEmail: order.payer?.email_address,
        payerId: order.payer?.payer_id,
      });
      
      if (result.success) {
        toast.success("Thanh toán PayPal thành công!");
        onPaymentSuccess();
      } else {
        toast.error(result.message || "Có lỗi xảy ra khi xử lý thanh toán");
        onPaymentError(new Error(result.message));
      }
      
    } catch (error) {
      console.error("PayPal Payment Error:", error);
      toast.error("Có lỗi xảy ra khi thanh toán PayPal");
      onPaymentError(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onError = (error: any) => {
    console.error("PayPal Error:", error);
    toast.error("Có lỗi xảy ra với PayPal");
    onPaymentError(error);
  };

  const onCancel = (data: any) => {
    console.log("PayPal Payment Cancelled:", data);
    toast.info("Thanh toán PayPal đã bị hủy");
  };

  return (
    <div className="w-full">
      <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-sm text-yellow-800 dark:text-yellow-200">
          <strong>Lưu ý:</strong> Thanh toán bằng USD. Tỷ giá: ~24,000 VND = 1 USD
        </p>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
          Số tiền thanh toán: <strong>${(orderData.total / 24000).toFixed(2)} USD</strong>
        </p>
      </div>

      {isProcessing && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-blue-700 dark:text-blue-300">
              Đang xử lý thanh toán PayPal...
            </span>
          </div>
        </div>
      )}

      <PayPalScriptProvider options={initialOptions}>
        <PayPalButtons
          createOrder={createOrder}
          onApprove={onApprove}
          onError={onError}
          onCancel={onCancel}
          style={{
            layout: "vertical",
            color: "blue",
            shape: "rect",
            label: "paypal",
            height: 45,
          }}
          disabled={isProcessing}
        />
      </PayPalScriptProvider>
    </div>
  );
};

export default PayPalPayment;
