'use client';

import React from 'react';

interface MonthYearSelectorProps {
    year: number;
    month: number;
    onYearChange: (year: number) => void;
    onMonthChange: (month: number) => void;
    viewMode: 'monthly' | 'yearly';
    onViewModeChange: (mode: 'monthly' | 'yearly') => void;
}

export function MonthYearSelector({
    year,
    month,
    onYearChange,
    onMonthChange,
    viewMode,
    onViewModeChange
}: MonthYearSelectorProps) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

    return (
        <div className="selector-container">
            <div className="view-mode-toggle">
                <button
                    className={viewMode === 'monthly' ? 'active' : ''}
                    onClick={() => onViewModeChange('monthly')}
                >
                    Monthly View
                </button>
                <button
                    className={viewMode === 'yearly' ? 'active' : ''}
                    onClick={() => onViewModeChange('yearly')}
                >
                    Yearly View
                </button>
            </div>

            <div className="date-selectors">
                <select value={year} onChange={(e) => onYearChange(parseInt(e.target.value))}>
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>

                {viewMode === 'monthly' && (
                    <select value={month} onChange={(e) => onMonthChange(parseInt(e.target.value))}>
                        {months.map((m, i) => (
                            <option key={m} value={i + 1}>{m}</option>
                        ))}
                    </select>
                )}
            </div>
        </div>
    );
}
