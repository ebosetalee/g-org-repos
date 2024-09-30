import logger from "./logger";
import Https from "./https";
import env from "../config/env";

const githubToken = env.github_token;

interface FetchBranches {
    total_branches: number;
    branches: branchesResponse[] | undefined;
}

interface branchesResponse {
    name: string;
    commit: object;
    protected: boolean
}

class githubService {
    github: Https;

    constructor() {
        this.github = new Https("https://api.github.com", githubToken);
    }

    async githubAPI(orgName: string, page: number): Promise<any> {
        logger.debug("getting repositories fom Github API");
        try {
            const { data } = await this.github.get(`/orgs/${orgName}/repos`, {
                params: {
                    per_page: 10,
                    page: page
                }
            });

            return data;
        } catch (err) {
            err.response.data.code = err.status
            throw err.response.data;
        }
    }

    async fetchBranches(url: string): Promise<FetchBranches> {
        try {
            const formattedUrl = url.replace("{/branch}", "");

            const { data } = await this.github.get<branchesResponse[]>(formattedUrl);

            return { total_branches: data.length, branches: data };
        } catch (error) {
            logger.error("Error fetching branches:", error.message);
            logger.error(error);

            return { total_branches: 0, branches: null };
        }
    }
}

export default new githubService();
