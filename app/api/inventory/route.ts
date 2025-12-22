import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import InventoryItem from '@/models/InventoryItem';

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const year = searchParams.get('year');
        const month = searchParams.get('month');

        let query: any = {};
        if (year) query.year = parseInt(year);
        if (month) query.month = parseInt(month);

        const items = await InventoryItem.find(query).sort({ createdAt: -1 });
        return NextResponse.json(items);
    } catch (error: any) {
        console.error('API GET ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        console.log('API POST REQUEST BODY:', body);
        const newItem = await InventoryItem.create(body);
        return NextResponse.json(newItem, { status: 201 });
    } catch (error: any) {
        console.error('API POST ERROR:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    try {
        await dbConnect();
        const body = await req.json();
        const { id, ...updates } = body;

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        const updatedItem = await InventoryItem.findByIdAndUpdate(id, updates, { new: true });
        return NextResponse.json(updatedItem);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    try {
        await dbConnect();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
        }

        await InventoryItem.findByIdAndDelete(id);
        return NextResponse.json({ message: 'Item deleted successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
