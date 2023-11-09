import RealTime from '@/components/alarm/RealTime';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Will You',
    description: 'Generated by create next app',
    viewport: 'width=device-width,initial-scale=1',
};

export default function UserLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <section>
            <div>
                <RealTime />
            </div>
            {children}
        </section>
    );
}
