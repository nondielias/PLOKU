import { CartItem } from '../types';

export interface CheckoutDetails {
  customerName?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  notes?: string;
}

/**
 * Builds a structured, beautifully formatted WhatsApp order message
 */
export function generateWhatsAppOrderMessage(
  storeName: string,
  items: CartItem[],
  details: CheckoutDetails = {}
): string {
  const timestamp = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const orderId = `PLK-${Math.floor(100000 + Math.random() * 900000)}`;

  const totalAmount = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  let message = `⚡ *NEW ORDER REQUEST — ${storeName.toUpperCase()}*\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `🏷️ *Order Ref:* #${orderId}\n`;
  message += `📅 *Date:* ${timestamp}\n`;

  if (details.customerName?.trim()) {
    message += `👤 *Customer:* ${details.customerName.trim()}\n`;
  }
  if (details.deliveryAddress?.trim()) {
    message += `📍 *Delivery Address:* ${details.deliveryAddress.trim()}\n`;
  }
  if (details.notes?.trim()) {
    message += `💬 *Notes:* ${details.notes.trim()}\n`;
  }

  message += `\n🛒 *ORDER ITEMS (${items.length}):*\n`;
  items.forEach((item, idx) => {
    const itemTotal = item.product.price * item.quantity;
    message += `${idx + 1}. *${item.product.name}*\n`;
    message += `   ↳ Qty: ${item.quantity} × $${item.product.price.toLocaleString()} = *$${itemTotal.toLocaleString()}*\n`;
    if (item.product.category) {
      message += `   ↳ Cat: ${item.product.category}\n`;
    }
  });

  message += `\n━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `💳 *TOTAL AMOUNT: $${totalAmount.toLocaleString()} USD*\n`;
  message += `🚚 *Shipping:* Standard Express (Tracked)\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━\n\n`;
  message += `Please verify item availability and share payment instructions (Card/Transfer/COD). Thank you!`;

  return message;
}

/**
 * Generates the WhatsApp wa.me link
 */
export function createWhatsAppCheckoutLink(
  phoneNumber: string,
  storeName: string,
  items: CartItem[],
  details: CheckoutDetails = {}
): string {
  // Strip out spaces, dashes, parentheses, or '+' to get digits
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '');
  const message = generateWhatsAppOrderMessage(storeName, items, details);
  const encodedText = encodeURIComponent(message);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}
