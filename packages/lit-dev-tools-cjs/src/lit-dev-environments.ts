/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

interface LitDevEnvironment {
  siteVersion: string;
  mainPort: number;
  playgroundPort: number;
  fakeGithubPort: number | undefined;
  eleventyMode: 'prod' | 'dev';
  eleventyOutDir: string;
  googleAnalyticsId: string;
  reportCspViolations: boolean;
  playgroundSandboxUrl: string;
  playgroundCdnBaseUrl: string;
  mainUrl: string;
  githubMainUrl: string;
  githubApiUrl: string;
  githubAvatarUrl: string;
  githubAuthorizeRedirectUrl: string;
  githubClientId: string;
  /**
   * IMPORTANT: Do not hard code actual secrets.
   */
  githubClientSecret: string;
}

const TEST_GOOGLE_ANALYTICS_ID = 'G-PPMSZR9W18';
const FAKE_GITHUB_CLIENT_ID = 'FAKE_CLIENT_ID';
const FAKE_GITHUB_CLIENT_SECRET = 'FAKE_CLIENT_SECRET';

/**
 * Try to get the environment variable with the given name and throw if it's not
 * defined or is not an integer.
 */
const integerEnv = (name: string): number => {
  const val = process.env[name];
  if (!val || val.match(/^\d+$/) === null) {
    throw new Error(
      `Expected environment variable ${name} to be an integer` +
        ` but was ${JSON.stringify(val)}.`
    );
  }
  return Number(val);
};

/**
 * Try to get the environment variable with the given name and throw if it's not
 * defined or empty.
 */
const stringEnv = (name: string): string => {
  const val = process.env[name];
  if (!val) {
    throw new Error(
      `Expected environment variable ${name} to be set and non-empty` +
        ` but was ${JSON.stringify(val)}.`
    );
  }
  return val;
};

const environment = <T extends LitDevEnvironment>(env: T): T => env;

/**
 * lit.dev environment configuration for fast local dev mode with auto-reload.
 */
export const dev = environment({
  siteVersion: 'dev',
  mainPort: 5415,
  playgroundPort: 5416,
  fakeGithubPort: 5417,
  eleventyMode: 'dev',
  eleventyOutDir: '_dev',
  googleAnalyticsId: TEST_GOOGLE_ANALYTICS_ID,
  reportCspViolations: false,
  playgroundCdnBaseUrl: 'https://cdn.jsdelivr.net/npm',
  get mainUrl() {
    return `http://localhost:${this.mainPort}`;
  },
  get playgroundSandboxUrl() {
    return `http://localhost:${this.playgroundPort}/`;
  },
  get githubMainUrl() {
    return `http://localhost:${this.fakeGithubPort}/`;
  },
  get githubAvatarUrl() {
    return `http://localhost:${this.fakeGithubPort}/`;
  },
  get githubApiUrl() {
    // We fake both github.com and api.github.com with the same server, since
    // they don't have overlapping endpoint paths.
    return this.githubMainUrl;
  },
  get githubAuthorizeRedirectUrl() {
    return `http://localhost:${this.mainPort}/playground/signin/`;
  },
  githubClientId: FAKE_GITHUB_CLIENT_ID,
  githubClientSecret: FAKE_GITHUB_CLIENT_SECRET,
});

/**
 * lit.dev environment configuration for running a prod-ish environment locally.
 */
const local = environment({
  siteVersion: 'local',
  mainPort: 6415,
  playgroundPort: 6416,
  fakeGithubPort: 6417,
  eleventyMode: 'prod',
  eleventyOutDir: '_site',
  googleAnalyticsId: TEST_GOOGLE_ANALYTICS_ID,
  reportCspViolations: false,
  playgroundCdnBaseUrl: 'https://cdn.jsdelivr.net/npm',
  get mainUrl() {
    return `http://localhost:${this.mainPort}`;
  },
  get playgroundSandboxUrl() {
    return `http://localhost:${this.playgroundPort}/`;
  },
  get githubMainUrl() {
    return `http://localhost:${this.fakeGithubPort}/`;
  },
  get githubAvatarUrl() {
    return `http://localhost:${this.fakeGithubPort}/`;
  },
  get githubApiUrl() {
    // We fake both github.com and api.github.com with the same server, since
    // they don't have overlapping endpoint paths.
    return this.githubMainUrl;
  },
  get githubAuthorizeRedirectUrl() {
    return `http://localhost:${this.mainPort}/playground/signin/`;
  },
  githubClientId: FAKE_GITHUB_CLIENT_ID,
  githubClientSecret: FAKE_GITHUB_CLIENT_SECRET,
});

/**
 * lit.dev environment configuration for automatically generated test PRs.
 */
const pr = environment({
  get siteVersion() {
    return `pr-${stringEnv('SHORT_SHA')}`;
  },
  get mainPort() {
    // Assigned automatically and passed as an environment variable.
    return integerEnv('PORT');
  },
  get playgroundPort() {
    // Assigned automatically and passed as an environment variable.
    return integerEnv('PORT');
  },
  fakeGithubPort: undefined, // Does not run
  eleventyMode: 'prod',
  eleventyOutDir: '_site',
  googleAnalyticsId: TEST_GOOGLE_ANALYTICS_ID,
  reportCspViolations: false,
  playgroundCdnBaseUrl: 'https://cdn.jsdelivr.net/npm',
  get mainUrl() {
    const tag = stringEnv('REVISION_TAG');
    return `https://${tag}---lit-dev-5ftespv5na-uc.a.run.app`;
  },
  get playgroundSandboxUrl() {
    // Generated by cloudbuild-pr.yaml using the PR number and commit SHA and
    // passed as an environment variable.
    const tag = stringEnv('REVISION_TAG');
    return `https://${tag}---lit-dev-playground-5ftespv5na-uc.a.run.app/`;
  },
  githubMainUrl: 'https://github.com/',
  githubApiUrl: 'https://api.github.com/',
  githubAvatarUrl: 'https://avatars.githubusercontent.com/',
  get githubAuthorizeRedirectUrl() {
    return `https://${this.mainUrl}/playground/signin/`;
  },
  githubClientId: '8ce31b0fd06b1c442e69',
  get githubClientSecret() {
    return stringEnv('GITHUB_CLIENT_SECRET');
  },
});

/**
 * lit.dev environment configuration for the live production site.
 */
const prod = environment({
  get siteVersion() {
    return `prod-${stringEnv('SHORT_SHA')}`;
  },
  get mainPort() {
    // Assigned automatically and passed as an environment variable.
    return integerEnv('PORT');
  },
  get playgroundPort() {
    // Assigned automatically and passed as an environment variable.
    return integerEnv('PORT');
  },
  fakeGithubPort: undefined, // Does not run
  eleventyMode: 'prod',
  eleventyOutDir: '_site',
  googleAnalyticsId: 'G-FTZ6CJP9F3',
  reportCspViolations: true,
  playgroundCdnBaseUrl: 'https://cdn.jsdelivr.net/npm',
  mainUrl: 'https://lit.dev',
  playgroundSandboxUrl: 'https://playground.lit.dev/',
  githubMainUrl: 'https://github.com/',
  githubApiUrl: 'https://api.github.com/',
  githubAvatarUrl: 'https://avatars.githubusercontent.com/',
  githubAuthorizeRedirectUrl: 'https://lit.dev/playground/signin/',
  githubClientId: 'd5c8e81abdf8867459c1',
  get githubClientSecret() {
    return stringEnv('GITHUB_CLIENT_SECRET');
  },
});

const environments = {dev, local, pr, prod};

/**
 * Return the environment configuration matching the LITDEV_ENV environment
 * variable.
 */
export const getEnvironment = (): LitDevEnvironment => {
  const name = process.env.LITDEV_ENV;
  const env = environments[(name ?? '') as keyof typeof environments];
  if (!env) {
    throw new Error(
      `Expected environment variable LITDEV_ENV to be` +
        ` one of ${Object.keys(environments).join(', ')},` +
        ` but was ${JSON.stringify(name)}.`
    );
  }
  return env;
};
