import { NextResponse } from "next/server"

const GITHUB_USERNAME = "PapiGECode"

export async function GET() {
  const response = await fetch(
    `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 900 },
    },
  )

  if (!response.ok) {
    return NextResponse.json({ error: "GitHub API unavailable" }, { status: response.status })
  }

  const repositories = await response.json()
  return NextResponse.json({
    username: GITHUB_USERNAME,
    repositories: repositories.map((repository: Record<string, unknown>) => ({
      name: repository.name,
      description: repository.description,
      url: repository.html_url,
      stars: repository.stargazers_count,
      forks: repository.forks_count,
      language: repository.language,
      updatedAt: repository.updated_at,
    })),
  })
}
