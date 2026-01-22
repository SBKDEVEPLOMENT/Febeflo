import { WebpayPlus, Options, Environment } from 'transbank-sdk';

export function getWebpayTransaction() {
  const commerceCode = process.env.NEXT_PUBLIC_WEBPAY_COMMERCE_CODE || process.env.WEBPAY_COMMERCE_CODE;
  const apiKey = process.env.NEXT_PUBLIC_WEBPAY_API_KEY || process.env.WEBPAY_API_KEY;
  const env = process.env.NEXT_PUBLIC_WEBPAY_ENV || process.env.WEBPAY_ENV;

  if (env === 'production' && commerceCode && apiKey) {
    return new WebpayPlus.Transaction(new Options(commerceCode, apiKey, Environment.Production));
  } else {
    // Default to Integration (Test Mode)
    return WebpayPlus.Transaction.buildForIntegration(
      "597055555532",
      "579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C"
    );
  }
}
