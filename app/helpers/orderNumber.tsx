export function generateOrderNumber(): string {
  const prefix = 'ORD';
  const timestamp = Date.now().toString();
  const orderNumber = `${prefix}-${timestamp}`;
  return orderNumber;
}
