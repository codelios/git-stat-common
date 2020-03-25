// Copyright (c) 2020 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT

'use strict';

import * as git from 'isomorphic-git'
import * as fs from 'fs';

export class MyIsomorphicGit {

    constructor() {
    }

    public OpenRepo(pathStr: string): Promise<string[]> {
        return git.listFiles({fs, dir: pathStr});
    }

}
