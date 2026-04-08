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
  status: RequestStatus;
  senior:UserDto;
  volunteer?:UserDto;
}

export enum RequestStatus{
  OPEN = "OPEN",
  ACCEPTED = "ACCEPTED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}