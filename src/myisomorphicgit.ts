// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

import * as git from 'isomorphic-git'
import * as fs from 'fs';
import { ICommitInfo } from './igit';

export class MyIsomorphicGit {

    constructor() {
    }

    public GetLogs(gitRoot: string): Promise<Array<ICommitInfo>> {
        return new Promise<Array<ICommitInfo>>( function(resolve, reject) {
            git.log({
                fs,
                dir: gitRoot
            }).then(
                (commits: Array<git.ReadCommitResult>) => {
                    const myCommits = Array<ICommitInfo>();
                    for (const singleCommit of commits) {
                        myCommits.push(
                            <ICommitInfo> {
                                committerTimestamp: singleCommit.commit.committer.timestamp,
                                committerName: singleCommit.commit.committer.name,
                                message: singleCommit.commit.message
                            }
                        )
                    }
                    return resolve(myCommits);
                },
                err => reject(err)
            );
        });
    }

    public GetLogForFile(gitRoot: string, pathToFile: string): Promise<Array<ICommitInfo>> {
        return new Promise<Array<ICommitInfo>>( function(resolve, reject) {
            git.log({
                fs,
                dir: gitRoot
            }).then(
                (commits: Array<git.ReadCommitResult>) => {
                    const myCommits = Array<ICommitInfo>();
                    for (const singleCommit of commits) {
                        myCommits.push(
                            <ICommitInfo>  {
                                committerTimestamp: singleCommit.commit.committer.timestamp,
                                committerName: singleCommit.commit.committer.name,
                                message: singleCommit.commit.message
                            }
                        )
                    }
                    return resolve(myCommits);
                },
                err => reject(err)
            );
        });
    }

}
