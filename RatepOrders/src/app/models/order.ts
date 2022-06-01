import { IOrderComposition } from './orderComposition';

export interface IOrder {
  ClientId: number;
  ContractId: number;
  OrderId: number;
  StatusId: number;
  StatusName: string;
  OrderDate: Date;

  OrderComposition?: IOrderComposition[];
  Sum?: number;
  UI?: {
    Visible: boolean;
  };
}
