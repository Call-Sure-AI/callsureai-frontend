import { Metadata } from 'next';
import NotFoundPage from '@/components/not-found';

export const metadata: Metadata = {
    title: '404 - Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
};

export default function NotFound() {
    return <NotFoundPage />;
}