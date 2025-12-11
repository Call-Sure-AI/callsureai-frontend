// app/dashboard/access-manager/page.tsx
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  Users,
  Mail,
  Shield,
  Search,
  Loader2,
  UserPlus,
  Crown,
  Briefcase,
  FolderKey,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Send,
  Sparkles,
  UserCheck,
  Settings,
  Trash2,
} from "lucide-react";
import {
  AccessLevel,
  AccessLevelName,
  SelectedAccessMap,
  User,
} from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { useCompany } from "@/contexts/company-context";
import { useIsAuthenticated } from "@/hooks/use-is-authenticated";
import { useCurrentUser } from "@/hooks/use-current-user";
import AccessDenied from "@/components/dashboard/access-denied";

const AccessManagerDashboard: React.FC = () => {
  const { company } = useCompany();
  const { token } = useIsAuthenticated();
  const { user } = useCurrentUser();
  const [email, setEmail] = useState<string>("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [selectedAccess, setSelectedAccess] = useState<SelectedAccessMap>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<User[]>([]);

  // Map roles to access levels
  const mapRoleToAccessLevel = (role: string): AccessLevelName => {
    switch (role) {
      case "admin":
        return "Admin Access";
      case "manager":
        return "Projects Access";
      default:
        return "Custom Projects Access";
    }
  };

  // Map access levels to roles
  const mapAccessLevelToRole = (accessLevel: AccessLevelName): string => {
    switch (accessLevel) {
      case "Admin Access":
        return "admin";
      case "Projects Access":
        return "manager";
      case "Custom Projects Access":
        return "member";
      default:
        return "member";
    }
  };

  // Define fetchPendingInvitations with useCallback
  const fetchPendingInvitations = useCallback(async () => {
    if (!company?.id || !token) return;
    
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/list/${company?.id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const invitationUsers = data.invitations.map((invitation: any) => ({
        id: `invitation-${invitation.id}`,
        email: invitation.email,
        status: invitation.status,
        role: invitation.role,
      }));

      setUsers((prev) => {
        const filteredUsers = prev.filter(
          (user) =>
            !invitationUsers.some(
              (invUser: any) => invUser.email === user.email,
            ),
        );
        return [...filteredUsers, ...invitationUsers];
      });

      const accessMap: SelectedAccessMap = {};
      data.invitations.forEach((invitation: any) => {
        accessMap[`invitation-${invitation.id}`] = mapRoleToAccessLevel(
          invitation.role,
        );
      });
      setSelectedAccess((prev) => ({ ...prev, ...accessMap }));
    } catch (error) {
      console.error("Error fetching invitations:", error);
      toast({
        title: "Error",
        description: "Failed to load pending invitations",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [company?.id, token]);

  useEffect(() => {
    fetchPendingInvitations();
  }, [fetchPendingInvitations]);

  const accessLevels: AccessLevel[] = [
    { name: "Admin Access", icon: Crown, description: "Full access to all features and settings" },
    { name: "Projects Access", icon: Briefcase, description: "Access to manage projects and teams" },
    { name: "Custom Projects Access", icon: FolderKey, description: "Limited access to specific projects" },
  ];

  const toggleDropdown = (userId: string): void => {
    setOpenDropdownId(openDropdownId === userId ? null : userId);
  };

  const handleAccessSelect = (
    userId: string,
    accessName: AccessLevelName,
  ): void => {
    setSelectedAccess((prev) => ({
      ...prev,
      [userId]: accessName,
    }));
    setOpenDropdownId(null);
  };

  const handleAddUser = async (): Promise<void> => {
    if (!email || !company?.id) return;

    try {
      setIsLoading(true);

      const role = mapAccessLevelToRole(
        selectedAccess[`temp-${email}`] || "Admin Access",
      );

      const { data } = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/generate`,
        {
          email,
          companyId: company.id,
          role,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/send-email`,
        {
          invitationId: data.invitation.id,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      toast({
        title: "Success",
        description: `Invitation sent to ${email}`,
      });

      const newUser: User = {
        id: `invitation-${data.invitation.id}`,
        email,
        status: "pending",
        role,
      };

      setUsers((prev) => [...prev, newUser]);
      setSelectedAccess((prev) => ({
        ...prev,
        [`invitation-${data.invitation.id}`]: mapRoleToAccessLevel(role),
      }));

      setEmail("");
    } catch (err: any) {
      console.error("Error sending invitation:", err);
      toast({
        title: "Error",
        description: err.response?.data?.error || "Failed to send invitation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveUser = async (userId: string): Promise<void> => {
    if (userId.startsWith("invitation-")) {
      const invitationId = userId.replace("invitation-", "");

      try {
        setIsLoading(true);

        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${invitationId}/delete`,
          {},
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast({
          title: "Success",
          description: "Invitation deleted successfully",
        });
      } catch (err: any) {
        console.error("Error deleting invitation:", err);
        toast({
          title: "Error",
          description: err.response?.data?.detail || "Failed to delete invitation",
          variant: "destructive",
        });
        return;
      } finally {
        setIsLoading(false);
      }
    }

    setUsers((prev) => prev.filter((user) => user.id !== userId));
    const newSelectedAccess = { ...selectedAccess };
    delete newSelectedAccess[userId];
    setSelectedAccess(newSelectedAccess);
  };

  const handleInviteSelected = async (): Promise<void> => {
    if (users.length === 0) return;

    toast({
      title: "Success",
      description: "All invitations have been processed",
    });
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "pending":
        return {
          icon: Clock,
          text: "Pending",
          className: "bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400",
          dotColor: "bg-amber-500"
        };
      case "accepted":
        return {
          icon: CheckCircle,
          text: "Accepted",
          className: "bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400",
          dotColor: "bg-green-500"
        };
      case "rejected":
        return {
          icon: XCircle,
          text: "Rejected",
          className: "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400",
          dotColor: "bg-red-500"
        };
      default:
        return {
          icon: Clock,
          text: "Unknown",
          className: "bg-gray-100 dark:bg-gray-500/20 text-gray-700 dark:text-gray-400",
          dotColor: "bg-gray-500"
        };
    }
  };

  const getAccessIcon = (accessName: string) => {
    switch (accessName) {
      case "Admin Access":
        return Crown;
      case "Projects Access":
        return Briefcase;
      case "Custom Projects Access":
        return FolderKey;
      default:
        return Shield;
    }
  };

  const stats = {
    total: users.length,
    pending: users.filter(u => u.status === "pending").length,
    accepted: users.filter(u => u.status === "accepted").length,
    rejected: users.filter(u => u.status === "rejected").length,
  };

  if (!user) {
    return <AccessDenied redirectPath="/auth" />;
  }

  if (user?.role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-3">
                <Shield className="w-4 h-4" />
                Team Management
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                Access Manager
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Invite team members and manage their permissions
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => fetchPendingInvitations()}
                disabled={isLoading}
                className="border-gray-200 dark:border-slate-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <RefreshCw className="w-4 h-4" />
                )}
                <span className="ml-2 hidden sm:inline">Refresh</span>
              </Button>
              <Button
                variant="outline"
                className="border-gray-200 dark:border-slate-700"
              >
                <Settings className="w-4 h-4" />
                <span className="ml-2 hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          {[
            { label: "Total Invites", value: stats.total, icon: Users, color: "from-orange-500 to-amber-500" },
            { label: "Pending", value: stats.pending, icon: Clock, color: "from-amber-500 to-yellow-500" },
            { label: "Accepted", value: stats.accepted, icon: CheckCircle, color: "from-green-500 to-emerald-500" },
            { label: "Rejected", value: stats.rejected, icon: XCircle, color: "from-red-500 to-rose-500" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="relative p-5 rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`absolute top-4 right-4 w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl bg-white dark:bg-slate-900/80 border border-gray-200/50 dark:border-slate-800/50 shadow-xl overflow-hidden"
        >
          {/* Invite Section */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-800">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Invite Team Member</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Send an invitation to join your workspace</p>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4">
              {/* Email Input */}
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="email"
                  placeholder="Enter email address..."
                  className="pl-12 h-12 bg-gray-50 dark:bg-slate-800 border-gray-200 dark:border-slate-700 rounded-xl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              {/* Access Level Dropdown */}
              <div className="relative min-w-[220px]">
                <button
                  onClick={() => toggleDropdown("temp-" + email)}
                  disabled={isLoading}
                  className="w-full h-12 flex items-center justify-between gap-2 px-4 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-orange-300 dark:hover:border-orange-500/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {(() => {
                      const Icon = getAccessIcon(selectedAccess[`temp-${email}`] || "Admin Access");
                      return <Icon className="w-4 h-4 text-orange-500" />;
                    })()}
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedAccess[`temp-${email}`] || "Admin Access"}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-gray-400 transition-transform ${
                      openDropdownId === "temp-" + email ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence>
                  {openDropdownId === "temp-" + email && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                    >
                      {accessLevels.map(({ name, icon: Icon, description }) => (
                        <button
                          key={name}
                          onClick={() => handleAccessSelect(`temp-${email}`, name)}
                          className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-start gap-3 transition-colors border-b border-gray-100 dark:border-slate-800 last:border-0"
                        >
                          <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <Icon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900 dark:text-white">{name}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Invite Button */}
              <Button
                onClick={handleAddUser}
                disabled={!email || isLoading}
                className="h-12 px-6 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-xl shadow-lg shadow-orange-500/25"
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Send Invite
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Search Section */}
          <div className="p-6 border-b border-gray-200 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-800/30">
            <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search team members..."
                  className="pl-12 h-11 bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-700 rounded-xl"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Showing {filteredUsers.length} of {users.length} members
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="divide-y divide-gray-200 dark:divide-slate-800">
            {filteredUsers.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No team members yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">Invite your first team member to get started</p>
                <div className="inline-flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400">
                  <Sparkles className="w-4 h-4" />
                  Use the form above to send an invitation
                </div>
              </div>
            ) : (
              filteredUsers.map((member, index) => {
                const statusConfig = getStatusConfig(member.status || 'pending');
                const StatusIcon = statusConfig.icon;
                const AccessIcon = getAccessIcon(selectedAccess[member.id] || "Admin Access");

                return (
                  <motion.div
                    key={member.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 sm:p-5 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="relative">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center text-white font-semibold text-lg">
                          {member.email.charAt(0).toUpperCase()}
                        </div>
                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full ${statusConfig.dotColor} border-2 border-white dark:border-slate-900`} />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-900 dark:text-white truncate">
                            {member.email}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${statusConfig.className}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusConfig.text}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Invited as {member.role}
                          </span>
                        </div>
                      </div>

                      {/* Access Level Dropdown */}
                      <div className="relative hidden sm:block">
                        <button
                          onClick={() => toggleDropdown(member.id)}
                          disabled={isLoading}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl hover:border-orange-300 dark:hover:border-orange-500/50 transition-colors"
                        >
                          <AccessIcon className="w-4 h-4 text-orange-500" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {selectedAccess[member.id] || "Admin Access"}
                          </span>
                          <ChevronDown
                            className={`w-4 h-4 text-gray-400 transition-transform ${
                              openDropdownId === member.id ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        <AnimatePresence>
                          {openDropdownId === member.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                            >
                              {accessLevels.map(({ name, icon: Icon, description }) => (
                                <button
                                  key={name}
                                  onClick={() => handleAccessSelect(member.id, name)}
                                  className="w-full text-left px-4 py-3 hover:bg-gray-50 dark:hover:bg-slate-800 flex items-start gap-3 transition-colors border-b border-gray-100 dark:border-slate-800 last:border-0"
                                >
                                  <div className="w-8 h-8 rounded-lg bg-orange-100 dark:bg-orange-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                                    <Icon className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900 dark:text-white">{name}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">{description}</div>
                                  </div>
                                </button>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleRemoveUser(member.id)}
                          disabled={isLoading}
                          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer */}
          {filteredUsers.length > 0 && (
            <div className="p-6 bg-gray-50 dark:bg-slate-800/30 border-t border-gray-200 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  <span className="font-medium text-gray-700 dark:text-gray-300">{stats.pending}</span> pending invitations
                </p>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => fetchPendingInvitations()}
                    disabled={isLoading}
                    className="border-gray-200 dark:border-slate-700"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Refresh List
                  </Button>
                  <Button
                    onClick={handleInviteSelected}
                    disabled={filteredUsers.length === 0 || isLoading}
                    className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-lg shadow-orange-500/25"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : (
                      <UserCheck className="w-4 h-4 mr-2" />
                    )}
                    Resend All Pending
                  </Button>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Help Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-orange-500/10 dark:from-orange-500/20 dark:via-amber-500/20 dark:to-orange-500/20 border border-orange-200/50 dark:border-orange-500/30"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                Need help managing your team?
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Check out our guide on setting up roles and permissions for your organization.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-orange-300 dark:border-orange-500/50 text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-500/10"
            >
              View Documentation
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AccessManagerDashboard;