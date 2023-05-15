import { info, setFailed, setOutput } from '@actions/core'
import { validationIfConditionIsMet } from '../utils/validationIfConditionIsMet'
import { GitHubRepository } from '../repositories/GitHubRepository'

const gitHubRepository = new GitHubRepository()

export async function gitHubService(
  conditionalValue: string,
  pullRequestNumber: number,
  repoName: string,
  repoOwner: string,
  valueThatMustExist: string,
): Promise<any> {
  console.log('GitHub Service - INICIO')

  const bodyPullRequest = await gitHubRepository.getPullRequestNumber(
    pullRequestNumber,
    repoName,
    repoOwner,
  )

  const validate = validationIfConditionIsMet(
    bodyPullRequest,
    conditionalValue,
    valueThatMustExist,
  )

  if (validate === false) {
    await gitHubRepository.createCommentAtPR(
      `The value ${valueThatMustExist} does not exist, as expected when we have ${conditionalValue}.`,
      pullRequestNumber,
      repoName,
      repoOwner,
    )

    setFailed(
      `The value ${valueThatMustExist} does not exist, as expected when we have ${conditionalValue}.`,
    )

    return setOutput('result', false)
  }

  return setOutput('result', true)
}
