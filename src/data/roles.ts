import { UserRole, RolePermissions, UserProfile } from '../types';

export const ROLE_DEFINITIONS: Record<
  UserRole,
  {
    name: string;
    description: string;
    badgeColor: string;
    permissions: RolePermissions;
  }
> = {
  Administrator: {
    name: 'Administrator',
    description: 'Full administrative control. Configure live pods, set deterministic policies & tolerance caps, manage team roles, and authorize supervisor overrides.',
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-300',
    permissions: {
      canViewDashboard: true,
      canViewReports: true,
      canRunSimulations: true,
      canRunLivePods: true,
      canManageExceptions: true,
      canConfigureRules: true,
      canManageUsers: true,
      canExportAuditLogs: true,
    },
  },
  Operator: {
    name: 'Operator',
    description: 'Monitor active dashboard telemetry, manage live pods, resolve exception triage packets, and execute single & batch production runs.',
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-300',
    permissions: {
      canViewDashboard: true,
      canViewReports: true,
      canRunSimulations: true,
      canRunLivePods: true,
      canManageExceptions: true,
      canConfigureRules: false,
      canManageUsers: false,
      canExportAuditLogs: true,
    },
  },
  Analyst: {
    name: 'Analyst',
    description: 'View cost & ROI telemetry, run workflow simulations and stress tests, and explore predictive bottleneck intelligence. Read-only on live pod state.',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    permissions: {
      canViewDashboard: true,
      canViewReports: true,
      canRunSimulations: true,
      canRunLivePods: false,
      canManageExceptions: false,
      canConfigureRules: false,
      canManageUsers: false,
      canExportAuditLogs: false,
    },
  },
};

export const INITIAL_USER_PROFILES: UserProfile[] = [
  {
    id: 'usr-sarah-chen',
    name: 'Sarah Chen',
    email: 's.chen@enterprise-ops.internal',
    avatar: 'SC',
    role: 'Administrator',
    title: 'Lead Enterprise Systems Architect',
    department: 'Global Core Automation & Architecture',
    lastActive: 'Just now',
  },
  {
    id: 'usr-marcus-vance',
    name: 'Marcus Vance',
    email: 'm.vance@enterprise-ops.internal',
    avatar: 'MV',
    role: 'Operator',
    title: 'Senior Operations Watchstander',
    department: 'Casualty Claims & Triage Command',
    lastActive: '3 mins ago',
  },
  {
    id: 'usr-elena-rostova',
    name: 'Elena Rostova',
    email: 'e.rostova@enterprise-ops.internal',
    avatar: 'ER',
    role: 'Analyst',
    title: 'Cost-to-Income Optimization Lead',
    department: 'Process Excellence & Financial Engineering',
    lastActive: '12 mins ago',
  },
  {
    id: 'usr-david-kim',
    name: 'David Kim',
    email: 'd.kim@enterprise-ops.internal',
    avatar: 'DK',
    role: 'Operator',
    title: 'Tier-2 Exception Resolver',
    department: 'Vendor Reconciliation Operations',
    lastActive: '25 mins ago',
  },
];

export const INITIAL_USERS = INITIAL_USER_PROFILES;
