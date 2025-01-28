import React from "react";
import UserProfile from "../_components/_website/_Profiles/UserProfile";
import OrganizationProfile from "../_components/_website/_Profiles/OrganizationProfile";

export default function page({ searchParams }: any) {
  const { id } = searchParams;
  const { acouunt_type } = searchParams;

  if (acouunt_type == "User") return <UserProfile id={id} />;

  /////////////////////////////////////////////////////////////////////

  if (acouunt_type != "User") return <OrganizationProfile id={id} />;
}
