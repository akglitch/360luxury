export type InventoryStatus = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface InventoryItem {
    id: string;
    _id?: string;
    itemName: string;
    unitPrice: number;
    quantityInHand: number;
    quantitySold: number;
}

export interface InventoryItemWithCalculations extends InventoryItem {
    inventoryValue: number;
    salesValue: number;
    status: InventoryStatus;
}

export interface MonthlyInventory {
    [month: string]: InventoryItem[];
}

export interface YearlyInventory {
    [year: string]: MonthlyInventory;
}

export type ViewMode = 'monthly' | 'yearly';
