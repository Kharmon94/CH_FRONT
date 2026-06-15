import { Helmet } from "react-helmet-async";
import { absoluteUrl, siteUrl } from "../../lib/siteUrl";

const DEFAULT_TITLE = "Cursor Help";
const DEFAULT_DESCRIPTION =
  "Export Cursor chat history and Agent Clone handoffs locally. Search every composer session without uploading your database.";

export function PageMeta({
  title,
  description = DEFAULT_DESCRIPTION,
  path = "/",
  type = "website",
  image,
  noIndex = false,
}: {
  title?: string;
  description?: string;
  path?: string;
  type?: "website" | "article";
  image?: string | null;
  noIndex?: boolean;
}) {
  const pageTitle = title ? `${title} — ${DEFAULT_TITLE}` : DEFAULT_TITLE;
  const url = absoluteUrl(path);
  const ogImage = image ?? absoluteUrl("/og-default.svg");

  return (
    <Helmet>
      <title>{pageTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}

      <meta property="og:site_name" content={DEFAULT_TITLE} />
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      <meta name="application-url" content={siteUrl()} />
    </Helmet>
  );
}
