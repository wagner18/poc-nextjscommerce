import { Product } from '@commerce/types/product'
import { GetAllProductsOperation } from '@commerce/types/product'
import type { OperationContext } from '@commerce/api/operations'

import { normalizeProduct } from '../../utils'

import type { LocalConfig } from '../index'
// import data from '../../data.json'

export default function getAllProductsOperation({
  commerce,
}: OperationContext<any>) {
  async function getAllProducts<T extends GetAllProductsOperation>({
    query = '',
    variables,
    config,
  }: {
    query?: string
    variables?: T['variables']
    config?: Partial<LocalConfig>
    preview?: boolean
  } = {}): Promise<{ products: Product[] | any[] }> {

    const { storeApiFetch, locale } = commerce.getConfig(config)

    const { products, ...rest } = await storeApiFetch({
      fetchOptions: {
        ...(locale && {
          headers: {
            'Accept-Language': locale,
          },
        }),
      }
    })

    // apply first fielter from variables
    const prods = (variables.first && variables.first > 0) ? products.slice(0, variables.first) : products

    return {
      products: prods.map((p: any) => normalizeProduct(p)),
    }
  }
  return getAllProducts
}
