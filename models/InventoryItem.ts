import mongoose, { Schema } from 'mongoose';

const InventoryItemSchema = new Schema({
    itemName: {
        type: String,
        required: true,
    },
    unitPrice: {
        type: Number,
        required: true,
        default: 0,
    },
    quantityInHand: {
        type: Number,
        required: true,
        default: 0,
    },
    quantitySold: {
        type: Number,
        required: true,
        default: 0,
    },
    year: {
        type: Number,
        required: true,
    },
    month: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
});

export default mongoose.models.InventoryItem || mongoose.model('InventoryItem', InventoryItemSchema);
