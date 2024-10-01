import GithubRepository, { IGithub, Repository } from "../models/githubrepos";
import githubService from "../../common/services/github";
import { BaseController } from "./base.controller";
import { Request, Response } from "express";
import { validationError } from "../../common/errors";

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
        // logger.info("retrieving repositories")
        const orgName = req.query.org;
        const page = req.query.page || 1;

        const repositories = await githubService.githubAPI(`${orgName}`, Number(page));

        const filtered = await Promise.all(
            repositories.map(async (repo: any) => {
                // Fetch branches for the repository
                const branches = await githubService.fetchBranches(repo.branches_url);

                return {
                    id: repo.id,
                    name: repo.name,
                    url: repo.html_url,
                    language: repo.language,
                    ...branches
                };
            })
        );

        // Include previous selections from DB
        // const repoIds = repos.map((repo: any) => repo.id);
        // const selections = await Repository.find({ repoId: { $in: repoIds } });

        // // Attach checkbox status to response
        // const updatedRepos = repos.map((repo: any) => {
        //     const foundSelection = selections.find(selection => selection.repoId === repo.id);
        //     return {
        //         ...repo,
        //         // isSelected: !!foundSelection
        //     };
        // });

        // res.status(200).json({ repos: updatedRepos });
        const response = {
            message: "Repositories Retrieved Successfully",
            data: filtered
        };

        return this.handleSuccess(req, res, response, 200);
    });

    saveRepositories = this.asyncWrapper(async (req: Request, res: Response) => {
        const { repo_id, expanded, checkbox, orgName }: saveReposRequest = req.body;

        if (!repo_id || !orgName) {
            const required = !repo_id ? (!orgName ? "Repo Id and Organisation Name" : "Repo Id") : "Organisation Name";
            throw new validationError(`${required} is required`);
        }
        // check if in the db {repo_id: number, checkbox: bool expanded: bool} and store or update
        await this.repo.update({ repo_id, orgName }, { expanded, checkbox });

        return this.handleSuccess(req, res, { data: null, message: "" }, 200);
    });
}

const github = new GithubController();
export default github;
