import { useParams, useNavigate, useLocation, useSearchParams, Navigate } from "react-router-dom";
import { routeParam } from "@/lib/navigation";
import React, { useCallback } from "react";
import { serviceOf } from "@/data/servicesData";
import { downloadServicePdf } from "@/components/ServicePdf";
import {
  ServiceHero,
  ServiceOverview,
  ServiceProblems,
  ServiceProcess,
  ServiceTechnology,
  ServicePackages,
  ServiceDeliverables,
  ServiceFAQ,
  ServiceRelated,
  ServiceQuoteSection,
} from "@/components/ServiceComponents";

export default function ServiceDetail() {
  const slug = routeParam(useParams().slug);
  const service = serviceOf(slug);
  const onPdf = useCallback(() => downloadServicePdf(service), [service]);

  if (!service) return <Navigate to="/services" replace />;

  return (
    <>
      <ServiceHero service={service} onPdf={onPdf} />
      <ServiceOverview service={service} />
      <ServiceProblems service={service} />
      <ServiceProcess
        title={<>How we deliver <span className="mc-grad-text">{service.name}</span></>}
        text="A single, structured delivery model applied to every engagement — from discovery to supported operation."
      />
      <ServiceTechnology service={service} />
      <ServicePackages service={service} />
      <ServiceDeliverables deliverables={service.deliverables} />
      <ServiceFAQ service={service} />
      <ServiceQuoteSection service={service} />
      <ServiceRelated service={service} />
    </>
  );
}