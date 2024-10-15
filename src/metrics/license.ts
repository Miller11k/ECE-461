import * as fs from 'fs';
import * as path from 'path';
import git from 'isomorphic-git';
import http from 'isomorphic-git/http/node';
import { getTimestampWithThreeDecimalPlaces } from './getLatency';
import { logger } from '../logFile';

const GITHUB_TOKEN = process.env.GITHUB_TOKEN; // Store your token in environment variables for security

export async function getLicenseScore(URL: string): Promise<{ score: number, latency: number }> {    
    const latency_start = getTimestampWithThreeDecimalPlaces(); // Start timing the fetch

    let gitURL: string | null = "";
    gitURL = URL.replace(/^git\+/, '')
                .replace(/^ssh:\/\/git@github.com/, 'https://github.com')
                .replace(/\.git$/, '')
                .replace(/^git:\/\//, 'https://');
    const repoName = gitURL.split('/').pop();
    const repoDir = `./temp-${repoName}`; // Directory to clone the repo into

    try {
        // Clone the repository
        await git.clone({
            fs,
            http,
            dir: repoDir,
            url: gitURL,
            singleBranch: true,
            depth: 1, // Only clone the latest commit for performance
            onAuth: () => ({
                username: GITHUB_TOKEN, // Use the GitHub token as the username
                password: 'x-oauth-basic' // GitHub tokens are passed as the password
            })
        });

        // Check for a LICENSE file in the root of the repo
        const licenseInfo = await extractLicenseInfo(repoDir);
        let license_score: number = 0;
        
        if (licenseInfo) {
            // Read the LICENSE file content
            license_score = checkLicenseCompatibility(licenseInfo);
            logger.debug(`getLicenseScore LICENSE file found and compatibility checked. Score: ${license_score}`);
        } else {
            logger.debug('getLicenseScore No LICENSE file found. Score remains 0.');
        }

        // Calculate latency
        const latencyMs = parseFloat((getTimestampWithThreeDecimalPlaces() - latency_start).toFixed(3));
        logger.debug(`getLicenseScore Latency calculation complete. Latency: ${latencyMs} ms`);

        return { score: license_score, latency: latencyMs };
    } catch (error: any) {
        logger.error(`getLicenseScore Error occurred during license score calculation. Error: ${error.message}`);
        throw error; // Re-throw the error after logging
    } finally {
        // Clean up the cloned repository to avoid clutter
        fs.rmSync(repoDir, { recursive: true, force: true });
        logger.debug(`getLicenseScore Temporary repository directory cleaned up.', Directory: ${repoDir}`);
    }
}

async function extractLicenseInfo(cloneDir: string): Promise<string | null> {
    let licenseInfo: string | null = null;

    // Ensure the directory exists
    if (!fs.existsSync(cloneDir)) {
        logger.error(`Directory does not exist: ${cloneDir}`);
        return null;
    }

    // Case-insensitive file search for README (e.g., README.md, README.MD)
    const readmeFiles = fs.readdirSync(cloneDir)?.filter(file =>
        file.match(/^readme\.(md|txt)?$/i)
    );

    if (readmeFiles.length > 0) {
        const readmePath = path.join(cloneDir, readmeFiles[0]);
        const readmeContent = fs.readFileSync(readmePath, 'utf-8');
        const licenseSection = readmeContent.match(/##\s*(Licence|Legal)(\s|\S)*/i);
        if (licenseSection) {
            licenseInfo = licenseSection[0];
        }
    }

    // Case-insensitive file search for LICENSE (e.g., LICENSE.txt, license.md)
    const licenseFiles = fs.readdirSync(cloneDir)?.filter(file =>
        file.match(/^licen[sc]e(\..*)?$/i)
    );

    if (licenseFiles.length > 0) {
        const licenseFilePath = path.join(cloneDir, licenseFiles[0]);
        const licenseContent = fs.readFileSync(licenseFilePath, 'utf-8');
        if (licenseInfo) {
            licenseInfo += '\n' + licenseContent;
        } else {
            licenseInfo = licenseContent;
        }
    }

    return licenseInfo;
}

function checkLicenseCompatibility(licenseText: string): number {
    const compatibleLicenses = [
        'LGPL-2.1',
        'LGPL-2.1-only',
        'LGPL-2.1-or-later',
        'GPL-2.0',
        'GPL-2.0-only',
        'GPL-2.0-or-later',
        'MIT',
        'BSD-2-Clause',
        'BSD-3-Clause',
        'Apache-2.0',
        'MPL-1.1',
        'GNU GENERAL PUBLIC LICENSE',
    ];

    // Simple regex to find the license type in the text
    const licenseRegex = new RegExp(compatibleLicenses.join('|'), 'i');
    return licenseRegex.test(licenseText) ? 1 : 0;
}