import { Fetcher } from '@commerce/utils/types'
import { API_URL, API_TENANT } from './const'
import { getToken, handleFetchResponse } from './utils'

const fetcher: Fetcher = async ({ url = API_URL, method = 'GET', variables, query }) => {

    const { locale, ...vars } = variables ?? {}    

    return handleFetchResponse(
      await fetch(url, {
        method,
        headers: {
          'X-TENANT-DOMAIN': API_TENANT!,
          'Content-Type': 'application/json',
          ...(locale && {
            'Accept-Language': locale,
          }),
        },
      })
    )
}

export default fetcher
