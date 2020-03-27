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
            (commits: Array<ICommitInfo>) => {
                expect(commits).to.be.not.null;
                expect(commits.length).to.be.greaterThan(0);
            },
            err => {
                expect(err).to.be.null;
            }
        ).finally(done);
    });
});
