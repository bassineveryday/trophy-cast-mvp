import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  // Hide on home route
  if (pathname === "/") return null;

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <div className="fixed left-4 top-20 z-40">
      <Button variant="outline" size="sm" onClick={handleBack} aria-label="Go back">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
    </div>
  );
}
