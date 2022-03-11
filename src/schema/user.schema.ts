import { Schema, model } from 'mongoose';

const schema = new Schema({
    name: {type: String, required: true},
    coins: [{
        name: {type: String},
        value: {type: Number}
    }],
    currency: String,
});

export const UserModel = model('User',schema)