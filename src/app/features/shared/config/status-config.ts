import { RequestStatus } from '../models/helpRequest.model';
import { HelpStatus } from '../models/supportSession.model';

export interface StatusVisualConfig {
  color: string;
  icon: string;
  text: string;
}

export const REQUEST_STATUS_CONFIG: Record<RequestStatus, StatusVisualConfig> = {
  [RequestStatus.OPEN]: {
    color: '#28a745',
    icon: 'bi-door-open-fill',
    text: 'Abierta',
  },
  [RequestStatus.FINDING_VOLUNTEER]: {
    color: '#0d6efd',
    icon: 'bi-person-check-fill',
    text: 'Encontrando voluntario',
  },
  [RequestStatus.IN_PROGRESS]: {
    color: '#ffc107',
    icon: 'bi-hourglass-split',
    text: 'En curso',
  },
  [RequestStatus.COMPLETED]: {
    color: '#6c757d',
    icon: 'bi-check-circle-fill',
    text: 'Completada',
  },
  [RequestStatus.CANCELLED]: {
    color: '#dc3545',
    icon: 'bi-x-circle-fill',
    text: 'Cancelada',
  },
};

export const HELP_STATUS_CONFIG: Record<HelpStatus, StatusVisualConfig> = {
  [HelpStatus.ACTIVE]: {
    color: '#28a745',
    icon: 'bi-door-open-fill',
    text: 'Abierta',
  },
  [HelpStatus.FINISHED]: {
    color: '#6c757d',
    icon: 'bi-check-circle-fill',
    text: 'Completada',
  },
  [HelpStatus.CANCELLED]: {
    color: '#dc3545',
    icon: 'bi-x-circle-fill',
    text: 'Cancelada',
  },
};
