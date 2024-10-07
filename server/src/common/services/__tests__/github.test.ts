// import githubService from "../github"
// import env from "src/common/config/env";
// import Https from "../https";

// jest.mock("../https")


// describe("GithubService", function () {
//     const apiUrl = "https://api.github.com";
//     const apiKey = env.github_token;
//   beforeAll(() => {
//     // const httpMock = jest.fn()
//     githubService.github = new Https(apiUrl, apiKey)
//   })
//     describe("ensureIsValidRequestOrigin", function () {
//       it("throws InvalidRequestOriginError if the request origin is invalid", function () {
//         try {
//           githubService.githubAPI(
//             "invalid repo",
//             "original url",
//             {
//               getOrigin: () => "valid origin",
//             },
//           );
//         } catch (e) {
//           expect((e as Error).name).toBe("InvalidRequestOriginError");
//           expect((e as Error).message).toBe("Invalid request origin");
//         }
//       });
//     });
//   });
  
import axios from "axios";
import { AxiosResponse } from "axios";
import { Https } from "../https";

jest.mock("axios");

describe("Https Class", () => {
    let https: Https;

    beforeEach(() => {
        https = new Https("https://api.github.com", "your-token");
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mock calls between tests
    });

    it("should make a GET request and return data", async () => {
        const responseData = { data: "test data" };
        const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

        // Mock the axios.get implementation
        mockedAxiosGet.mockResolvedValueOnce({ data: responseData } as AxiosResponse);

        // Call the method
        const response = await https.get("/orgs/github/repos");

        // Verify axios.get was called with the correct endpoint
        expect(mockedAxiosGet).toHaveBeenCalledWith("/orgs/github/repos", undefined);

        // Verify the response matches the mock
        expect(response.data).toEqual(responseData);
    });

    it("should handle GET request errors", async () => {
        const mockedAxiosGet = axios.get as jest.MockedFunction<typeof axios.get>;

        // Mock axios.get to throw an error
        mockedAxiosGet.mockRejectedValueOnce(new Error("Network Error"));

        // Test the get method error handling
        await expect(https.get("/orgs/github/repos")).rejects.toThrow("Network Error");

        expect(mockedAxiosGet).toHaveBeenCalledWith("/orgs/github/repos", undefined);
    });

    it("should make a POST request and return data", async () => {
        const responseData = { success: true };
        const mockedAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;

        // Mock the axios.post implementation
        mockedAxiosPost.mockResolvedValueOnce({ data: responseData } as AxiosResponse);

        const postData = { name: "New Repo" };
        const response = await https.post("/orgs/github/repos", postData);

        // Verify axios.post was called with the correct endpoint and data
        expect(mockedAxiosPost).toHaveBeenCalledWith("/orgs/github/repos", postData, undefined);

        // Verify the response matches the mock
        expect(response.data).toEqual(responseData);
    });

    it("should handle POST request errors", async () => {
        const mockedAxiosPost = axios.post as jest.MockedFunction<typeof axios.post>;

        // Mock axios.post to throw an error
        mockedAxiosPost.mockRejectedValueOnce(new Error("Post Error"));

        const postData = { name: "New Repo" };

        // Test the post method error handling
        await expect(https.post("/orgs/github/repos", postData)).rejects.toThrow("Post Error");

        expect(mockedAxiosPost).toHaveBeenCalledWith("/orgs/github/repos", postData, undefined);
    });
});
