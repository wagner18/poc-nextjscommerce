import type { CommerceAPI, CommerceAPIConfig } from '@commerce/api'
import { getCommerceApi as commerceApi } from '@commerce/api'
import createFetchStoreApi from './utils/fetch-store'
import createFetchApi from './utils/fetch-local'
import type { RequestInit } from '@vercel/fetch'

// import getAllPages from './operations/get-all-pages'
// import getPage from './operations/get-page'
// import getSiteInfo from './operations/get-site-info'
// import getCustomerWishlist from './operations/get-customer-wishlist'
// import getAllProductPaths from './operations/get-all-product-paths'
// import getAllProducts from './operations/get-all-products'
// import getProduct from './operations/get-product'

// export interface LocalConfig extends CommerceAPIConfig {}
// const config: LocalConfig = {
//   commerceUrl: '',
//   apiToken: '',
//   cartCookie: '',
//   customerCookie: '',
//   cartCookieMaxAge: 2592000,
//   fetch: createFetcher(() => getCommerceApi().getConfig()),
// }
//
// const operations = {
//   getAllPages,
//   getPage,
//   getSiteInfo,
//   getCustomerWishlist,
//   getAllProductPaths,
//   getAllProducts,
//   getProduct,
// }


import {
  API_URL,
  API_TENANT,
  SHOP_CUSTOMER_TOKEN_COOKIE,
  SHOP_CHECKOUT_ID_COOKIE,
} from '../const'

import * as operations from './operations'

if (!API_URL) {
  throw new Error(
    `The environment variable NEXT_PUBLIC_SHOP_STORE_DOMAIN is missing and it's required to access your store`
  )
}

export interface LocalConfig extends CommerceAPIConfig {
  apiTenant: string,
  storeApiFetch<T>(endpoint: string, options?: RequestInit): Promise<T>
}

const ONE_DAY = 60 * 60 * 24

const config: LocalConfig = {
  commerceUrl: API_URL,
  apiTenant: API_TENANT,
  apiToken: '',
  customerCookie: SHOP_CUSTOMER_TOKEN_COOKIE,
  cartCookie: SHOP_CHECKOUT_ID_COOKIE,
  cartCookieMaxAge: ONE_DAY * 30,
  storeApiFetch:  createFetchStoreApi(() => getCommerceApi().getConfig()),
  fetch: createFetchApi(() => getCommerceApi().getConfig()),
}

export const provider = { config, operations }

export type Provider = typeof provider
export type LocalAPI<P extends Provider = Provider> = CommerceAPI<P | any>

export function getCommerceApi<P extends Provider>(
  customProvider: P = provider as any
): LocalAPI<P> {
  return commerceApi(customProvider as any)
}
