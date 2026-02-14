import React from "react";
import ProcessingStateContent from "@/components/processing-state/ProcessingStateContent";

const ProcessingState = () => {
  return (
    <main className="min-h-[calc(100vh-80px)] flex items-center justify-center px-6 py-12">
      <ProcessingStateContent />
    </main>
  );
};

export default ProcessingState;
