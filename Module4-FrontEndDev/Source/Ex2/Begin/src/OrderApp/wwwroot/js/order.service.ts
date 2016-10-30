import { Injectable } from '@angular/core';

import MockOrders from "./mock-orders";
import {IItemInfo} from "./itemInfo";

@Injectable()
export class OrderService {
    getOrders(): Promise<IItemInfo[]> {
        return Promise.resolve(MockOrders.getOrders());
    }

    getOrderDetails(id: number): Promise<any> {
        return Promise.resolve(MockOrders.getOrderDetails(id));
    }

    updateOrderDetails(orderDetails: any): Promise<any> {
        return Promise.resolve(orderDetails);
    }
}