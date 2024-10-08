import mongoose from 'mongoose';

export interface OrderItemAttrs {
	item_id: mongoose.Schema.Types.ObjectId;
	item_option: mongoose.Schema.Types.ObjectId;
	quanlity: number;
}

export interface OrderItemDoc extends mongoose.Document {
	id: mongoose.Schema.Types.ObjectId;
	item_id: mongoose.Schema.Types.ObjectId;
	item_option: mongoose.Schema.Types.ObjectId;
	quanlity: number;
}

export const orderItemSchema = new mongoose.Schema({
	item_id: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	item_option: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
	},
	quanlity: {
		type: Number,
		required: true,
		default: 0,
	},
});
