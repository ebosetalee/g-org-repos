import { Document, ObjectId, Schema, SchemaDefinition, SchemaOptions, SchemaTypes } from "mongoose";

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
