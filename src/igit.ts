// Copyright (c) 2020 MalvaHQ
//
// This software is released under the MIT License.
// https://opensource.org/licenses/MIT
'use strict';


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

    GetLogsForFile(gitRoot: string, pathToFile: string): Promise<ICommitInfo>;

}


export class CommitRepository {

    myCommits = Array<ICommitEntry>();

    globalCommitterID: number = 1;

    commitDict: Map<number, string> = new Map<number, string>();

    reverseDict: Map<string, number> = new Map<string, number>();

    public addCommit(commitEntry: ICommitEntry, commitKey: string) {
        let committerID: number|undefined = this.reverseDict.get(commitKey);
        if (committerID === undefined || committerID === null) {
            this.commitDict.set(this.globalCommitterID, commitKey);
            this.reverseDict.set(commitKey, this.globalCommitterID);
            committerID = this.globalCommitterID;
            this.globalCommitterID++;
        }
        commitEntry.committerID = committerID;
        this.myCommits.push(commitEntry);
    }

    public getCommitInfo(): ICommitInfo {
        return <ICommitInfo> {
            commits: this.myCommits,
            commitDict: this.commitDict
        }
    }


}