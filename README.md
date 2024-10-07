# get-pull-requests-commits

A GitHub Action that get commits in current pull-request

## Usage
Add .github/workflows/checks.yml with the following:

```
name: Checks
on: [pull_request]

jobs:
  commits_check_job:
    runs-on: ubuntu-latest
    name: Commits Check
    steps:
    - name: Get PR Commits
      id: 'get-pr-commits'
      uses: luizgustavosaraiva/get-pull-requests-commits@master
      with:
        token: ${{ secrets.GITHUB_TOKEN }}

```