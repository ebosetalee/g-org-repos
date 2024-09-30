import { IModel, BaseRepository } from "./base";
import { SchemaFactory, trimmedRequiredLowercaseString, requiredNumber, defaultBoolean } from "./base";

export interface IGithub extends IModel {
    orgName: string;
    repo_id: number;
    checkbox: boolean;
    expanded: boolean;
}

export const GithubSchema = SchemaFactory<IGithub>({
    orgName: trimmedRequiredLowercaseString,
    repo_id: requiredNumber,
    checkbox: defaultBoolean,
    expanded: defaultBoolean
});

type stringObject = string | object;
type Projection = string | string[] | Record<string, number | boolean | string | object>;

class GithubRepository extends BaseRepository<IGithub> {
    constructor() {
        super("Github", GithubSchema);
    }

    /**
     * Creates one or more documets.
     */
    create(attributes: IGithub): Promise<IGithub> {
        return this.model.create(attributes);
    }
    /**
     * Finds a document by an object query.
     * @param query
     * @param opts
     */
    async byQuery(query: object, projections?: Projection): Promise<IGithub> {
        return this.model
            .findOne({ ...query, deleted_at: undefined })
            .select(projections)
            .exec();
    }

    /**
     * Allows the user of atomic operators such as $inc in updates.
     * Note: It does not trigger mongoose `save` hooks.
     * @param condition Query condition to match against documents
     * @param update The document update
     */
    update(condition: stringObject, update: object): Promise<IGithub> {
        const query = this.getQuery(condition);
        return this.model.findOneAndUpdate(query, update, { new: true, upsert: true }).exec();
    }
}

export interface Repository<T> {
	create(attributes: T): Promise<T>;
	byQuery(query: object, projections?: Projection): Promise<T>;
	update(condition: string | object, update: object): Promise<T>;
}

export default new GithubRepository();
