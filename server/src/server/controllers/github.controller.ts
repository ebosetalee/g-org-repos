import githubService from "../../common/services/github";
import { BaseController } from "./base.controller";
import { Request, Response } from "express";

export class GithubController extends BaseController {
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
        const data: any = req.body;

        // check if in the db

        // store or update db
        return data;
    });
}

const github = new GithubController();
export default github;
