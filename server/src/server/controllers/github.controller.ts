import GithubRepository, { IGithub, Repository } from "../models/githubrepos";
import githubService from "../../common/services/github";
import { BaseController } from "./base.controller";
import { Request, Response } from "express";
import { validationError } from "../../common/errors";
import { CREATED, OK } from "http-status";

interface saveReposRequest {
    repo_id: number;
    orgName: string;
    checkbox?: boolean;
    expanded?: boolean;
}
export class GithubController extends BaseController {
    repo: Repository<IGithub>;
    constructor() {
        super();
        this.repo = GithubRepository;
    }
    getRepositories = this.asyncWrapper(async (req: Request, res: Response) => {
        const orgName = req.query.org;
        const page = req.query.page || 1;

        const repositories = await githubService.githubAPI(`${orgName}`, Number(page));

        const filtered = await Promise.all(
            repositories.map(async (repo: any) => {
                // Fetch branches for the repository
                const branches = await githubService.fetchBranches(repo.branches_url);

                // Include previous expansion from DB
                const data = await this.repo.byQuery({ repo_id: repo.id, orgName }, "expanded checkbox");

                return {
                    id: repo.id,
                    name: repo.name,
                    url: repo.html_url,
                    language: repo.language,
                    ...branches,
                    expanded: !!data?.expanded,
                    checkbox: !!data?.checkbox
                };
            })
        );

        const response = {
            message: "Repositories Retrieved Successfully",
            data: filtered
        };

        return this.handleSuccess(req, res, response, OK);
    });

    saveRepositories = this.asyncWrapper(async (req: Request, res: Response) => {
        const { repo_id, expanded, checkbox, orgName }: saveReposRequest = req.body;

        if (!repo_id || !orgName) {
            const required = !repo_id ? (!orgName ? "Repo Id and Organisation Name" : "Repo Id") : "Organisation Name";
            throw new validationError(`${required} is required`);
        }
        // check if in the db {repo_id: number, checkbox: bool expanded: bool} and store or update
        await this.repo.update({ repo_id, orgName }, { expanded, checkbox });

        const response = {
            message: "Repositories stored Successfully",
            data: null
        };
        return this.handleSuccess(req, res, response, CREATED);
    });
}

const github = new GithubController();
export default github;
