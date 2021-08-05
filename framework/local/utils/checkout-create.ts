import Cookies from 'js-cookie'

import {
  SHOP_CHECKOUT_COOKIE,
  SHOP_CHECKOUT_ID_COOKIE,
  SHOP_CHECKOUT_URL_COOKIE,
  SHOP_COOKIE_EXPIRE,
} from '../const'

import { CheckoutCreatePayload } from '../schema'

export const checkoutCreate = async (
  fetch: any
): Promise<CheckoutCreatePayload> => {

  const checkout = await Promise.resolve({
    id: Math.random().toString(32).substr(2, 12),
    webUrl: 'checkout.url.com',
    customerId: '',
    email: '',
    createdAt: Date(),
    currency: {
      code: 'USD',
    },
    taxesIncluded: false,
    lineItems: [],
    lineItemsSubtotalPrice: 0,
    subtotalPrice: 0,
    totalPrice: 0,
    discounts: [],
  })

  const checkoutId = checkout?.id

  if (checkoutId) {
    const options = {
      expires: SHOP_COOKIE_EXPIRE,
    }
    Cookies.set(SHOP_CHECKOUT_COOKIE, checkout, options)
    Cookies.set(SHOP_CHECKOUT_ID_COOKIE, checkoutId, options)
    Cookies.set(SHOP_CHECKOUT_URL_COOKIE, checkout.webUrl, options)
  }

  return checkout
}

export default checkoutCreate
