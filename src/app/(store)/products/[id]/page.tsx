import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { products, getProduct, getRelatedProducts } from "@/data/products";
import ClientProductPage from "./ClientProductPage";

type Props = {
  params: Promise<{ id: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return { title: "Produit introuvable | ASRAR LALLA" };
  }

  return {
    title: `${product.name_fr} — ${product.price} DH | ASRAR LALLA`,
    description: product.description,
    openGraph: {
      title: `${product.name_fr} — ${product.price} DH | ASRAR LALLA`,
      description: product.description,
      type: "website",
      siteName: "ASRAR LALLA",
      locale: "fr_MA",
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    notFound();
  }

  const relatedProducts = getRelatedProducts(product);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name_fr,
    description: product.description,
    brand: { "@type": "Brand", name: "ASRAR LALLA" },
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "MAD",
      availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      seller: { "@type": "Organization", name: "ASRAR LALLA" },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ClientProductPage product={product} relatedProducts={relatedProducts} />
    </>
  );
}
