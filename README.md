# Topcoder Self Service Micro Frontend App

This is a [single-spa](https://single-spa.js.org/) React microapp that runs within the `mfe-core` frame application. 

> NOTE. This application have been configured to be run as child app of a single-spa application. So while this app can be deployed and run independently, we would need some frame [single-spa](https://single-spa.js.org/) which would load it. While technically we can achieve running this app as standalone app it's strongly not recommended by the author of the `single-spa` approch, see this [GitHub Issue](https://github.com/single-spa/single-spa/issues/640) for details.

## Local Environment Setup

### IDE

Use the [VS Code](https://code.visualstudio.com/download) IDE for MFE development.

### NVM
Use the node version manager [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md) to easily and safely manage the required version of NodeJS (aka, node). Download and install it per the instructions for your development operating system. Installing a version of node via `nvm` will also install `npm`.

Once nvm is installed, run: 
```
$ nvm install <insert node version>
```

>Note: the node version required at the time of this writing is `10.22.1`

At the root of the project directory you'll notice a file called `.nvmrc` which specifies the node version used by the project. The command `nvm use` will use the version specified in the file if no version is supplied on the command line. 
See [the nvm Github README](https://github.com/nvm-sh/nvm/blob/master/README.md#nvmrc) for more information on setting this up.

You can verify the versions of `nvm`, `node`, and `npm` using the commands below.
| Command           | Supported Version  |
| ----------------- | -------- |
| `$ npm -v`        | 6.14.6  |
| `$ node -v`       | v10.22.1 |
| `$ nvm --version` | 0.39.1   |
| `$ nvm current`   | v10.22.1 |

### Hosting 
You will need to add the following line to your hosts file. The hosts file is normally located at `/etc/hosts` (Mac). Do not overwrite the existing localhost entry also pointing to 127.0.0.1

```
127.0.0.1      local.topcoder-dev.com
```

The MFE can run in a non-ssl environment, but auth0 will complain and throw errors. In order to bypass this, you will need to install [local-ssl-proxy](https://www.npmjs.com/package/local-ssl-proxy) to run the site in ssl. The following command will install it globally:
```
$ npm i -g local-ssl-proxy
```

### Terminal Configuration

The MFE Core Frame needs to run separate local server and client processes, each one in a separate terminal session. The navbar also needs to run its server in a terminal, along with the `local-ssl-proxy` server that will allow you to use *https* endpoints locally. Finally, each of the other micro front-end applications you want to run will also each run in their own terminal session.

When developing one of the micro front-end applications you will therefore have 5 terminal sessions running at the same time:

- `mfe-core` server
- `mfe-core` client
- `mfe-header` application
- `local-ssl-proxy` server
- the MFE app you're developing 

Given this complexity, it is recommended that you use a tool like [iTerm2](https://iterm2.com) (on Mac) or an equivalent terminal shell on Windows to make terminal management simpler. iTerm2 allows you to setup a pre-defined window layout of terminal sessions, including the directory in which the session starts. This setup, along with simple shell scripts in each project that configure and start the environment, will allow you to get your development environment up and running quickly and easily.

## Git
### Branching
When working on Jira tickets, we link associated Git PRs and branches to the tickets. Use the following naming convention for branches:

`[TICKET #]_short-description`

e.g.: `PROD-1516_work-issue`

### Commits
We use [Smart Commits](https://bigbrassband.com/git-integration-for-jira/documentation/smart-commits.html#bbb-nav-basic-examples) to link comments and time tracking to tickets. You would enter the following as your commit message:

`[TICKET #] #comment <commit message> #time <jira-formatted time>`

e.g.: `PLAT-001 #comment adding readme notes #time 45m`

## NPM Commands

| Command               | Description                                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| `npm start`           | Run server which serves production ready build from `dist` folder                                            |
| `npm start-local`     | Run app locally in the `development` mode and `dev` config (calls on `npm run dev`)                                           |
| `npm run dev`         | Run app in the `development` mode and `dev` config                                                           |
| `npm run dev-https`   | Run app in the `development` mode and `dev` config using HTTPS protocol                |
| `npm run prod`        | Run app in the `development` mode and `prod` config                                                          |
| `npm run build`       | Build app for production and puts files to the `dist` folder, default to `development` mode and `dev` config |
| `npm run analyze`     | Analyze dependencies sizes and opens report in the browser                                                   |
| `npm run lint`        | Check code for lint errors                                                                                   |
| `npm run format`      | Format code using prettier                                                                                   |
| `npm run test`        | Run unit tests                                                                                               |
| `npm run watch-tests` | Watch for file changes and run unit tests on changes                                                         |
| `npm run coverage`    | Generate test code coverage report                                                                           |
| `npm run mock-api`    | Start the mock api which mocks Recruit api                                                                   |

## Local Deployment

To run the app locally, run the following commands from the project root `./mfe-customer-work`:

```
$ npm run start-server
```
- The Self-Service app should now be available at https://local.topcoder-dev.com/self-service.

## Deployment to Production

- `npm i` - install dependencies
- `npm build` - build code to `dist/` folder
- Now you can host `dist/` folder using any static server. For example, you may run a simple `Express` server by running `npm start`.

### Deploying to Heroku

Make sure you have [Heroky CLI](https://devcenter.heroku.com/articles/heroku-cli) installed and you have a Heroku account. And then inside the project folder run the next commands:

- If there is not Git repository inited yet, create a repo and commit all the files:

  - `git init`
  - `git add .`
  - `git commit -m'inital commit'`

- `heroku apps:create` - create Heroku app

- `git push heroku master` - push changes to Heroku and trigger deploying

- Now you have to configure frame app to use the URL provided by Heroku like `https://<APP-NAME>.herokuapp.com/gigs-app/topcoder-mfe-customer-work.js` to load this microapp.

### Aggregator API

Please refer to [Swagger Doc](./src/api/docs/swagger.yaml) for Aggregator API endpoints

#### Aggregator API Configuration

In the `mfe-customer-work` root directory create `.env` file with the next environment variables.

```bash
# Auth0 config
AUTH_SECRET=
AUTH0_URL=
AUTH0_AUDIENCE=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
VALID_ISSUERS=
```

Once the self service app is started, the aggregator api will work as well
