import logger from "./logger";
import Https from "./https";
import env from "../config/env";

const githubToken = env.github_token;

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
            throw err.response.data;
        }
    }

    async fetchBranches(url: string): Promise<number> {
        try {
            const formattedUrl = url.replace("{/branch}", "");

            const { data } = await this.github.get<any[]>(formattedUrl);

            return data.length;
        } catch (error) {
            logger.error("Error fetching branches:", error.message);

            return 0;
        }
    }
}

export default new githubService();
