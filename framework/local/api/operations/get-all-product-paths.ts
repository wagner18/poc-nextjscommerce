import type { LocalConfig } from '../index'
import type { OperationContext } from '@commerce/api/operations'
import data from '../../data.json'

export type GetAllProductPathsResult = {
  products: Array<{ path: string }>
}

export default function getAllProductPathsOperation({ commerce }: OperationContext<any>) {
  async function getAllProductPaths({
    config
  }: {
    config?: Partial<LocalConfig>
  } = {}): Promise<GetAllProductPathsResult> {

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

    return Promise.resolve({
      products: products.map(({ handle }) => ({ path: handle && `/${handle}`, })),
    })
  }

  return getAllProductPaths
}
