import { JobRequest } from '@/components/driver/JobRequestModal';
import { useStore } from '@/store/store';
import { useEffect, useState } from 'react';

export function useDriverState() {
    const user = useStore((state) => state.user);
    const [isOnline, setIsOnline] = useState(false);
    const [activeJob, setActiveJob] = useState<JobRequest | null>(null);
    const [incomingJob, setIncomingJob] = useState<JobRequest | null>(null);
    const [stats, setStats] = useState({
        timeOnline: '0:00',
        tripsCompleted: 0,
        earnings: 0,
    });

    useEffect(() => {
        if (!user) return;

        // Load initial state check
        checkDriverStatus();

        // Simulate incoming job for demo purposes (if online)
        const jobInterval = setInterval(() => {
            if (isOnline && !activeJob && !incomingJob && Math.random() > 0.7) {
                simulateIncomingJob();
            }
        }, 5000);

        return () => clearInterval(jobInterval);
    }, [user, isOnline, activeJob, incomingJob]);

    const checkDriverStatus = async () => {
        // In real app: Fetch from 'drivers' table
        // For demo: verify user profile role
    };

    const toggleOnline = (status: boolean) => {
        setIsOnline(status);
        if (status) {
            // Reset session stats start time
        }
    };

    const simulateIncomingJob = () => {
        setIncomingJob({
            id: Math.random().toString(),
            pharmacyName: 'CVS Pharmacy - Downtown',
            pharmacyAddress: '123 Main St, New York, NY',
            deliveryAddress: '456 Park Ave, Apt 4B',
            distance: '2.4 mi',
            earnings: 14.50,
            itemsCount: 3
        });
    };

    const acceptJob = () => {
        if (incomingJob) {
            setActiveJob(incomingJob);
            setIncomingJob(null);
        }
    };

    const declineJob = () => {
        setIncomingJob(null);
    };

    const completeJob = () => {
        if (activeJob) {
            setStats(prev => ({
                ...prev,
                tripsCompleted: prev.tripsCompleted + 1,
                earnings: prev.earnings + activeJob.earnings
            }));
            setActiveJob(null);
        }
    };

    return {
        isOnline,
        toggleOnline,
        activeJob,
        incomingJob,
        acceptJob,
        declineJob,
        completeJob,
        stats
    };
}
