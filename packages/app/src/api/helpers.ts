import { kit } from "./kit";
import { components } from "@octokit/openapi-types";

const [owner, repo] = process.env.NPMDOCS_REPO.split("/");
const branch = process.env.NPMDOCS_REPO_BRANCH ?? "main";
export const workflow = "build-package.yml";

export const getFile = async <T extends string | object = string>(
  path: string,
  parseJson = true,
  targetBranch = branch
): Promise<T | undefined> => {
  try {
    const result = await kit().rest.repos.getContent({
      owner,
      repo,
      path,
      ref: targetBranch,
    });
    const content = Buffer.from(
      (result.data as components["schemas"]["content-file"]).content,
      "base64"
    ).toString();
    if (parseJson) {
      return JSON.parse(content);
    } else {
      return content as T;
    }
  } catch (e: any) {
    if (e.status === 404) {
      return undefined;
    } else {
      throw e;
    }
  }
};

export const getFolderContents = async (
  path: string,
  targetBranch = branch
): Promise<string[] | undefined> => {
  try {
    const result = await kit().rest.repos.getContent({
      owner,
      repo,
      path,
      ref: targetBranch,
    });
    const content = result.data as components["schemas"]["content-directory"];
    return content.map(({ name }) => name);
  } catch (e: any) {
    if (e.status === 404) {
      return undefined;
    } else {
      throw e;
    }
  }
};

export const dispatchWorkflow = async (inputs: any): Promise<void> => {
  await kit().rest.actions.createWorkflowDispatch({
    owner,
    repo,
    workflow_id: workflow,
    inputs,
    ref: branch,
  });
};

export const getWorkflowRuns = async (
  status?: components["parameters"]["workflow-run-status"]
) => {
  const runs = await kit().rest.actions.listWorkflowRuns({
    owner,
    repo,
    workflow_id: workflow,
    status,
  });
  return {
    count: runs.data.total_count,
    runs: runs.data.workflow_runs.map(run => run.id),
  };
};
