'use client';

import React from 'react';
import { InventoryItemWithCalculations } from '../types/inventory';

interface InventoryTableProps {
    items: InventoryItemWithCalculations[];
    onUpdate: (id: string, updates: any) => void;
    onDelete: (id: string) => void;
    isYearlyView: boolean;
}

export function InventoryTable({ items, onUpdate, onDelete, isYearlyView }: InventoryTableProps) {
    const formatCurrency = (value: number) => {
        return '₵' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'In Stock': return 'status-in-stock';
            case 'Low Stock': return 'status-low-stock';
            case 'Out of Stock': return 'status-out-of-stock';
            default: return '';
        }
    };

    return (
        <div className="table-container">
            <table className="inventory-table">
                <thead>
                    <tr>
                        <th style={{ minWidth: '250px' }}>Item Name</th>
                        <th style={{ width: '150px' }}>Unit Price</th>
                        <th style={{ width: '150px' }}>Qty in Hand</th>
                        <th style={{ width: '150px' }}>Qty Sold</th>
                        <th>Inventory Value</th>
                        <th>Sales Value</th>
                        <th>Status</th>
                        {!isYearlyView && <th style={{ textAlign: 'center' }}>Actions</th>}
                    </tr>
                </thead>
                <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <input
                                    type="text"
                                    value={item.itemName}
                                    onChange={(e) => onUpdate(item.id, { itemName: e.target.value })}
                                    placeholder="Item name..."
                                    disabled={isYearlyView}
                                />
                            </td>
                            <td>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--fg-muted)', marginRight: '4px' }}>₵</span>
                                    <input
                                        type="number"
                                        value={item.unitPrice || ''}
                                        onChange={(e) => onUpdate(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                                        disabled={isYearlyView}
                                    />
                                </div>
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={item.quantityInHand}
                                    onChange={(e) => onUpdate(item.id, { quantityInHand: parseInt(e.target.value) || 0 })}
                                    disabled={isYearlyView}
                                />
                            </td>
                            <td>
                                <input
                                    type="number"
                                    value={item.quantitySold}
                                    onChange={(e) => onUpdate(item.id, { quantitySold: parseInt(e.target.value) || 0 })}
                                    disabled={isYearlyView}
                                />
                            </td>
                            <td className="calculated-field">{formatCurrency(item.inventoryValue)}</td>
                            <td className="calculated-field">{formatCurrency(item.salesValue)}</td>
                            <td>
                                <span className={`status-badge ${getStatusColor(item.status)}`}>
                                    {item.status}
                                </span>
                            </td>
                            {!isYearlyView && (
                                <td style={{ textAlign: 'center' }}>
                                    <button onClick={() => onDelete(item.id)} className="delete-btn">Delete</button>
                                </td>
                            )}
                        </tr>
                    ))}
                    {items.length === 0 && (
                        <tr>
                            <td colSpan={isYearlyView ? 7 : 8} className="empty-row"> No luxury items found for this period. </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
