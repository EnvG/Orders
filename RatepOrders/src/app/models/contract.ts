import { Order } from './order';
import { ISpecification } from './specification';

export interface IContract {
  ClientId: number;
  ContractId: number;
  UserId?: number;
  INN: string;
  Fullname?: string;
  Name?: string;
  Number: string;
  StatusName: string;
  StartDate: Date;
  EndDate: Date;

  Specification?: ISpecification[];
  Orders?: Order[];
  Sum?: number;
  UI?: {
    Visible: boolean;
  };
}
