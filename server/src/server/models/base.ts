import { FilterQuery, Document, ObjectId, Schema, SchemaDefinition, SchemaOptions, SchemaTypes, Model } from "mongoose";
import mongoose from "mongoose";

export interface IModel {
    created_at: Date;
    deleted_at: Date;
    updated_at: Date;
}
/**
 * Defines timestamps fields in a schema
 */
export const timestamps = {
    timestamps: {
        createdAt: "created_at",
        updatedAt: "updated_at"
    }
};

export interface BaseModel extends Document {
    _id: ObjectId;
    deleted_at: Date;
}

export const trimmedRequiredLowercaseString = {
    type: SchemaTypes.String,
    lowercase: true,
    trim: true,
    required: true
};

export const requiredNumber = {
    type: SchemaTypes.Number,
    required: true
};

export const defaultBoolean = {
    type: SchemaTypes.Boolean,
    required: false,
    default: false
};

export const SchemaFactory = <T>(schemaFields: SchemaDefinition<T>, options?: SchemaOptions) => {
    if (!schemaFields || Object.keys(schemaFields).length === 0) {
        throw new Error("Please specify schemaFields");
    }

    return new Schema<T>(
        {
            deleted_at: { type: SchemaTypes.Date },
            ...schemaFields
        },
        {
            ...options,
            ...timestamps,
            // @ts-ignore
            selectPopulatedPaths: false
        }
    );
};

type stringObject = string | object;

export class BaseRepository<T> {
    protected model: Model<T>;
    constructor(protected name: string, protected schema: Schema<T>) {
        this.model = mongoose.model<T>(name, schema);
    }

    getModel() {
        return this.model;
    }

    /**
     * Converts a passed condition argument to a query
     * @param condition string or object condition
     */
    getQuery = (condition: stringObject): FilterQuery<object> => {
        return typeof condition === "string" ? { _id: condition, deleted_at: undefined } : { ...condition, deleted_at: undefined };
    };
}
