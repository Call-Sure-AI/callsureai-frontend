"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import {
  Plus,
  X,
  ChevronDown,
  Users,
  Mail,
  Shield,
  Search,
  Loader2,
} from "lucide-react";
import {
  AccessLevel,
  AccessLevelName,
  SelectedAccessMap,
  User,
} from "@/types";
import { Button } from "@/components/ui/button";
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

  // useEffect that depends on fetchPendingInvitations
  useEffect(() => {
    fetchPendingInvitations();
  }, [fetchPendingInvitations]);

  const accessLevels: AccessLevel[] = [
    { name: "Admin Access", icon: Shield },
    { name: "Projects Access", icon: Users },
    { name: "Custom Projects Access", icon: Users },
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

      // Add the invited user to the list
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

        // Use POST endpoint instead of DELETE
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/api/invitations/${invitationId}/delete`,
          {}, // Empty body
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

    // Remove from UI
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

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
        staggerChildren: 0.1,
      },
    },
  } as Variants;

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  } as Variants;

  const dropdownVariants = {
    hidden: { opacity: 0, y: -10, height: 0 },
    visible: {
      opacity: 1,
      y: 0,
      height: "auto",
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
  } as Variants;

  if (!user) {
    return <AccessDenied redirectPath="/auth" />;
  }

  if (user?.role !== "admin") {
    return <AccessDenied />;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      {/* Rest of your JSX remains the same */}
      <motion.div
        className="max-w-7xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden"
        variants={containerVariants as Variants}
        initial="hidden"
        animate="visible"
      >
        {/* Header Section */}
        <div className="bg-gradient-to-r from-[#0A1E4E] via-[#0A1E4E]/80 to-[#0A1E4E] p-8 text-white">
          <motion.h1
            className="text-3xl font-bold mb-2"
            variants={itemVariants}
          >
            Access Manager
          </motion.h1>
          <motion.p className="text-blue-100" variants={itemVariants}>
            Manage user permissions and access levels
          </motion.p>
        </div>

        <div className="p-8">
          {/* Search and Add Section */}
          <motion.div
            className="flex flex-col md:flex-row gap-4 mb-8"
            variants={itemVariants as Variants}
          >
            <div className="flex-1 relative">
              <Mail
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="email"
                placeholder="Enter email address"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1E4E] focus:border-transparent outline-none transition-all duration-200"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="relative min-w-[180px]">
              <motion.button
                className="w-full flex items-center justify-between gap-2 px-4 py-3 bg-white border border-gray-200 rounded-xl hover:border-blue-300 transition-colors duration-200"
                onClick={() => toggleDropdown("temp-" + email)}
                disabled={isLoading}
              >
                <Shield size={16} className="text-[#0A1E4E]" />
                <span>{selectedAccess[`temp-${email}`] || "Admin Access"}</span>
                <ChevronDown
                  size={16}
                  className={`transform transition-transform duration-200 ${openDropdownId === "temp-" + email ? "rotate-180" : ""}`}
                />
              </motion.button>

              <AnimatePresence>
                {openDropdownId === "temp-" + email && (
                  <motion.div
                    className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
                    variants={dropdownVariants as Variants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                  >
                    {accessLevels.map(({ name, icon: Icon }) => (
                      <motion.button
                        key={name}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                        onClick={() =>
                          handleAccessSelect(`temp-${email}`, name)
                        }
                        whileHover={{ x: 4 }}
                      >
                        <Icon size={16} className="text-[#0A1E4E]" />
                        {name}
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Button
              className="px-6 py-3 rounded-xl flex items-center gap-2 shadow-md transition-colors duration-200"
              variant="primary"
              onClick={handleAddUser}
              disabled={!email || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus size={20} />
              )}
              Invite User
            </Button>
          </motion.div>

          {/* Search Filter */}
          <motion.div className="mb-6 relative" variants={itemVariants}>
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0A1E4E] focus:border-transparent outline-none transition-all duration-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </motion.div>

          {/* User List */}
          <motion.div className="space-y-4" variants={itemVariants}>
            {filteredUsers.map((user, index) => (
              <motion.div
                key={user.id}
                className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-blue-200 transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="flex items-center gap-4">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <Users className="text-[#0A1E4E]" size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs md:text-lg text-gray-700 font-medium">
                      {user.email}
                    </span>
                    {user.status === "pending" && (
                      <span className="text-xs text-amber-500">
                        Invitation Pending
                      </span>
                    )}
                    {user.status === "accepted" && (
                      <span className="text-xs text-green-500">
                        Invitation Accepted
                      </span>
                    )}
                    {user.status === "rejected" && (
                      <span className="text-xs text-red-500">
                        Invitation Rejected
                      </span>
                    )}
                  </div>

                  <div className="relative ml-auto">
                    <motion.button
                      className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:border-blue-300 transition-colors duration-200"
                      onClick={() => toggleDropdown(user.id)}
                      disabled={isLoading}
                    >
                      <Shield size={16} className="text-[#0A1E4E]" />
                      <span className="hidden md:block">
                        {selectedAccess[user.id] || "Admin Access"}
                      </span>
                      <ChevronDown
                        size={16}
                        className={`transform transition-transform duration-200 ${openDropdownId === user.id ? "rotate-180" : ""}`}
                      />
                    </motion.button>

                    <AnimatePresence>
                      {openDropdownId === user.id && (
                        <motion.div
                          className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden"
                          variants={dropdownVariants}
                          initial="hidden"
                          animate="visible"
                          exit="hidden"
                        >
                          {accessLevels.map(({ name, icon: Icon }) => (
                            <motion.button
                              key={name}
                              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-center gap-3 transition-colors duration-200"
                              onClick={() => handleAccessSelect(user.id, name)}
                              whileHover={{ x: 4 }}
                            >
                              <Icon size={16} className="text-[#0A1E4E]" />
                              {name}
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    className="text-gray-400 hover:text-red-500 transition-colors duration-200"
                    onClick={() => handleRemoveUser(user.id)}
                    disabled={isLoading}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </motion.div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500">
                  No users found. Invite someone to get started!
                </p>
              </div>
            )}
          </motion.div>

          {/* Footer Actions */}
          <motion.div
            className="flex gap-4 mt-8 pt-8 border-t border-gray-200"
            variants={itemVariants}
          >
            <Button
              variant="outline"
              className="px-6 py-3 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => {
                fetchPendingInvitations();
              }}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Reset"
              )}
            </Button>
            <Button
              variant="primary"
              className="px-6 py-4 rounded-xl transition-colors duration-200 shadow-md"
              onClick={handleInviteSelected}
              disabled={filteredUsers.length === 0 || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                "Invite All Users"
              )}
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default AccessManagerDashboard;