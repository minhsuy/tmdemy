# PayPal Integration - TMdemy

## Tổng quan
Tích hợp PayPal vào hệ thống thanh toán của TMdemy để hỗ trợ thanh toán quốc tế bằng USD.

## Cài đặt

### 1. Dependencies
```bash
npm install @paypal/react-paypal-js
```

### 2. PayPal Sandbox Credentials
- **Client ID**: `AX7qHRqcGfU5u6U3CymBDAnRj4NiJRt4YY3xs5K86s0bFyHbeHnQn14uOe5F4c_Atvlslzflrea1toD2`
- **Environment**: Sandbox (Test mode)

## Cấu trúc Files

### Components
- `src/components/payment/PayPalPayment.tsx` - Component PayPal chính
- `src/app/(dashboard)/payment/[orderCode]/page.tsx` - Trang thanh toán (đã tích hợp PayPal)

### Actions
- `src/lib/actions/paypal.action.ts` - Server actions xử lý PayPal

### API Routes
- `src/app/api/webhook/paypal/route.ts` - Webhook endpoint cho PayPal

## Tính năng

### 1. PayPal Payment Component
- ✅ Tích hợp PayPal Buttons
- ✅ Chuyển đổi VND sang USD (tỷ giá ~24,000 VND = 1 USD)
- ✅ Xử lý thanh toán thành công/thất bại
- ✅ Loading states và error handling
- ✅ Custom styling

### 2. Payment Page Integration
- ✅ PayPal là phương thức thanh toán đầu tiên
- ✅ Hiển thị PayPal component khi chọn
- ✅ Ẩn nút thanh toán thông thường khi chọn PayPal
- ✅ Thông tin tỷ giá và số tiền USD

### 3. Backend Processing
- ✅ Server action xử lý thanh toán PayPal
- ✅ Cập nhật order status thành COMPLETED
- ✅ Thêm khóa học vào user courses
- ✅ Revalidate paths

### 4. Webhook Support
- ✅ API endpoint cho PayPal webhooks
- ✅ Xử lý PAYMENT.CAPTURE.COMPLETED event
- ✅ Webhook verification support

## Cách sử dụng

### 1. Trong Course Detail Page
```tsx
// PayPal đã được tích hợp vào LinkToErrolCourse component
// Khi user chọn "Thanh toán online", PayPal sẽ là option đầu tiên
```

### 2. Trong Payment Page
```tsx
// User chọn PayPal từ danh sách payment methods
// PayPal component sẽ hiển thị với nút PayPal
// Sau khi thanh toán thành công, redirect đến success page
```

### 3. PayPal Component Props
```tsx
<PayPalPayment
  orderData={orderData}
  onPaymentSuccess={() => {
    // Handle success
    router.push(`/payment-success/${orderCode}`);
  }}
  onPaymentError={(error) => {
    // Handle error
    console.error("PayPal Error:", error);
  }}
/>
```

## PayPal Configuration

### 1. Script Options
```tsx
const initialOptions: ReactPayPalScriptOptions = {
  clientId: "AX7qHRqcGfU5u6U3CymBDAnRj4NiJRt4YY3xs5K86s0bFyHbeHnQn14uOe5F4c_Atvlslzflrea1toD2",
  currency: "USD",
  intent: "capture",
  components: "buttons",
};
```

### 2. Order Creation
```tsx
const createOrder = (data: any, actions: any) => {
  return actions.order.create({
    purchase_units: [
      {
        amount: {
          value: (orderData.total / 24000).toFixed(2), // VND to USD
          currency_code: "USD",
        },
        description: `Khóa học: ${orderData.course.title}`,
        custom_id: orderData.code, // Order code for tracking
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
```

## Testing

### 1. Sandbox Accounts
- Sử dụng PayPal Sandbox để test
- Tạo test accounts trong PayPal Developer Dashboard
- Test với các scenarios: success, failure, cancellation

### 2. Test Cards
- PayPal Sandbox cung cấp test cards
- Test với different payment methods
- Test với different currencies

## Production Setup

### 1. PayPal Production Credentials
```tsx
// Thay đổi clientId cho production
const initialOptions: ReactPayPalScriptOptions = {
  clientId: "YOUR_PRODUCTION_CLIENT_ID",
  currency: "USD",
  intent: "capture",
  components: "buttons",
};
```

### 2. Webhook Configuration
- Cấu hình webhook URL trong PayPal Dashboard
- URL: `https://yourdomain.com/api/webhook/paypal`
- Events: `PAYMENT.CAPTURE.COMPLETED`

### 3. Security
- Implement webhook signature verification
- Validate all incoming webhook data
- Use HTTPS for all endpoints

## Error Handling

### 1. PayPal Errors
```tsx
const onError = (error: any) => {
  console.error("PayPal Error:", error);
  toast.error("Có lỗi xảy ra với PayPal");
  onPaymentError(error);
};
```

### 2. Payment Processing Errors
```tsx
const onApprove = async (data: any, actions: any) => {
  try {
    const order = await actions.order.capture();
    const result = await processPayPalPayment({...});
    
    if (result.success) {
      toast.success("Thanh toán PayPal thành công!");
      onPaymentSuccess();
    } else {
      toast.error(result.message);
      onPaymentError(new Error(result.message));
    }
  } catch (error) {
    toast.error("Có lỗi xảy ra khi thanh toán PayPal");
    onPaymentError(error);
  }
};
```

## Monitoring & Analytics

### 1. Console Logs
- PayPal order details
- Payment processing results
- Error logs

### 2. Database Tracking
- Order status updates
- Payment completion timestamps
- User course assignments

## Troubleshooting

### 1. Common Issues
- **PayPal buttons not loading**: Check clientId và network
- **Payment not processing**: Check webhook configuration
- **Currency conversion**: Verify VND to USD conversion rate

### 2. Debug Tips
- Check browser console for PayPal errors
- Verify webhook endpoint is accessible
- Test with different order amounts
- Check PayPal Developer Dashboard for transaction logs

## Future Enhancements

### 1. Advanced Features
- Multiple currency support
- Subscription payments
- Refund handling
- Payment analytics dashboard

### 2. Integration Improvements
- PayPal Express Checkout
- PayPal Credit
- Mobile optimization
- A/B testing for conversion rates

---

**Lưu ý**: Đây là implementation cho sandbox environment. Để deploy production, cần thay đổi clientId và cấu hình webhook properly.
