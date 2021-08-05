import type { Response } from '@vercel/fetch'
import type { LocalConfig } from '../index'
import fetch from './fetch'

const createFetchStoreApi = <T>(getConfig: () => LocalConfig) => async ({
    query,
    variables,
    fetchOptions
  }: {
    query: string
    variables?: any
    fetchOptions: any
  }): Promise<T> => {

    const config = getConfig()
    let res: Response

    const commerceUrl = query ? `${config.commerceUrl}/${query}` : config.commerceUrl

    try {
      res = await fetch(commerceUrl, {
        ...fetchOptions,
        headers: {
          ...fetchOptions?.headers,
          'Content-Type': 'application/json',
          'X-TENANT-DOMAIN': config.apiTenant,
        },
      })

    } catch (error) {
      throw new Error(
        `Fetch failed: ${error.message}`
      )
    }

    const contentType = res.headers.get('Content-Type')
    const isJSON = contentType?.includes('application/json')

    if (!res.ok) {
      const data = isJSON ? await res.json() : await getTextOrNull(res)
      const headers = getRawHeaders(res)
      const msg = `API error (${
        res.status
      }) \nHeaders: ${JSON.stringify(headers, null, 2)}\n${
        typeof data === 'string' ? data : JSON.stringify(data, null, 2)
      }`

      throw new Error(msg)
    }

    if (res.status !== 204 && !isJSON) {
      throw new Error(
        `Fetch API failed, expected JSON content but found: ${contentType}`
      )
    }

    // If something was removed, the response will be empty
    return res.status === 204 ? null : await res.json()
  }

export default createFetchStoreApi

function getRawHeaders(res: Response) {
  const headers: { [key: string]: string } = {}

  res.headers.forEach((value, key) => {
    headers[key] = value
  })

  return headers
}

function getTextOrNull(res: Response) {
  try {
    return res.text()
  } catch (err) {
    return null
  }
}
