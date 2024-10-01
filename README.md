# G-ORG-REPOS

## Setup

Create a `.env` file in the root directory of the project and fill it with values using the template in [`env.example`](./env.example).

If you are using Docker, create a `.docker.env` file and fill it with values using the template in [`env.example`](./env.example).

**The project uses MongoDB to run basic operation.**

Install dependencies

```bash
# Install deps
# With npm
npm install

# With Yarn
yarn
```

## Running the project

This project uses node -v `20.14.0` above

```shell
# To use the accurate node -v
# check current version

node -v

# if not on 20; install v20 either with brew
brew install node@20

# or use nvm

nvm install 20.14.0

# If v20 is available on your system
# Run

nvm use 20
```

Once the project is on the right node version. Run the project environment on either `development`, `staging` or `production`

Then start the project with the following

```shell
# To start the project
# Development
npm run dev

# Production
npm start
```

To start with Docker,

```bash
# Run
docker compose -f ./docker-compose.yml up
# can add --build
```

## Project Description
Create a full-stack application where user enters a github ORG name in text input and retrieve
a list or repositories belonging to this ORG.

### Functionality

- For each repository show the following information:
- checkbox (like classic TODO task)
- fields: name, link to the repository’s GitHub page, number of branches,
programming language
- When a checkbox is clicked, the results should be saved in internal DB. Every time user
gets same repos they should contain results of previous selections
- User can expand/close each repository by clicking to a row button and see first/any 10
branches of this repo

### Technical notes
- Backend should accept an env var with github API token and use it internally. Github
API call should be done in BE side and provide a response to client by REST API.
- App should support server-side pagination and load 10 records per page. More tasks
should be loaded as user scrolls (infinity scroll).
- When it comes to frontend styling, use a standard library lie Material Design or
something similar (we will pay attention in the general layout and app structure, but
there’s no need to focus on styling besides the general library being used)
- Remember to test edge cases
- Make sure changes are persistent after page refresh.
- If needed, you can include new dependencies on top of what is listed in technical
requirements

### Technical requirements
- FE: react > 18, TypeScript, SCSS, any UI library of your choice
- BE: Node, Express/Nest.js, TypeScript
- DB: MongoDB / Mongoose ODM
- CI/CD: docker/docker-compose. Project should be able to start from docker-compose:
FE, BE + DB

### What we will evaluate
- Correctness of results.
- How usable and clear the interface is.
- How clear and well written the code is.
- Use of best practices, DRY.
- Quality of the tests. //implementing tests
- Error handling.
- Completion time.