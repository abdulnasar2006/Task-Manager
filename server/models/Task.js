import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['todo', 'in_progress', 'completed'],
    default: 'todo',
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium',
  },
  dueDate: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    default: 'Other',
  },
  ownerId: {
    type: String,
    required: true,
  },
  ownerEmail: {
    type: String,
    default: '',
  }
}, { timestamps: true });

// Ensure virtuals are included in JSON output
TaskSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Task', TaskSchema);
