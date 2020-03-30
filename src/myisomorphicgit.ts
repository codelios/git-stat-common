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

    addCommit(commitRepository: CommitRepository, singleCommit: git.ReadCommitResult) {
        commitRepository.addCommit(this.toICommitEntry(singleCommit),
                    singleCommit.commit.committer.name + singleCommit.commit.committer.email,
                    singleCommit.commit.committer.name);

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
                self.addCommit(commitRepository, singleCommit);
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
                            self.addCommit(commitRepository, lastCommit);
                        }
                        lastSHA = o.oid
                    }
                } catch (err) {
                    // file no longer there
                    if (lastCommit !== null) {
                        self.addCommit(commitRepository, lastCommit);
                    }
                }
                lastCommit = singleCommit
            }
            return resolve(commitRepository.getCommitInfo());
        });
    }

}
