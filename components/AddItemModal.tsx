'use client';

import React, { useState } from 'react';
import { InventoryItem } from '../types/inventory';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: Omit<InventoryItem, 'id'>) => void;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
    const [formData, setFormData] = useState({
        itemName: '',
        unitPrice: 0,
        quantityInHand: 0,
        quantitySold: 0
    });

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.itemName.trim()) return;
        onAdd(formData);
        setFormData({ itemName: '', unitPrice: 0, quantityInHand: 0, quantitySold: 0 });
        onClose();
    };

    const inventoryValue = formData.unitPrice * formData.quantityInHand;
    const salesValue = formData.unitPrice * formData.quantitySold;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content luxury-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-badge">360_LUXURY</div>
                    <h2>New Inventory Entry</h2>
                    <p style={{ color: 'var(--fg-muted)' }}>Meticulously track your latest luxury acquisition.</p>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-group luxury-input-group">
                        <label>ITEM NAME</label>
                        <input
                            type="text"
                            required
                            autoFocus
                            placeholder="e.g. Diamond Chronograph"
                            value={formData.itemName}
                            onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                        <div className="form-group luxury-input-group">
                            <label>UNIT PRICE (₵)</label>
                            <div className="input-with-symbol">
                                <span className="currency-symbol">₵</span>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    required
                                    value={formData.unitPrice || ''}
                                    onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                                />
                            </div>
                        </div>
                        <div className="form-group luxury-input-group">
                            <label>QTY IN HAND</label>
                            <input
                                type="number"
                                min="0"
                                required
                                value={formData.quantityInHand || ''}
                                onChange={(e) => setFormData({ ...formData, quantityInHand: parseInt(e.target.value) || 0 })}
                            />
                        </div>
                    </div>

                    <div className="form-group luxury-input-group">
                        <label>QTY SOLD</label>
                        <input
                            type="number"
                            min="0"
                            required
                            value={formData.quantitySold || ''}
                            onChange={(e) => setFormData({ ...formData, quantitySold: parseInt(e.target.value) || 0 })}
                        />
                    </div>

                    <div className="valuation-card">
                        <div className="valuation-item">
                            <div className="label">PORTFOLIO VALUE</div>
                            <div className="value">₵{inventoryValue.toLocaleString()}</div>
                        </div>
                        <div className="divider"></div>
                        <div className="valuation-item text-right">
                            <div className="label">SALES REALIZED</div>
                            <div className="value">₵{salesValue.toLocaleString()}</div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="btn-luxury-secondary" onClick={onClose}>
                            Dismiss
                        </button>
                        <button type="submit" className="btn-luxury-primary">
                            Add to Inventory
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
