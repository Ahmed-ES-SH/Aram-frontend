"use client";
import React from "react";
import NotifiticationsComponent from "../_notifactions/NotifiticationsComponent";
import { useDataContext } from "@/app/context/DataContext";
import ListofreservationsUser from "./ListofreservationsUser";
import ListofreservationsOrg from "./ListofreservationsOrg";

export default function ListofreservationsComponent() {
  const { type } = useDataContext();

  if (type == "User") return <ListofreservationsUser />;

  if (type != "User") return <ListofreservationsOrg />;
}
