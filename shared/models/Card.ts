import { Schema, model, Document } from 'mongoose';

// Base interface for common card properties
interface BaseCard {
  name: string;
  cost: number;
  deck: string;
  factions: string[];
  art_url: string;
  createdAt: Date;
  updatedAt: Date;
}

// Agent Card
export interface IAgentCard extends Document {
  _id: string;
  type: 'Agent';
  name: string;
  cost: number;
  deck: string;
  factions: string[];
  abilities: {
    agent: string;
    reveal?: string | null;
  };
  icons: {
    influence?: number;
    combat?: number;
    spice?: number;
    water?: number;
  };
  tags: string[];
  art_url: string;
  createdAt: Date;
  updatedAt: Date;
}

// Intrigue Card
export interface IIntrigueCard extends Document {
  _id: string;
  type: 'Intrigue';
  name: string;
  cost: number;
  deck: string;
  factions: string[];
  abilities: {
    intrigue: string;
  };
  icons: {
    influence?: number;
    combat?: number;
  };
  tags: string[];
  art_url: string;
  createdAt: Date;
  updatedAt: Date;
}

// Conflict Card
export interface IConflictCard extends Document {
  _id: string;
  type: 'Conflict';
  name: string;
  cost: number;
  deck: string;
  factions: string[];
  abilities: {
    conflict: string;
  };
  icons: {
    combat: number;
    influence?: number;
  };
  tags: string[];
  art_url: string;
  createdAt: Date;
  updatedAt: Date;
}

// Leader Card
export interface ILeaderCard extends Document {
  _id: string;
  type: 'Leader';
  name: string;
  cost: number;
  deck: string;
  factions: string[];
  abilities: {
    leader: string;
    reveal?: string;
  };
  icons: {
    influence: number;
    combat?: number;
    spice?: number;
    water?: number;
  };
  tags: string[];
  art_url: string;
  createdAt: Date;
  updatedAt: Date;
}

// Base schema for common properties
const BaseCardSchema = new Schema({
  name: { type: String, required: true },
  cost: { type: Number, required: true },
  deck: { type: String, required: true },
  factions: [{ type: String }],
  art_url: { type: String, required: true }
}, {
  timestamps: true
});

// Agent Card Schema
const AgentCardSchema = new Schema<IAgentCard>({
  ...BaseCardSchema.obj,
  type: { type: String, required: true, enum: ['Agent'] },
  abilities: {
    agent: { type: String, required: true },
    reveal: { type: String }
  },
  icons: {
    influence: { type: Number, default: 0 },
    combat: { type: Number, default: 0 },
    spice: { type: Number, default: 0 },
    water: { type: Number, default: 0 }
  },
  tags: [{ type: String }]
});

// Intrigue Card Schema
const IntrigueCardSchema = new Schema<IIntrigueCard>({
  ...BaseCardSchema.obj,
  type: { type: String, required: true, enum: ['Intrigue'] },
  abilities: {
    intrigue: { type: String, required: true }
  },
  icons: {
    influence: { type: Number, default: 0 },
    combat: { type: Number, default: 0 }
  },
  tags: [{ type: String }]
});

// Conflict Card Schema
const ConflictCardSchema = new Schema<IConflictCard>({
  ...BaseCardSchema.obj,
  type: { type: String, required: true, enum: ['Conflict'] },
  abilities: {
    conflict: { type: String, required: true }
  },
  icons: {
    combat: { type: Number, required: true },
    influence: { type: Number, default: 0 }
  },
  tags: [{ type: String }]
});

// Leader Card Schema
const LeaderCardSchema = new Schema<ILeaderCard>({
  ...BaseCardSchema.obj,
  type: { type: String, required: true, enum: ['Leader'] },
  abilities: {
    leader: { type: String, required: true },
    reveal: { type: String }
  },
  icons: {
    influence: { type: Number, required: true },
    combat: { type: Number, default: 0 },
    spice: { type: Number, default: 0 },
    water: { type: Number, default: 0 }
  },
  tags: [{ type: String }]
});

// Create models
export const AgentCard = model<IAgentCard>('AgentCard', AgentCardSchema);
export const IntrigueCard = model<IIntrigueCard>('IntrigueCard', IntrigueCardSchema);
export const ConflictCard = model<IConflictCard>('ConflictCard', ConflictCardSchema);
export const LeaderCard = model<ILeaderCard>('LeaderCard', LeaderCardSchema); 