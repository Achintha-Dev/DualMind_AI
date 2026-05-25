import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ['user', 'assistant'],
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    _id: false,
    timestamps: true,
  }
);

const conversationSchema = new mongoose.Schema(
  {
    // Owner of conversation
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Auto-generated title from first message
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },

    // Conversation messages
    messages: {
      type: [messageSchema],
      default: [],
    },

    // AI usage tracking
    tokensUsed: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Future model tracking
    model: {
      type: String,
      default: 'gemini-3.1-flash-lite',
    },
  },
  {
    timestamps: true,
  }
);

// Fast user conversation retrieval
conversationSchema.index({ userId: 1, updatedAt: -1 });

const Conversation = mongoose.model('Conversation', conversationSchema);

export default Conversation;