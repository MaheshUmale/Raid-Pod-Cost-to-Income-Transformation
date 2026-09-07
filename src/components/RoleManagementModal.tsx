import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Users, 
  Lock, 
  Check, 
  X, 
  AlertCircle, 
  Key, 
  Sliders, 
  Activity,
  Info
} from 'lucide-react';
import { UserRole, UserProfile, RolePermissions } from '../types';
import { ROLE_DEFINITIONS } from '../data/roles';

interface RoleManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSwitchUser: (user: UserProfile) => void;
  allUsers: UserProfile[];
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
}

export const RoleManagementModal: React.FC<RoleManagementModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSwitchUser,
  allUsers,
  onUpdateUserRole,
}) => {
  const [activeTab, setActiveTab] = useState<'matrix' | 'roster'>('matrix');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isAdmin = currentUser.role === 'Administrator';

  const handleRoleChange = (userId: string, role: UserRole) => {
    if (!isAdmin) {
      alert('Only Administrators can modify team user roles.');
      return;
    }
    onUpdateUserRole(userId, role);
    setSuccessMessage(`Updated user role to ${role}`);
    setTimeout(() => setSuccessMessage(null), 3000);
  };

  const permissionKeys: { key: keyof RolePermissions; label: string; desc: string }[] = [
    { key: 'canViewDashboard', label: 'View Dashboard & Telemetry', desc: 'Real-time telemetry, transaction metrics, and DAG monitor.' },
    { key: 'canViewReports', label: 'View Cost & Token Reports', desc: 'Unit economics, token spend, and financial ROI breakdown.' },
    { key: 'canRunSimulations', label: 'Run Simulations & Stress Tests', desc: 'Execute batch workloads, concurrency jitter, and bottleneck forecasts.' },
    { key: 'canRunLivePods', label: 'Trigger Live Pod Transactions', desc: 'Execute live STP injections and simulated fault transactions on core bridges.' },
    { key: 'canManageExceptions', label: 'Resolve & Override Exceptions', desc: 'Authorize supervisor overrides and commitment to core legacy systems.' },
    { key: 'canConfigureRules', label: 'Configure Deterministic Rules & Caps', desc: 'Tune financial tolerance caps, policy limits, and ISO checksum rules.' },
    { key: 'canManageUsers', label: 'Manage Roles & Team Access', desc: 'Assign user roles, edit role permissions, and provision team members.' },
    { key: 'canExportAuditLogs', label: 'Export Cryptographic Audit Logs', desc: 'Download cryptographically signed compliance audit trails for SOC2/ISO.' },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-300 rounded-2xl max-w-4xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-stone-900 text-stone-100 p-6 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-stone-100">
                  Role-Based Access Control (RBAC) & User Management
                </h2>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${ROLE_DEFINITIONS[currentUser.role].badgeColor}`}>
                  Active: {currentUser.role}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                Enforce principle of least privilege across Raid Pod orchestration, rule authoring, and legacy system injection.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Switcher Quick Bar */}
        <div className="bg-stone-100 border-b border-stone-200 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-stone-500 font-medium">Quick Persona Switcher:</span>
            <div className="flex flex-wrap gap-1.5">
              {allUsers.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => onSwitchUser(u)}
                    className={`px-2.5 py-1 rounded-md font-medium text-xs flex items-center gap-1.5 transition-all ${
                      isSelected
                        ? 'bg-stone-900 text-white shadow-xs'
                        : 'bg-white text-stone-700 border border-stone-300 hover:bg-stone-200'
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                      {u.avatar}
                    </span>
                    <span>{u.name}</span>
                    <span className="text-[10px] opacity-75 font-mono">({u.role})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center space-x-1 border border-stone-300 bg-white rounded-lg p-0.5">
            <button
              onClick={() => setActiveTab('matrix')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === 'matrix' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Permission Matrix
            </button>
            <button
              onClick={() => setActiveTab('roster')}
              className={`px-3 py-1 rounded text-xs font-semibold transition-colors ${
                activeTab === 'roster' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Team Roster ({allUsers.length})
            </button>
          </div>
        </div>

        {/* Feedback alert */}
        {successMessage && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2 text-xs font-medium text-emerald-800 flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'matrix' ? (
            <div className="space-y-6">
              {/* Role Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {(Object.keys(ROLE_DEFINITIONS) as UserRole[]).map((roleKey) => {
                  const role = ROLE_DEFINITIONS[roleKey];
                  const isCurrentRole = currentUser.role === roleKey;
                  return (
                    <div
                      key={roleKey}
                      className={`rounded-xl p-4 border transition-all ${
                        isCurrentRole
                          ? 'bg-amber-50/50 border-amber-400 ring-1 ring-amber-400/40'
                          : 'bg-white border-stone-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${role.badgeColor}`}>
                          {role.name}
                        </span>
                        {isCurrentRole && (
                          <span className="text-[10px] font-mono text-amber-800 font-bold bg-amber-100 px-2 py-0.5 rounded">
                            YOU
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                        {role.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Permission Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden shadow-xs">
                <table className="min-w-full divide-y divide-stone-200 text-xs">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-stone-700">Permission Scope</th>
                      <th className="py-3 px-4 text-center font-semibold text-purple-900 bg-purple-50/50">
                        Administrator
                      </th>
                      <th className="py-3 px-4 text-center font-semibold text-blue-900 bg-blue-50/50">
                        Operator
                      </th>
                      <th className="py-3 px-4 text-center font-semibold text-emerald-900 bg-emerald-50/50">
                        Analyst
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {permissionKeys.map((item) => (
                      <tr key={item.key} className="hover:bg-stone-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-semibold text-stone-900">{item.label}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">{item.desc}</div>
                        </td>
                        <td className="py-3 px-4 text-center bg-purple-50/20">
                          {ROLE_DEFINITIONS.Administrator.permissions[item.key] ? (
                            <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="inline-flex p-1 rounded-full bg-stone-100 text-stone-400">
                              <X className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center bg-blue-50/20">
                          {ROLE_DEFINITIONS.Operator.permissions[item.key] ? (
                            <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="inline-flex p-1 rounded-full bg-stone-100 text-stone-400">
                              <X className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-center bg-emerald-50/20">
                          {ROLE_DEFINITIONS.Analyst.permissions[item.key] ? (
                            <span className="inline-flex p-1 rounded-full bg-emerald-100 text-emerald-700">
                              <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </span>
                          ) : (
                            <span className="inline-flex p-1 rounded-full bg-stone-100 text-stone-400">
                              <X className="w-3.5 h-3.5" />
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-stone-600 bg-stone-50 border border-stone-200 rounded-lg p-3">
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-stone-500" />
                  <span>
                    Role assignments govern access to live pod triggers, supervisor overrides, and rule adjustments.
                  </span>
                </div>
                {!isAdmin && (
                  <span className="text-amber-700 font-mono text-[11px] bg-amber-50 px-2 py-1 rounded border border-amber-200">
                    Switch to Administrator to edit roles
                  </span>
                )}
              </div>

              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <table className="min-w-full divide-y divide-stone-200 text-xs">
                  <thead className="bg-stone-50">
                    <tr>
                      <th className="py-3 px-4 text-left font-semibold text-stone-700">Team Member</th>
                      <th className="py-3 px-4 text-left font-semibold text-stone-700">Department / Role Title</th>
                      <th className="py-3 px-4 text-left font-semibold text-stone-700">Assigned Role</th>
                      <th className="py-3 px-4 text-right font-semibold text-stone-700">Last Active</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200 bg-white">
                    {allUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-stone-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2.5">
                            <span className="w-7 h-7 rounded-full bg-stone-900 text-amber-400 font-bold text-xs flex items-center justify-center">
                              {user.avatar}
                            </span>
                            <div>
                              <div className="font-bold text-stone-900 flex items-center gap-1.5">
                                {user.name}
                                {user.id === currentUser.id && (
                                  <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-1.5 py-0.2 rounded font-normal">
                                    Current
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-stone-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-600">
                          <div className="font-medium text-stone-800">{user.title}</div>
                          <div className="text-[11px] text-stone-500">{user.department}</div>
                        </td>
                        <td className="py-3 px-4">
                          {isAdmin ? (
                            <select
                              value={user.role}
                              onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                              className="bg-white border border-stone-300 rounded px-2 py-1 text-xs font-semibold text-stone-800 focus:ring-1 focus:ring-amber-500 focus:outline-none"
                            >
                              <option value="Administrator">Administrator</option>
                              <option value="Operator">Operator</option>
                              <option value="Analyst">Analyst</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-0.5 rounded text-[11px] font-mono border ${ROLE_DEFINITIONS[user.role].badgeColor}`}>
                              {user.role}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-stone-500 font-mono text-[11px]">
                          {user.lastActive}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-6 py-4 flex items-center justify-between text-xs text-stone-500">
          <div className="flex items-center space-x-2 font-mono">
            <Lock className="w-3.5 h-3.5 text-stone-400" />
            <span>Strict RBAC Security Enforcement Active</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white rounded-lg font-semibold transition-colors"
          >
            Close RBAC Panel
          </button>
        </div>
      </div>
    </div>
  );
};
