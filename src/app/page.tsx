import EditorialLanding from '@/components/EditorialLanding';
import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Siirry pääsisältöön
      </a>
      <FunnelAnalytics />
      <EditorialLanding />
    </>
  );
}
