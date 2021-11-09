// @flow

export type Address = {
  address1: string,
  address2: string,
  city: string,
  country: string,
  state: string,
  zip: string,
}

export type Order = {
  items: Array<{
    name: string,
    quantity: number,
    price: number,
  }>,
}
