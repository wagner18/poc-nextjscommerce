import type { Product, ProductPrice } from '../types/product'
import type { Cart, LineItem } from '../types/cart'
import type { Category } from '../types/site'

import {
  Checkout,
  CheckoutLineItemEdge,
  SelectedOption,
  ImageConnection,
  ProductVariantConnection,
  MoneyV2,
  ProductOption,
  PageEdge,
  Collection,
} from '../schema'
import { colorMap } from '@lib/colors'

// TODO: Check nextjs-commerce bug if no images are added for a product
const placeholderImg = '/product-img-placeholder.svg'

const money = ({ value, currencyCode }: MoneyV2) => {
  return {
    value: +value,
    currencyCode,
  }
}

const normalizeProductImages = (images) => images?.map(({ src, ...rest }) => ({
    url: src,
    ...rest,
  }))

const normalizeProductOption = ({
  id,
  displayName,
  values,
}: ProductOption) => {
  return {
    __typename: 'MultipleChoiceOption',
    id,
    displayName: displayName.toLowerCase(),
    values: values.map((value) => {
      return {
        label: value.label || '',
        ...(value.hexColors && {
          hexColors: colorMap[value.label?.toLowerCase().replace(/ /g, '')] || value.hexColors
        })
      }
    }),
  }
}

export function normalizeProduct({
  id,
  handle,
  images,
  title,
  body,
  body_html,
  variants,
  collections,
  tax,
  category,
  discount,
  brand,
  ...rest
}): Product {

  // NOTE: get first variant as default variant to extract variant details from hydrogen data model
  const defaultVariant = (variants && variants[0]) ? variants[0] : {}

  const price: ProductPrice = {
    value: Number(defaultVariant.price_unformatted) || 0,
    ...(defaultVariant.currency && { currencyCode: defaultVariant.currency })
  }

  const options = []

  return {
    id,
    name: title || '',
    vendor: brand || '',
    path: handle && `/${handle}`,
    slug: handle,
    price: money(price),
    images: normalizeProductImages(images),
    variants: variants || [],
    options: options
      ? options
          .map((o) => normalizeProductOption(o))
      : [],
    ...(body && { description: body }),
    ...(body_html && { descriptionHtml: body_html }),
    ...rest,
  }
}

export function normalizeCart(checkout: Checkout): Cart {
  return {
    id: checkout.id,
    url: checkout.webUrl,
    customerId: '',
    email: '',
    createdAt: checkout.createdAt,
    currency: {
      code: checkout.totalPriceV2?.currencyCode,
    },
    taxesIncluded: checkout.taxesIncluded,
    lineItems: checkout.lineItems?.map(normalizeLineItem),
    lineItemsSubtotalPrice: +checkout.subtotalPriceV2?.amount,
    subtotalPrice: +checkout.subtotalPriceV2?.amount,
    totalPrice: checkout.totalPriceV2?.amount,
    discounts: [],
  }
}

function normalizeLineItem({
  node: { id, name, variant, quantity },
}: CheckoutLineItemEdge): LineItem {
  return {
    id,
    variantId: String(variant?.id),
    productId: String(variant?.product_id),
    name: `${name}`,
    quantity,
    variant: {
      id: String(variant?.id),
      sku: variant?.sku ?? '',
      name: variant?.name!,
      image: {
        url: variant?.image?.url || '/product-img-placeholder.svg',
      },
      requiresShipping: variant?.requiresShipping ?? false,
      price: variant?.price_unformatted,
      listPrice: variant?.price_unformatted,
    },
    path: String(variant?.product?.handle),
    discounts: [],
    options: variant?.name == 'Default Title' ? [] : variant?.selectedOptions,
  }
}

export const normalizeCategory = ({
  title: name,
  handle,
  id,
}: Collection): Category => ({
  id,
  name,
  slug: handle,
  path: `/${handle}`,
})
