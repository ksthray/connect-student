import { JobOfferType } from "@/entities/types";
import api from "@/services/api";
import {
  frDate,
  getTypeBgColor,
  getTypeTextColor,
  returnNameOfJobType,
} from "@/services/helpers";
import { Calendar, MapPin } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import ShareButtonForSlug from "../components/share-bouton";
import ButtonApply from "../components/button-apply";

const getOffer = async (slug: string) => {
  try {
    const { data } = await api.get(`/candidate/jobs/${slug}`);

    if (data.state) {
      return data;
    }
  } catch (error) {
    console.error(error);
  }
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const slug = (await params).slug;
  const res = await getOffer(slug);
  const job: JobOfferType = res?.data;

  function compressImg(url: string) {
    const first = url.split("upload")[0];
    const second = url.split("upload")[1];

    return `${first}upload/w_1200,h_630,ar_1:1,c_fill/${second}`;
  }

  function compressAndResizeImg(url: string) {
    const first = url.split("upload")[0];
    const second = url.split("upload")[1];

    return `${first}upload/w_400,h_260,ar_1:1,c_fill/${second}`;
  }

  return {
    title: job.title,
    description: job.description,
    openGraph: {
      images: [
        {
          url: compressImg(job.coverImage as string),
          width: 1200,
          height: 630,
          type: "article",
          alt: job.title,
        },
        {
          url: compressAndResizeImg(job.coverImage as string),
          width: 400,
          height: 260,
          type: "blog",
          alt: job.title,
        },
      ],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  if (!slug) {
    return notFound();
  }

  const res = await getOffer(slug);
  const offer: JobOfferType = res?.data;

  if (res.status === 404) {
    notFound();
  }

  const offerUrl = `${process.env.NEXT_PUBLIC_API}/offres/${offer?.slug}`;

  return (
    <div className="w-full">
      {/* Cover Image */}
      <div className="container mx-auto px-6 pt-28">
        <div className="bg-white h-96 overflow-hidden">
          <Image
            src={offer.coverImage as string}
            alt={offer.title}
            className="w-full h-full object-cover rounded-2xl"
            width={500}
            height={500}
          />
        </div>

        {/* Content */}
        <div className="">
          <div className="w-full mx-auto py-12">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-8 pb-8 border-b border-border">
              <div className="flex-1">
                {/* Type Badge */}
                <div className="inline-flex mb-4">
                  <div
                    className={`flex items-center gap-2 px-4 py-2 rounded-full ${getTypeBgColor(
                      offer.type
                    )} ${getTypeTextColor(offer.type)} font-semibold text-sm`}>
                    {returnNameOfJobType(offer.type)}
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-4xl font-bold text-foreground mb-4">
                  {offer.title}
                </h1>

                {/* Company Info */}
                <div className="flex items-start flex-col gap-3 mb-6">
                  <Image
                    src={offer.company.logo}
                    width={400}
                    height={400}
                    alt={offer.company.companyName}
                    className="w-24"
                  />
                  <div>
                    <p className="font-semibold text-foreground">
                      {offer.company.companyName}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-4 h-4" />
                      {offer.location}
                    </p>
                  </div>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Date limite
                    </p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {frDate(offer.deadline as Date)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">
                      Publier le
                    </p>
                    <p className="text-sm font-semibold text-foreground flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {frDate(offer.createdAt as Date)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3 sm:w-auto">
                <ButtonApply
                  offerType={offer.type}
                  offerSlug={offer.slug}
                  offerTitle={offer.title}
                />
                <ShareButtonForSlug title={offer.title} url={offerUrl} />
              </div>
            </div>

            {/* Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                À propos de cette opportunité
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {offer.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Exigences
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {offer.requirements}
              </p>
            </div>

            {/* CTA Section */}
            <div className="bg-linear-to-r from-primary/5 to-secondary/5 border-2 border-primary/20 rounded-2xl p-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">
                Prêt à passer à l&apos;étape suivante ?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Cliquez ci-dessous pour soumettre votre candidature
              </p>
              <ButtonApply
                offerType={offer.type}
                offerSlug={offer.slug}
                offerTitle={offer.title}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
