import type { LocalConfig } from '../index'
import { Product } from '@commerce/types/product'
import { GetProductOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'

import { normalizeProduct } from '../../utils'

export default function getProductOperation({
  commerce,
}: OperationContext<any>) {
  async function getProduct<T extends GetProductOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<LocalConfig>
    preview?: boolean
  } = {}): Promise<Product | {} | any> {

    const { storeApiFetch, locale } = commerce.getConfig(config)

    const { product, ...rest }  = await storeApiFetch({
      query,
      variables,
      fetchOptions: {
        ...(locale && {
          headers: {
            'Accept-Language': locale,
          },
        }),
      }
    })

    return {
      product: normalizeProduct(product),
    }
  }

  return getProduct
}
