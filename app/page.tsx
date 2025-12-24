'use client';

import { useState, useEffect } from 'react';
import { useInventory } from '../hooks/useInventory';
import { InventoryTable } from '../components/InventoryTable';
import { MonthYearSelector } from '../components/MonthYearSelector';
import { AddItemModal } from '../components/AddItemModal';
import { ViewMode } from '../types/inventory';
import Image from 'next/image';
export default function Home() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [viewMode, setViewMode] = useState<ViewMode>('monthly');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = savedTheme || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const {
    monthlyItems,
    yearlyItems,
    addItem,
    updateItem,
    deleteItem,
    isLoaded
  } = useInventory(year, month);

  const currentItems = viewMode === 'monthly' ? monthlyItems : yearlyItems;

  const totalInventoryValue = currentItems.reduce((sum, item) => sum + item.inventoryValue, 0);
  const totalSalesValue = currentItems.reduce((sum, item) => sum + item.salesValue, 0);

  const formatCurrency = (value: number) => {
    return '₵' + value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!isLoaded) {
    return (
      <div className="main-container">
        <div style={{ textAlign: 'center', marginTop: '10rem' }}>
          <div className="logo" style={{ marginBottom: '2rem' }}><Image src="/logo.png" alt="360_luxury Logo" width={100} height={80} /></div>
          <p style={{ color: 'var(--fg-muted)', letterSpacing: '0.2em' }}>360 LUXURY</p>
        </div>
      </div>
    );
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <main className="main-container">
      <div className="print-header">
       <Image src="/logo.png" alt="360_luxury Logo" width={100} height={80} />
        <p>{viewMode === 'monthly' ? `${monthNames[month - 1]} ${year}` : `Yearly Report ${year}`}</p>
      </div>

      <header>
        <div className="logo">360_luxury</div>
        <div className="header-actions">
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme">
            {theme === 'light' ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>
            )}
          </button>
          {viewMode === 'monthly' && (
            <button className="add-btn" onClick={() => setIsModalOpen(true)}>
              <span style={{ fontSize: '1.5rem', lineHeight: '1' }}>+</span> Add New Item
            </button>
          )}
        </div>
      </header>

      <div className="summary-cards">
        <div className="summary-card">
          <div className="label">Managed Items</div>
          <div className="value">{currentItems.length}</div>
        </div>
        <div className="summary-card">
          <div className="label">Portfolio Value</div>
          <div className="value">{formatCurrency(totalInventoryValue)}</div>
        </div>
        <div className="summary-card">
          <div className="label">Realized Sales</div>
          <div className="value">{formatCurrency(totalSalesValue)}</div>
        </div>
      </div>

      <MonthYearSelector
        year={year}
        month={month}
        onYearChange={setYear}
        onMonthChange={setMonth}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <InventoryTable
        items={currentItems}
        onUpdate={updateItem}
        onDelete={deleteItem}
        isYearlyView={viewMode === 'yearly'}
      />

      <div className="controls-footer">
        <button className="print-btn" onClick={handlePrint}>
          Print {viewMode === 'monthly' ? 'Monthly' : 'Yearly'} Report
        </button>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={addItem}
      />
    </main>
  );
}
