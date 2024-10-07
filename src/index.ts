import core from "@actions/core";
import github from "@actions/github";
import { Context as GithubContext } from "@actions/github/lib/context";

type Context = Omit<GithubContext, "eventName"> & {
  eventName: "pull_request";
};

async function run() {
  try {
    const { eventName, payload: {repository, pull_request } } = github.context as Context;

    const isValidEventName = Object.values(github.context.eventName).includes(eventName);

    if(!isValidEventName) {
      core.setFailed("This action only works on pull requests");
      return;
    }

    const token = core.getInput("token");
    const filterOutPattern = core.getInput('filter_out_pattern');
    const filterOutFlags = core.getInput('filter_out_flags')
    const octokit = github.getOctokit(token);

    const commits = await octokit.rest.pulls.listCommits({
      owner: repository?.owner.login!!,
      repo: repository?.name!!,
      pull_number: pull_request?.number!!,
    });

    const filteredCommits = commits.data.filter((commit) => {
      const message = commit.commit.message;

      if(!filterOutPattern) {
        return true;
      }

      const regex = new RegExp(filterOutPattern, filterOutFlags);
      return !regex.test(message);
    });

    core.setOutput("commits", JSON.stringify(filteredCommits));
  } catch (error) {
    core.setFailed(error as Error);
  }
};

run();