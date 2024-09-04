/* eslint-disable */
import Link from "next/link";

import { getServerAuthSession } from "~/server/auth";
import { HydrateClient } from "~/trpc/server";
import HeaderNoAuth from "./_components/header";
import BodyNoAuth from "./_components/body";

export default async function Home() {
  const session = await getServerAuthSession();

  return (
    <HydrateClient>
      <HeaderNoAuth/>
      <BodyNoAuth/>
    </HydrateClient>
  );
}
