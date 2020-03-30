// Copyright (c) 2019 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';
import { expect } from 'chai';
import 'mocha';
import { MyIsomorphicGit} from '../src/myisomorphicgit';
import { ICommitInfo} from '../src/igit';

describe('MyIsomorphicGit class' , () => {

    it('GetLogs', (done) => {
        const gitClient: MyIsomorphicGit = new MyIsomorphicGit();
        const filePath = "/opt/code/src/github.com/apache/commons-lang";
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
        const dirPath = "/opt/code/src/github.com/apache/commons-lang";
        gitClient.GetLogsForFile(dirPath, "CONTRIBUTING.md").then(
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
});
