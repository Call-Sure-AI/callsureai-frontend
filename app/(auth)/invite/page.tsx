// app\(auth)\invite\page.tsx
import InviteContent from '@/components/auth/invite';
import { Loader2 } from 'lucide-react';
import { Suspense } from 'react';

export default function InvitePage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        }>
            <InviteContent />
        </Suspense>
    );
}