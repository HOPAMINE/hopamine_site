"use client";

import { useEffect, useState } from "react";
import { getZimaPath } from "@/lib/zima/routes";

export function useZimaMobileNavHrefs() {
  const [homeHref, setHomeHref] = useState("/zima/search");
  const [chatsHref, setChatsHref] = useState("/zima/chats");
  const [profileHref, setProfileHref] = useState("/zima/profile");

  useEffect(() => {
    const hostname = window.location.hostname;
    setHomeHref(getZimaPath("search", hostname));
    setChatsHref(getZimaPath("chats", hostname));
    setProfileHref(getZimaPath("profile", hostname));
  }, []);

  return { homeHref, chatsHref, profileHref };
}
