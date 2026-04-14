

export interface SupportSessionCreate {
    sessionMethod:SessionMethods;
    recordingConsent: boolean;  
    volunteerNotes?: string;
    helpRequestId: string;
}

export interface SupportSession {
    id: string;
    sessionMethod:SessionMethods;
    s3RecordingUrl?: string;
    recordingConsent: boolean;
    volunteerNotes?: string;
    status: HelpStatus;
    createdAt: Date;
    updatedAt: Date;
    helpRequest?:HelpStatus;
}

export enum HelpStatus {
    ACTIVE = "ACTIVE",
    CANCELLED = "CANCELLED",
    FINISHED = "FINISHED"
}

export enum SessionMethods {
    TELEPHONE = "TELEPHONE",
    ONLINE_MEETING = "ONLINE_MEETING",
    IN_PERSON = "IN_PERSON"
}