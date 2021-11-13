// @flow

export type Order = {
  billing: string,
  email: string,
  products: [
    {
      sku: string,
      quantity: string,
      options: {
        sizes: string,
      },
    },
  ],
  shipping: string,
  tax: string,
  total: string,
};
