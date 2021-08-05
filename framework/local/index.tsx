import * as React from 'react'
import { ReactNode } from 'react'
import { localProvider } from './provider'
import {
  CommerceConfig,
  CommerceProvider as CoreCommerceProvider,
  useCommerce as useCoreCommerce,
} from '@commerce'

import { SHOP_CHECKOUT_ID_COOKIE } from './const'

export const localConfig: CommerceConfig = {
  locale: 'en-US',
  cartCookie: 'SHOP_CHECKOUT_ID_COOKIE',
}

export function CommerceProvider({
  children,
  ...config
}: {
  children?: ReactNode
  locale: string
} & Partial<CommerceConfig>) {
  return (
    <CoreCommerceProvider
      provider={localProvider}
      config={{ ...localConfig, ...config }}
    >
      {children}
    </CoreCommerceProvider>
  )
}

export const useCommerce = () => useCoreCommerce()
