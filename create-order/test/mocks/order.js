export const stringifiedOrder = '{\"billing\":{\"address1\":\"1 gotham way\",\"city\":\"Gotham\",\"state\":\"WA\",\"postal\":\"12345\"},\"email\":\"keivn@test.com\",\"products\":[{\"sku\":\"1000\",\"name\":\"Test product 1\",\"price\":\"5.00\",\"quantity\":\"2\"},{\"sku\":\"1001\",\"name\":\"Test product 2\",\"price\":\"5.00\",\"quantity\":\"1\"},{\"sku\":\"1002\",\"name\":\"Test product 3\",\"price\":\"10.00\",\"quantity\":\"1\"}],\"shipping\":{\"address1\":\"1 gotham way\",\"city\":\"Gotham\",\"state\":\"WA\",\"postal\":\"12345\"},\"tax\":\"2.50\",\"total\":\"25.00\"}';

export const order = {
  billing: {
    address1: '1 gotham way',
    city: 'Gotham',
    state: 'WA',
    postal: '12345',
  },
  email: 'keivn@test.com',
  products: [
    {
      sku: '1000',
      name: 'Test product 1',
      price: '5.00',
      quantity: '2',
    },
    {
      sku: '1001',
      name: 'Test product 2',
      price: '5.00',
      quantity: '1',
    },
    {
      sku: '1002',
      name: 'Test product 3',
      price: '10.00',
      quantity: '1',
    },
  ],
  shipping: {
    address1: '1 gotham way',
    city: 'Gotham',
    state: 'WA',
    postal: '12345',
  },
  tax: '2.50',
  total: '25.00',
}

export default order;
