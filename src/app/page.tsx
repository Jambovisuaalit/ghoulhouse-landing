import EditorialLanding from '@/components/EditorialLanding';
import FunnelAnalytics from '@/components/analytics/FunnelAnalytics';
import { siteConfig } from '@/config/site';

export default function Home() {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Siirry pääsisältöön
      </a>
      <span className="sr-only">
        Kotipaikka {siteConfig.company.domicile}. {siteConfig.company.registrationStatus}
      </span>
      <FunnelAnalytics />
      <EditorialLanding />
    </>
  );
}
