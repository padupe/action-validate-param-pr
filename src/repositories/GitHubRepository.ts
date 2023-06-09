import { Octokit } from '@octokit/core'
import { IGitHubRepository } from './IGitHubRepository'
import { auth } from '../auth/auth'
import { setFailed } from '@actions/core'

export class GitHubRepository implements IGitHubRepository {
  private readonly repository: Octokit

  constructor() {
    this.repository = auth
  }

  async createCommentAtPR(
    message: string,
    pullRequestNumber: number,
    repoName: string,
    repoOwner: string,
  ): Promise<object> {
    const comment = await this.repository.request(
      'POST /repos/{owner}/{repo}/issues/{issue_number}/comments',
      {
        owner: repoOwner,
        repo: repoName,
        issue_number: pullRequestNumber,
        body: message,
      },
    )

    if (comment.status !== 201) {
      setFailed(`Error creating comment ou Pull Request ${pullRequestNumber}.`)
    }

    return comment.data
  }

  async getPullRequestNumber(
    pullRequestNumber: number,
    repoName: string,
    repoOwner: string,
  ): Promise<string> {
    const pullRequest = await this.repository.request(
      'GET /repos/{owner}/{repo}/pulls/{pull_number}',
      {
        owner: repoOwner,
        repo: repoName,
        pull_number: pullRequestNumber,
      },
    )

    if (!pullRequest) {
      setFailed(`Error capturing Pull Request body ${pullRequestNumber}`)
    }

    return pullRequest.data.body as string
  }
}
