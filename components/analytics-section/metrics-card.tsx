import React from 'react';
import { motion, Variants } from 'framer-motion';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import type { AnalyticMetric } from '@/types';

interface MetricsCardProps {
    metric: AnalyticMetric;
}

const cardVariants: Variants = {
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
} as Variants;

const numberVariants: Variants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
        scale: 1,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 200,
            damping: 20,
            delay: 0.2
        }
    }
};

const trendVariants: Variants = {
    initial: { opacity: 0, x: -20 },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: 0.3,
            delay: 0.4
        }
    }
};

const graphVariants: Variants = {
    initial: { scaleX: 0, originX: 0 },
    animate: {
        scaleX: 1,
        transition: {
            duration: 0.6,
            delay: 0.5,
            ease: "easeOut"
        }
    }
};

export const MetricsCard: React.FC<MetricsCardProps> = ({ metric }) => {
    const isPositive = metric.trend >= 0;

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
                <div className="space-y-4">
                    {/* Metric Label */}
                    <div className="flex justify-between items-center">
                        <span className="text-slate-600 font-medium">{metric.label}</span>
                        <motion.span
                            variants={numberVariants}
                            className="text-xl font-semibold text-slate-900"
                        >
                            {metric.value.toLocaleString()}
                        </motion.span>
                    </div>

                    {/* Trend Indicator */}
                    <motion.div
                        variants={trendVariants}
                        className="flex items-center gap-2"
                    >
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                            }`}>
                            {isPositive ? (
                                <ArrowUpIcon className="w-4 h-4" />
                            ) : (
                                <ArrowDownIcon className="w-4 h-4" />
                            )}
                            <span className="text-sm font-medium">
                                {Math.abs(metric.changePercentage)}%
                            </span>
                        </div>
                        <span className="text-sm text-slate-500">
                            vs last period
                        </span>
                    </motion.div>

                    {/* Graph Placeholder */}
                    <motion.div
                        variants={graphVariants}
                        className="h-12 rounded-lg overflow-hidden"
                    >
                        <div className={`h-full w-full ${isPositive ? 'bg-green-100' : 'bg-red-100'
                            } relative`}>
                            <motion.div
                                className={`absolute bottom-0 left-0 w-full h-1/2 ${isPositive ? 'bg-green-200' : 'bg-red-200'
                                    }`}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ delay: 0.7, duration: 0.4 }}
                            />
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default MetricsCard;