import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';

//import "rxjs/Rx"; // adds ALL RxJS statics & operators to Observable

// Statics
import 'rxjs/add/observable/throw';

// Operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import 'rxjs/add/operator/toPromise';


import MockOrders from "./mock-orders";
import {IItemInfo} from "./itemInfo";

@Injectable()
export class OrderService {
    private orderEndpoint = "/api/orders/";
    private orderDetailsEndpoint = "/api/orderDetails/";

    constructor(private http: Http) {
    }

    getOrders(): Promise<IItemInfo[]> {
        var headers = new Headers();
        headers.append("If-Modified-Since", "Mon, 27 Mar 1972 00:00:00 GMT");

        return this.http.get(this.orderEndpoint, { headers: headers })
            .map((res: Response) => <IItemInfo[]>res.json())
            .toPromise();
    }

    getOrderDetails(id: number): Promise<any> {
        var headers = new Headers();
        headers.append("If-Modified-Since", "Mon, 27 Mar 1972 00:00:00 GMT");
        let options = new RequestOptions({ headers: headers });

        return this.http.get(this.orderEndpoint + id, options)
            .map((res: Response) => res.json())
            .toPromise();
    }

    updateOrderDetails(orderDetails: any): Promise<any> {
        let body = JSON.stringify(orderDetails);
        let headers = new Headers({ "Content-Type": "application/json" });
        let options = new RequestOptions({ headers: headers });

        return this.http.put(this.orderDetailsEndpoint + orderDetails.orderDetailsId, body, options)
            .toPromise();
    }
}