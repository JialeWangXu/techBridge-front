import { SessionSupport } from "./sessionSupport.model";
import { UserDto } from "./userDto.model";

export interface HelpRequestCreate {
  title: string;
  description: string;
  status: RequestStatus;
}

export interface HelpRequest extends HelpRequestCreate {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  supportSession?:SessionSupport;
  senior:UserDto;
  volunteer?:UserDto;
}

export enum RequestStatus{
  OPEN = "OPEN",
  FINDING_VOLUNTEER = "FINDING_VOLUNTEER",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}