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
            committerID: -1,
            message: singleCommit.commit.message
        }
    }

    public GetLogs(gitRoot: string): Promise<ICommitInfo> {
        const self = this;
        return new Promise<ICommitInfo>( function(resolve, reject) {
            git.log({
                fs,
                dir: gitRoot
            }).then(
                (commits: Array<git.ReadCommitResult>) => {
                    const commitRepository: CommitRepository = new CommitRepository();
                    for (const singleCommit of commits) {
                        commitRepository.addCommit(self.toICommitEntry(singleCommit), singleCommit.commit.committer.name);
                    }
                    return resolve(commitRepository.getCommitInfo());
                },
                err => reject(err)
            );
        });
    }

    public GetLogsForFile(gitRoot: string, pathToFile: string): Promise<ICommitInfo> {
        const self = this;
        return new Promise<ICommitInfo>( function(resolve, reject) {
            git.log({
                fs,
                dir: gitRoot
            }).then(
                (commits: Array<git.ReadCommitResult>) => {
                    const commitRepository: CommitRepository = new CommitRepository();
                    let lastSHA: string | null = null
                    let lastCommit: git.ReadCommitResult | null = null
                    for (const singleCommit of commits) {
                        git.readObject({ fs, dir: gitRoot, oid: singleCommit.oid, filepath: pathToFile }).then(
                            (o: any) => {
                                if (o.oid !== lastSHA) {
                                    if (lastSHA !== null && lastCommit !== null) {
                                        commitRepository.addCommit(self.toICommitEntry(lastCommit), lastCommit.commit.committer.name);
                                    }
                                    lastSHA = o.oid
                                }
                                lastCommit = singleCommit
                            },
                            err => {
                                // file no longer there
                                if (lastCommit !== null) {
                                    commitRepository.addCommit(self.toICommitEntry(lastCommit), lastCommit.commit.committer.name);
                                }
                                lastCommit = singleCommit
                            }
                        )
                    }
                    return resolve(commitRepository.getCommitInfo());
                },
                err => reject(err)
            );
        });
    }

}
