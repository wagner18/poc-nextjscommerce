import Cookies, { CookieAttributes } from 'js-cookie'
import { SHOP_COOKIE_EXPIRE, SHOP_CUSTOMER_TOKEN_COOKIE } from '../const'

export const getCustomerToken = () => Cookies.get(SHOP_CUSTOMER_TOKEN_COOKIE)

export const setCustomerToken = (
  token: string | null,
  options?: CookieAttributes
) => {
  if (!token) {
    Cookies.remove(SHOP_CUSTOMER_TOKEN_COOKIE)
  } else {
    Cookies.set(
      SHOP_CUSTOMER_TOKEN_COOKIE,
      token,
      options ?? {
        expires: SHOP_COOKIE_EXPIRE,
      }
    )
  }
}
