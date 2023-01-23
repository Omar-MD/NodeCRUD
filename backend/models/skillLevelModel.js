'use strict';

// Mongoose
import { Schema, model } from 'mongoose';

// Skill Level Schema
const SkillLevelSchema = new Schema({
    name: {
        type: String, 
        required: true, 
        trim: true
    },
    description: {
        type: String, 
        required: true, 
        trim: true
    },
});

export const SkillLevel = model('SkillLevel',SkillLevelSchema);