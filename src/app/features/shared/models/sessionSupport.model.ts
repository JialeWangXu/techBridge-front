

export interface SessionSupportCreate {
    sessionMethod:SessionMethods;
    recordingConsent: boolean;  
    volunteerNotes?: string;
    helpRequestId: string;
}

export interface SessionSupport {
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
    PENDING = "PENDING",
    ACTIVE = "ACTIVE",
    FINISHED = "FINISHED"
}

export enum SessionMethods {
    TELEPHONE = "TELEPHONE",
    ONLINE_MEETING = "ONLINE_MEETING",
    IN_PERSON = "IN_PERSON"
}