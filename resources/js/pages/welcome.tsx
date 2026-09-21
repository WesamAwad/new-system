import CentersSection from '@/components/landing/CentersSection';
import CtaBanner from '@/components/landing/CtaBanner';
import FeaturedWorkshops from '@/components/landing/FeaturedWorkshops';
import Footer from '@/components/landing/Footer';
import Header from '@/components/landing/Header';
import HeroSection from '@/components/landing/HeroSection';
import HowItWorks from '@/components/landing/HowItWorks';
import TrustGrid from '@/components/landing/TrustGrid';
import type { Workshop } from '@/types';
import { Head } from '@inertiajs/react';

type Metric = {
    label: string;
    icon: string;
};

type WelcomeProps = {
    metrics: Metric[];
    featuredWorkshops: Workshop[];
};

export default function Welcome({ metrics, featuredWorkshops }: WelcomeProps) {
    return (
        <>
            <Head title="سويفت فيكس | الصفحة الرئيسية" />

            <div dir="rtl" className="bg-muted text-foreground min-h-screen">
                <Header />
                <main>
                    <HeroSection metrics={metrics} />
                    <FeaturedWorkshops workshops={featuredWorkshops} />
                    <HowItWorks />
                    <CentersSection />
                    <TrustGrid />
                    <CtaBanner />
                </main>
                <Footer />
            </div>
        </>
    );
}
