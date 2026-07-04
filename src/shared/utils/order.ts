import { Order } from '../dtos/query.dto';

export const getOrderOption = (order: Order): 1 | -1 => {
  return order === Order.Desc ? -1 : 1;
};
