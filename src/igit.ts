// Copyright (c) 2020 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';


export interface ICommitInfo {

    committerTimestamp: number;

    committerName: string;

    message: string;
}

export interface IGit {

    GetLogs(gitRoot: string): Promise<Array<ICommitInfo>>;

    GetLogForFile(gitRoot: string, pathToFile: string): Promise<Array<ICommitInfo>>;

}

