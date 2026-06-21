"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ServiceRequestLayout } from "@/components/service-requests/service-request-layout";
import { StepRequestInfo } from "@/components/service-requests/step-request-info";
import { StepTenderSelection } from "@/components/service-requests/step-tender-selection";
import { StepReview } from "@/components/service-requests/step-review";
import { useServiceRequestStore } from "@/store/useServiceRequestStore";
import { useTendersControllerGetTenderDetails } from "@/lib/api/react-query/tenders/tenders";
import { Loader2 } from "lucide-react";

function NewRequestContent() {
  const { currentStep, setSelectedTender, setRfpSourceType } = useServiceRequestStore();
  const searchParams = useSearchParams();
  const tenderId = searchParams?.get("tenderId");

  const { data: tender, isSuccess } = useTendersControllerGetTenderDetails(tenderId || "", {
    query: {
      enabled: !!tenderId,
    },
  });

  useEffect(() => {
    if (isSuccess && tender) {
      setSelectedTender(tender);
      setRfpSourceType("platform");
    }
  }, [isSuccess, tender, setSelectedTender, setRfpSourceType]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepRequestInfo />;
      case 2:
        return <StepTenderSelection />;
      case 3:
        return <StepReview />;
      default:
        return <StepRequestInfo />;
    }
  };

  return <ServiceRequestLayout currentStep={currentStep}>{renderStep()}</ServiceRequestLayout>;
}

export default function NewRequestPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary-800" />
        </div>
      }
    >
      <NewRequestContent />
    </Suspense>
  );
}
