import { IOrder } from './order';
import { ISpecification } from './specification';

export interface IContract {
  ClientId: number;
  ContractId: number;
  UserId?: number;
  INN: string;
  Fullname?: string;
  Name?: string;
  Number: string;
  StatusId?: number;
  StatusName: string;
  StartDate: Date;
  EndDate: Date;

  Specification?: ISpecification[];
  Orders?: IOrder[];
  Sum?: number;
  UI?: {
    Visible: boolean;
  };
}
