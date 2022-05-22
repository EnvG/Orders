import { OrderComposition } from './orderComposition';

export interface Order {
  ClientId: number;
  ContractId: number;
  OrderId: number;
  StatusName: string;
  OrderDate: Date;

  OrderComposition?: OrderComposition[];
  Sum?: number;
  UI?: {
    Visible: boolean;
  };
}
