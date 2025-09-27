import React from "react";
import { Routes, Route } from "react-router-dom";
import PrototypeLayout from "./PrototypeLayout";
import PrototypeHub from "./PrototypeHub";
import AnglerDashboard from "./stubs/AnglerDashboard";
import PresidentDashboard from "./stubs/PresidentDashboard";
import ClubMembersScreen from "./stubs/ClubMembersScreen";
import ClubEventsScreen from "./stubs/ClubEventsScreen";

export default function PrototypeRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PrototypeLayout />}>
        <Route index element={<PrototypeHub />} />
        <Route path="angler" element={<AnglerDashboard />} />
        <Route path="president" element={<PresidentDashboard />} />
        <Route path="club-members" element={<ClubMembersScreen />} />
        <Route path="club-events" element={<ClubEventsScreen />} />
      </Route>
    </Routes>
  );
}