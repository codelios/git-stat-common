// Copyright (c) 2020 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';


export interface IGit {

    OpenRepo(path: string) : Promise<string[]>;
}