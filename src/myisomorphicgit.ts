// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

import * as git from 'isomorphic-git'
import * as fs from 'fs';
import { ICommitInfo, ICommitEntry, CommitRepository } from './igit';

export class MyIsomorphicGit {

    constructor() {
    }

    public toICommitEntry(singleCommit: git.ReadCommitResult): ICommitEntry {
        return <ICommitEntry>  {
            committerTimestamp: singleCommit.commit.committer.timestamp,
            committerTZOffset :singleCommit.commit.committer.timezoneOffset,
            committerID: -1,
            message: singleCommit.commit.message
        }
    }

    public async GetLogs(gitRoot: string): Promise<ICommitInfo> {
        const self = this;
        return await new Promise<ICommitInfo>( async function(resolve, reject) {
            const commits: Array<git.ReadCommitResult> = await git.log({
                fs,
                dir: gitRoot
            });
            const commitRepository: CommitRepository = new CommitRepository();
            for (const singleCommit of commits) {
                commitRepository.addCommit(self.toICommitEntry(singleCommit), singleCommit.commit.committer.name);
            }
            return resolve(commitRepository.getCommitInfo());
        });
    }

    public async GetLogsForFile(gitRoot: string, pathToFile: string): Promise<ICommitInfo> {
        const self = this;
        return await new Promise<ICommitInfo>( async function(resolve, reject) {
            const commits: Array<git.ReadCommitResult> = await git.log({ fs, dir: gitRoot })
            const commitRepository: CommitRepository = new CommitRepository();
            let lastSHA: string | null = null
            let lastCommit: git.ReadCommitResult | null = null
            for (const singleCommit of commits) {
                try {
                    const o =  await git.readObject({ fs, dir: gitRoot, oid: singleCommit.oid, filepath: pathToFile });
                    if (o.oid !== lastSHA) {
                        if (lastSHA !== null && lastCommit !== null) {
                            commitRepository.addCommit(self.toICommitEntry(lastCommit), lastCommit.commit.committer.name);
                        }
                        lastSHA = o.oid
                    }
                } catch (err) {
                    // file no longer there
                    if (lastCommit !== null) {
                        commitRepository.addCommit(self.toICommitEntry(lastCommit), lastCommit.commit.committer.name);
                    }
                }
                lastCommit = singleCommit
            }
            return resolve(commitRepository.getCommitInfo());
        });
    }

}
