// Copyright (c) 2019 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';
import { expect } from 'chai';
import 'mocha';
import { getRelativePath} from '../src/igit';

describe('getRelativePath' , () => {

    it('getRelativePath', () => {
        expect(getRelativePath("/tmp/commons-lang", "/tmp/commons-lang/CONTRIBUTING.md")).to.equal("CONTRIBUTING.md");
    });

    it('getRelativePath with relativePath already', () => {
        expect(getRelativePath("/tmp/commons-lang", "CONTRIBUTING.md")).to.equal("CONTRIBUTING.md");
    });

});
