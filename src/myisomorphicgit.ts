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

    public GetLogs(gitRoot: string): Promise<ICommitInfo> {
        return new Promise<ICommitInfo>( function(resolve, reject) {
            git.log({
                fs,
                dir: gitRoot
            }).then(
                (commits: Array<git.ReadCommitResult>) => {
                    const commitRepository: CommitRepository = new CommitRepository();
                    for (const singleCommit of commits) {
                        commitRepository.addCommit(
                            <ICommitEntry>  {
                                committerTimestamp: singleCommit.commit.committer.timestamp,
                                committerID: -1,
                                message: singleCommit.commit.message
                            },
                            singleCommit.commit.committer.name
                        );
                    }
                    return resolve(commitRepository.getCommitInfo());
                },
                err => reject(err)
            );
        });
    }

    public GetLogForFile(gitRoot: string, pathToFile: string): Promise<ICommitInfo> {
        return new Promise<ICommitInfo>( function(resolve, reject) {
            git.log({
                fs,
                dir: gitRoot
            }).then(
                (commits: Array<git.ReadCommitResult>) => {
                    const commitRepository: CommitRepository = new CommitRepository();
                    for (const singleCommit of commits) {
                        commitRepository.addCommit(
                            <ICommitEntry>  {
                                committerTimestamp: singleCommit.commit.committer.timestamp,
                                committerID: -1,
                                message: singleCommit.commit.message
                            },
                            singleCommit.commit.committer.name
                        );
                    }
                    return resolve(commitRepository.getCommitInfo());
                },
                err => reject(err)
            );
        });
    }

}
