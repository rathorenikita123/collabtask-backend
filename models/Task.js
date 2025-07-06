import { Schema, model } from 'mongoose';

const taskSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  column: { type: Schema.Types.ObjectId, ref: 'Column', required: true },
  board: { type: Schema.Types.ObjectId, ref: 'Board', required: true },
  assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
  dueDate: Date,
  attachments: [{ filename: String, url: String }],
  comments: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }],
  order: { type: Number, default: 0 } // for drag-and-drop sorting
}, { timestamps: true });

export default model('Task', taskSchema);
