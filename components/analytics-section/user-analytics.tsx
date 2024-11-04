import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Building } from 'lucide-react';
import type { UserData } from '@/types';

interface UserAnalyticsProps {
    userData: UserData;
}

const cardVariants = {
    initial: {
        opacity: 0,
        y: 20,
        scale: 0.95
    },
    animate: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.5,
            ease: "easeOut"
        }
    },
    hover: {
        y: -4,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const contentVariants = {
    initial: { opacity: 0, x: -20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            delay: 0.3
        }
    }
};

export const UserAnalytics: React.FC<UserAnalyticsProps> = ({ userData }) => {
    const date = new Date(userData.lastActivity);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);

    return (
        <motion.div
            variants={cardVariants}
            initial="initial"
            whileInView="animate"
            whileHover="hover"
            viewport={{ once: true }}
            className="w-full"
        >
            <div className="bg-white/90 backdrop-blur rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">

                        <motion.div
                            variants={contentVariants}
                            className="flex justify-between items-center w-full"
                        >
                            <div className="font-semibold text-slate-900">{userData.name}</div>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                <Building className="h-3.5 w-3.5" />
                                {userData.company}
                            </div>
                        </motion.div>
                    </div>

                    <motion.div
                        variants={contentVariants}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-50 rounded-lg"
                    >
                        <Clock className="h-4 w-4 text-blue-600" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-blue-900">Last Active</span>
                            <span className="text-sm text-blue-600">{formattedDate}</span>
                        </div>
                    </motion.div>

                    <motion.div
                        className="h-2 bg-slate-100 rounded-full overflow-hidden"
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                    >
                        <motion.div
                            className="h-full bg-blue-500 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: '70%' }}
                            transition={{ duration: 0.5, delay: 0.8 }}
                        />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default UserAnalytics;