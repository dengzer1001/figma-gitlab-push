
export const getContent = (filePath, githubData) => {
  const { base, id } = githubData;
  return fetch(`${base}/api/v4/projects/${encodeURIComponent(id)}/repository/files/${encodeURIComponent(filePath)}?ref=master`, {
    headers: {
      'content-type': 'application/json',
      'PRIVATE-TOKEN': `${githubData.githubToken}`
    }
  })
  .then(response => response.json())
  .then(res => (
    res.commit_id ?
    {sha: res.commit_id, contents: JSON.parse(window.atob(res.content))} :
    {}
  ))
}

export const getCommit = (githubData) => {
  const { base, id } = githubData;
  return fetch(`${base}/api/v4/projects/${encodeURIComponent(id)}/repository/commits`, {
    headers: {
      'content-type': 'application/json',
      'PRIVATE-TOKEN': `${githubData.githubToken}`
    }
  })
  .then(response => response.json())
}

export const createBranch = (sha, githubData) => {
  const { base, id } = githubData;
  const branchName = `figma-update-${(new Date()).getTime()}`
//   const body = { ref: `refs/heads/${branchName}`, sha }
  return fetch(`${base}/api/v4/projects/${encodeURIComponent(id)}/repository/branches?branch=${branchName}&ref=${sha}`, {
    headers: {
      'content-type': 'application/json',
      'PRIVATE-TOKEN': `${githubData.githubToken}`
    },
    method: 'POST'
  })
    .then(response => response.json())
}

export const updatePackage = (message, sha, contents, branch, githubData) => {
  const { base, id } = githubData;
  const content = window.btoa(JSON.stringify(contents, null, 2))
  const body = JSON.stringify({ branch, sha, content, commit_message: message, encoding: 'base64' })
  return fetch(`${base}/api/v4/projects/${encodeURIComponent(id)}/repository/files/package.json`, {
    headers: {
      'content-type': 'application/json',
      'PRIVATE-TOKEN': `${githubData.githubToken}`
    },
    body,
    method: 'PUT'
  })
  .then(response => response.json())
}

export const createPullRequest = (title, content, branchName, githubData) => {
  const { base, id } = githubData;
  const body = {
    title,
    description: content,
    source_branch: branchName,
    target_branch: "master"
  }
  return fetch(`${base}/api/v4/projects/${encodeURIComponent(id)}/merge_requests`, {
    headers: {
      'content-type': 'application/json',
      'PRIVATE-TOKEN': `${githubData.githubToken}`
    },
    body: JSON.stringify(body),
    method: 'POST'
  })
    .then(response => response.json())
}
