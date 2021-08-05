import Cookies from 'js-cookie'
import { SHOP_CHECKOUT_ID_COOKIE } from '../const'

const getCheckoutId = (id?: string) => {
  return id ?? Cookies.get(SHOP_CHECKOUT_ID_COOKIE)
}

export default getCheckoutId
