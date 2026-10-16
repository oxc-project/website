---
title: Security Policy
outline: deep
---

# Security Policy

The following security policies are applied to all projects within the [oxc-project](https://github.com/oxc-project) organization.

Please inform [@boshen](https://github.com/Boshen) if you notice any oversights.

https://www.npmjs.com/~boshen and https://crates.io/users/Boshen are the only accounts with publish access to our packages and crates.

## Reporting a vulnerability

To report a security vulnerability, follow our [organization security policy](https://github.com/oxc-project/.github/blob/main/SECURITY.md).

## github.com

- Required two-factor authentication for everyone in the organization
  - Only secure two-factor methods are allowed
- Enabled GitHub Security Scanning, including secret scanning
- GitHub Actions: Required all actions to be pinned to a full-length commit SHA
- Enabled release immutability — assets and tags cannot be modified once a release is published
- Required signed commits: https://docs.github.com/en/authentication/managing-commit-signature-verification/signing-commits
  - Not enforced in repository settings; otherwise external contributors would not be able to contribute
- Long-lived tokens are not stored for publishing — see trusted publishing for [npmjs.com](http://npmjs.com) and [crates.io](http://crates.io) below
- Enabled Renovate Bot for security updates
- Using https://docs.zizmor.sh to lint GitHub Actions for common security issues

## npmjs.com

- Enforced 2FA for login
- Published with `npm publish --provenance`: https://docs.npmjs.com/generating-provenance-statements
- Published with trusted publishing: https://docs.npmjs.com/trusted-publishers
- Installed Socket Security
- Enabled Renovate Bot's `"minimumReleaseAge": "3 days"` to avoid updating packages released within the past 3 days
- Uses pnpm: https://pnpm.io/supply-chain-security
  - No automatic `postinstall` scripts

## crates.io

- Published with trusted publishing: https://crates.io/docs/trusted-publishing
- Using `cargo deny` to check dependencies against the Rust advisory database (https://rustsec.org).
