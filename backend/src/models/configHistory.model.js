const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const OwnerSchema = new Schema({
  login: {
    type: String,
    required: true,
    trim: true,
  },
  avatar_url: {
    type: String,
    trim: true,
  },
  html_url: {
    type: String,
    trim: true,
  },
});

const RepositorySchema = new Schema({
  id: {
    type: String,
    required: true,
    trim: true,
  },
  full_name: {
    type: String,
    required: true,
    trim: true,
  },
  html_url: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: OwnerSchema,
    required: true,
  },
});

const WelcomeCommentSchema = new Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  issue: {
    enabled: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      trim: true,
    },
  },
  pull_request: {
    enabled: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      trim: true,
    },
  },
});

const AutoLabelSchema = new Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  ai_model: {
    type: String,
    trim: true,
  },
  issue: {
    enabled: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: [String],
      default: [],
    },
  },
  pull_request: {
    enabled: {
      type: Boolean,
      default: false,
    },
    labels: {
      type: [String],
      default: [],
    },
  },
});

const DiscordNotificationsSchema = new Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  webhook_url: {
    type: String,
    trim: true,
  },
  events: {
    type: [String],
    default: [],
  },
});

const PRSummarySchema = new Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  ai_model: {
    type: String,
    trim: true,
  },
  max_length: {
    type: Number,
    default: 500,
  },
});

const ScanSchema = new Schema({
  enabled: {
    type: Boolean,
    default: false,
  },
  issue: {
    enabled: {
      type: Boolean,
      default: false,
    },
    prompt: {
      type: String,
      trim: true,
    },
  },
  pull_request: {
    enabled: {
      type: Boolean,
      default: false,
    },
    prompt: {
      type: String,
      trim: true,
    },
  },
});

const ConfigSchema = new Schema({
  enabled: {
    type: Boolean,
    default: true,
  },
  welcome_comment: {
    type: WelcomeCommentSchema,
    required: true,
  },
  auto_label: {
    type: AutoLabelSchema,
    required: true,
  },
  auto_assign: {
    enabled: {
      type: Boolean,
      default: false,
    },
  },
  discord_notifications: {
    type: DiscordNotificationsSchema,
    required: true,
  },
  pr_summary: {
    type: PRSummarySchema,
    required: true,
  },
  scan: {
    type: ScanSchema,
    required: true,
  },
});

const ConfigHistorySchema = new Schema(
  {
    _id: {
      type: String,
      auto: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    usedRepos: {
      type: [RepositorySchema],
      required: true,
      default: [],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one repository is required.",
      },
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
    uploadedBy: {
      type: String,
      required: true,
      trim: true,
    },
    config: {
      type: ConfigSchema,
      required: true,
    },
  },
  {
    collection: "history_config",
  }
);

module.exports = mongoose.model("ConfigHistory", ConfigHistorySchema);