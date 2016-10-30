"use strict";

import { Component, OnInit } from "@angular/core";

import { GridOptions } from "ag-grid/main";
import RefData from "./refData";
import { IItemInfo } from "./itemInfo";
import { OrderService } from "./order.service";

@Component({
    selector: "order-app",
    providers: [OrderService],
    templateUrl: "../html/order-app.html"
})
export class AppComponent implements OnInit {
    private gridOptions: GridOptions;
    private rowData: any[];
    private columnDefs: any[];
    private rowCount: string;
    private selectedItem: IItemInfo;

    constructor(private _orderService: OrderService) {
        // we pass an empty gridOptions in, so we can grab the api out
        this.gridOptions = <GridOptions>{};
        this.createColumnDefs();
    }

    ngOnInit() {
        this.loadData();
    }

    private loadData() {
        this._orderService.getOrders()
            .then((orders: any) => this.rowData = orders);
    }

    private createColumnDefs() {
        this.columnDefs = [
            {
                headerName: "Order",
                children: [
                    {
                        headerName: "ID", field: "id",
                        width: 30, pinned: true
                    },
                    {
                        headerName: "Date", field: "date",
                        width: 80, pinned: true
                    },
                    {
                        headerName: "Total", field: "orderTotal",
                        width: 80,
                        cellRenderer: function(params: any) {
                            return "$" + params.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        }, pinned: true
                    },
                ]
            },
            {
                headerName: "Customer",
                children: [
                    {
                        headerName: "Name", field: "name",
                        width: 150, pinned: true
                    },
                    {
                        headerName: "Country", field: "country", width: 150,
                        cellRenderer: AppComponent.countryCellRenderer, pinned: true,
                        filterParams: { cellRenderer: AppComponent.countryCellRenderer, cellHeight: 20 }
                    },
                ]
            },
            {
                headerName: "Contact",
                children: [
                    { headerName: "Phone", field: "phone", width: 150, filter: "text" },
                    { headerName: "Address", field: "address", width: 500, filter: "text" }
                ]
            }
        ];
    }

    private calculateRowCount() {
        if (this.rowData) {
            this.rowCount = this.rowData.length.toLocaleString();
        }
    }

    private onModelUpdated() {
        this.calculateRowCount();
    }

    private onReady() {
        this.calculateRowCount();
    }

    private onRowClicked($event:any) {
        this.selectedItem = $event.node.data;
    }

    private onQuickFilterChanged($event:any) {
        this.gridOptions.api.setQuickFilter($event.target.value);
    }

    private updateOrderTotal($event: any) {
        let id = this.selectedItem.id;

        var updatedNodes = [];
        this.gridOptions.api.forEachNode(function (node:any) {
            let data = node.data;
            if (data.id === id) {
                data.orderTotal = $event;
                updatedNodes.push(node);
            }
        });

        this.gridOptions.api.refreshCells(updatedNodes, ["orderTotal"]);
    }

    private static countryCellRenderer(params: any) {
        var flag = "<img border='0' width='15' height='10' style='margin-bottom: 2px' src='../images/flags/" +
            RefData.COUNTRY_CODES[params.value] + ".png'>";
        return flag + " " + params.value;
    }
}
