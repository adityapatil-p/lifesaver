import mongoose from 'mongoose'

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please add a task title'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['critical', 'high', 'medium', 'low'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['todo', 'in-progress', 'completed'],
      default: 'todo',
    },
    deadline: {
      type: Date,
      required: [true, 'Please add a deadline date and time'],
    },
    category: {
      type: String,
      default: 'General',
    },
    tags: {
      type: [String],
      default: [],
    },
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    assignee: {
      type: String,
      default: '',
    },
    completedAt: {
      type: Date,
    },
    order: {
  type: Number,
  default: 0,
},
  },
  
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// virtual field 'id' mapping to '_id' for frontend compatibility
taskSchema.virtual('id').get(function () {
  return this._id.toHexString()
})

// Set completedAt when status is updated to 'completed'
taskSchema.pre('validate', function (next) {
  if (!this.user && this.userId) {
    this.user = this.userId
  }

  if (!this.userId && this.user) {
    this.userId = this.user
  }

  if (this.status === 'done') {
    this.status = 'completed'
  }

  next()
})

// Set completedAt when status is updated to 'completed'
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'completed') {
      this.completedAt = this.completedAt || new Date()
      this.progress = 100
    } else {
      this.completedAt = undefined
      if (this.progress === 100) {
        this.progress = 0
      }
    }
  }
  next()
})

const Task = mongoose.model('Task', taskSchema)
export default Task
