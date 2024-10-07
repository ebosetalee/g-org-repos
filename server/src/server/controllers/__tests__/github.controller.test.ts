import githubController from "../github.controller";
import githubService from "../../../common/services/github";
import GithubRepository from "../../models/githubrepos";
import { NextFunction, Request, Response } from "express";

// Mock the services and database
jest.mock("../../../common/services/github");
jest.mock("../../models/githubrepos");

describe("GithubController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  describe("handleGetRepositories", function () {

    beforeEach(() => {
      req = {
        query: { org: "test-org" }
      };
      res = {
        json: jest.fn(),
        status: jest.fn().mockReturnThis()
      };
    });

    it("should fetch repositories and return them with expanded/checkbox data", async () => {
      // Mock the GitHub API response
      const mockRepos = [
        {
          id: 1,
          name: "repo1",
          html_url: "https://github.com/repo1",
          branches_url: "https://api.github.com/branches",
          language: "JavaScript"
        }
      ];
      (githubService.githubAPI as jest.Mock).mockResolvedValue(mockRepos);

      // Mock the fetch branches function
      const mockBranches = { branches: ["main"] };
      (githubService.fetchBranches as jest.Mock).mockResolvedValue(mockBranches);

      // Mock the database query response
      const mockDbData = { expanded: true, checkbox: false };
      (GithubRepository.byQuery as jest.Mock).mockResolvedValue(mockDbData);

      // Call the controller method
      await githubController.getRepositories(req as Request, res as Response, next as NextFunction);

      // Assert that it calls the GitHub service
      expect(githubService.githubAPI).toHaveBeenCalledWith("test-org", 1);

      // Assert that it calls the fetch branches function
      expect(githubService.fetchBranches).toHaveBeenCalledWith("https://api.github.com/branches");

      // Assert that it queries the database for expansion and checkbox data
      // expect(GithubRepository.byQuery).toHaveBeenCalledWith({ repo_id: 1, orgName: "test-org" }, "expanded checkbox");

      // Assert that the response contains the merged data

      console.log(res);

      expect(res.status).toHaveReturnedWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Repositories Retrieved Successfully",
        data: [
          {
            id: 1,
            name: "repo1",
            url: "https://github.com/repo1",
            language: "JavaScript",
            branches: ["main"],
            expanded: true,
            checkbox: false
          }
        ]
      });
    });

    it("should handle errors from the GitHub API", async () => {
      // Simulate an error from the GitHub API
      (githubService.githubAPI as jest.Mock).mockRejectedValue(new Error("GitHub API Error"));

      // Call the controller method
      await githubController.getRepositories(req as Request, res as Response, next as NextFunction);

      // Assert that the error is handled correctly
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Unable to fetch repositories" });
    });
  });
});
