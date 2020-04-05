// Copyright (c) 2020 GitLios
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';
import { Config } from './config';
import * as path from 'path';

export interface ICommitEntry {

    /**
     * A reference to a dictionary
     */
    committerID: number;

    /**
     * Commit message
     */
    message: string;

    /**
     * UTC Unix timestamp in seconds
     */
    committerTimestamp: number;

    /**
     * Timezone difference from UTC in minutes
     */
    committerTZOffset: number;
}

export interface ICommitInfo {

    /**
     * List of commits for the given criteria
     */
    commits: Array<ICommitEntry>;

    /**
     * CommitDict with the cross reference between id and the name of the committer.
     */
    commitDict: Map<number, string>;
}


export interface IGit {

    GetLogs(gitRoot: string): Promise<ICommitInfo>;

    GetLogsForFile(config: Config, gitRoot: string, pathToFile: string): Promise<ICommitInfo>;

}


export class CommitRepository {

    myCommits = Array<ICommitEntry>();

    globalCommitterID: number = 1;

    commitDict: Map<number, string> = new Map<number, string>();

    reverseDict: Map<string, number> = new Map<string, number>();

    count: number = 0;

    public addCommit(commitEntry: ICommitEntry, commitKey: string, persistInfo: string): number {
        let committerID: number|undefined = this.reverseDict.get(commitKey);
        if (committerID === undefined || committerID === null) {
            this.commitDict.set(this.globalCommitterID, persistInfo);
            this.reverseDict.set(commitKey, this.globalCommitterID);
            committerID = this.globalCommitterID;
            this.globalCommitterID++;
        }
        commitEntry.committerID = committerID;
        this.myCommits.push(commitEntry);
        this.count++;
        return this.count;
    }

    public end() {
        this.reverseDict.clear();
    }

    public getCommitInfo(): ICommitInfo {
        return <ICommitInfo> {
            commits: this.myCommits,
            commitDict: this.commitDict
        };
    }
}

/**
 * getRelativePath returns the relative path for `fsPath` relative to `gitRoot` .
 * @param gitRoot
 * @param fsPath
 */
export function getRelativePath(gitRoot: string, fsPath: string) : string {
    const candidate = path.relative(gitRoot, fsPath);
    if (candidate.startsWith("..")) {
        return fsPath;
    } else {
        return candidate;
    }
}