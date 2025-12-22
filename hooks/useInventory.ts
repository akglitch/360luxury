'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { InventoryItem, InventoryItemWithCalculations } from '../types/inventory';

export function useInventory(year: number, month: number) {
    const [items, setItems] = useState<InventoryItem[]>([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch items from MongoDB via API
    const fetchItems = useCallback(async () => {
        try {
            const response = await fetch(`/api/inventory?year=${year}&month=${month}`);
            if (!response.ok) throw new Error('Failed to fetch inventory');
            const data = await response.json();
            setItems(data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoaded(true);
        }
    }, [year, month]);

    useEffect(() => {
        fetchItems();
    }, [fetchItems]);

    const calculateItem = (item: InventoryItem): InventoryItemWithCalculations => {
        // Ensure we handle both MongoDB _id and localized id
        const itemId = item._id || item.id;
        const unitPrice = Number(item.unitPrice) || 0;
        const quantityInHand = Number(item.quantityInHand) || 0;
        const quantitySold = Number(item.quantitySold) || 0;

        const inventoryValue = unitPrice * quantityInHand;
        const salesValue = unitPrice * quantitySold;

        let status: 'In Stock' | 'Low Stock' | 'Out of Stock' = 'In Stock';
        if (quantityInHand === 0) status = 'Out of Stock';
        else if (quantityInHand <= 5) status = 'Low Stock';

        return {
            ...item,
            id: itemId, // Use _id as the primary id for the UI
            unitPrice,
            quantityInHand,
            quantitySold,
            inventoryValue,
            salesValue,
            status
        };
    };

    const monthlyItems = useMemo(() => {
        return items.map(calculateItem);
    }, [items]);

    // For Yearly View, we'll fetch all items for the year
    const [yearlyRawItems, setYearlyRawItems] = useState<InventoryItem[]>([]);
    useEffect(() => {
        const fetchYearly = async () => {
            try {
                const response = await fetch(`/api/inventory?year=${year}`);
                if (!response.ok) throw new Error('Failed to fetch yearly inventory');
                const data = await response.json();
                setYearlyRawItems(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchYearly();
    }, [year]);

    const yearlyItems = useMemo(() => {
        return yearlyRawItems.map(calculateItem);
    }, [yearlyRawItems]);

    // Add new item to MongoDB
    const addItem = useCallback(async (itemData: Omit<InventoryItem, 'id'>) => {
        try {
            const response = await fetch('/api/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...itemData,
                    year,
                    month
                })
            });

            if (!response.ok) throw new Error('Failed to add item');

            // Refresh list
            fetchItems();
        } catch (err: any) {
            setError(err.message);
        }
    }, [year, month, fetchItems]);

    // Update item in MongoDB
    const updateItem = useCallback(async (id: string, updates: Partial<InventoryItem>) => {
        try {
            const response = await fetch('/api/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    ...updates
                })
            });

            if (!response.ok) throw new Error('Failed to update item');

            // Optimistic update
            setItems(prev => prev.map(item => (item._id === id || item.id === id) ? { ...item, ...updates } : item));
        } catch (err: any) {
            setError(err.message);
        }
    }, []);

    // Delete item from MongoDB
    const deleteItem = useCallback(async (id: string) => {
        try {
            const response = await fetch(`/api/inventory?id=${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete item');

            setItems(prev => prev.filter(item => (item._id !== id && item.id !== id)));
        } catch (err: any) {
            setError(err.message);
        }
    }, []);

    return {
        monthlyItems,
        yearlyItems,
        addItem,
        updateItem,
        deleteItem,
        isLoaded,
        error
    };
}
