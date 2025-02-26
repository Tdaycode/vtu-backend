import { Schema, model } from 'mongoose';
import { ISettings, ISettingsDocument, SettingsType } from '../interfaces/settings.interface';

// A Schema corresponding to the document interface.
const settingsSchema: Schema<ISettings> = new Schema(
  {
    type: {
      type: String,
      enum: SettingsType,
      required: true,
    },
    active: {
      type: Boolean,
      default: true
    },
    value: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Settings Model
const Settings = model<ISettingsDocument>('Settings', settingsSchema);

export default Settings;
