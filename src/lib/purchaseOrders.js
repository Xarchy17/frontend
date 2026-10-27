export const total = (purchaseOrder) =>
  purchaseOrder.items.reduce((sum, item) => sum + item.q * item.p, 0) * 1.1

export const kg = (purchaseOrder) =>
  purchaseOrder.items.reduce((sum, item) => sum + item.q, 0)
