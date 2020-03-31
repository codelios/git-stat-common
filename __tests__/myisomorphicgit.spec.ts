// Copyright (c) 2019 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';
import { expect } from 'chai';
import 'mocha';
import { MyIsomorphicGit} from '../src/myisomorphicgit';
import { ICommitInfo} from '../src/igit';
import { Config } from '../src/config';

describe('MyIsomorphicGit class' , () => {

    it('GetLogs', (done) => {
        const gitClient: MyIsomorphicGit = new MyIsomorphicGit();
        const filePath = "/tmp/commons-lang";
        gitClient.GetLogs(filePath).then(
            (commitInfo: ICommitInfo) => {
                expect(commitInfo).to.be.not.null;
                expect(commitInfo.commits.length).to.be.greaterThan(0);
                expect(commitInfo.commitDict.size).to.be.greaterThan(0);
                for ( const commit of commitInfo.commits) {
                    expect(commit.message.length).to.be.greaterThan(0);
                    expect(commit.committerID).to.be.greaterThan(-1);
                }
            },
            err => {
                expect(err).to.be.null;
            }
        ).finally(done);
    });

    it('GetLogsForFile', (done) => {
        const gitClient: MyIsomorphicGit = new MyIsomorphicGit();
        const dirPath = "/tmp/commons-lang";
        const config: Config = new Config();
        gitClient.GetLogsForFile(config, dirPath, "CONTRIBUTING.md").then(
            (commitInfo: ICommitInfo) => {
                expect(commitInfo).to.be.not.null;
                expect(commitInfo.commits.length).to.be.greaterThan(0);
                expect(commitInfo.commitDict.size).to.be.greaterThan(0);
                let count = 0;
                for ( const commit of commitInfo.commits) {
                    expect(commit.message.length).to.be.greaterThan(0);
                    expect(commit.committerID).to.be.greaterThan(-1);
                    count++;
                    if (count < 10) {
                        const committerName = commitInfo.commitDict.get(commit.committerID);
                        console.log(committerName + " " + new Date(commit.committerTimestamp*1000) + " " + commit.message);
                    }
                }
            },
            err => {
                expect(err).to.be.null;
            }
        ).finally(done);
    });
});
