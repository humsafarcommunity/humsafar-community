import React, { useEffect, useState } from 'react';
import { useClient, useCurrentUser } from 'sanity';
import { IntentLink, useRouter } from 'sanity/router';
import HomeView from './HomeView';

const QUERY = `{
  "tours": count(*[_type=="tour" && !(_id in path("drafts.**"))]),
  "blogs": count(*[_type=="blog" && !(_id in path("drafts.**"))]),
  "newLeads": count(*[_type=="lead" && status=="new" && !(_id in path("drafts.**"))]),
  "reviews": count(*[_type=="review" && !(_id in path("drafts.**"))]),
  "videos": count(*[_type=="video" && !(_id in path("drafts.**"))]),
  "destinations": count(*[_type=="destination" && !(_id in path("drafts.**"))])
}`;

// The "Home" tool: first thing you see when you open /admin.
export default function HomeTool() {
  const client = useClient({ apiVersion: '2024-03-01' });
  const user = useCurrentUser();
  const router = useRouter();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let alive = true;
    client.fetch(QUERY).then((r) => { if (alive) setStats(r); }).catch(() => {});
    return () => { alive = false; };
  }, [client]);

  const onGo = (e, path) => {
    if (router && typeof router.navigateUrl === 'function') {
      e.preventDefault();
      router.navigateUrl({ path });
    }
  };
  const renderCreate = (type, label, style, key) => (
    <IntentLink key={key || type} intent="create" params={{ type }} style={style}>{label}</IntentLink>
  );

  return <HomeView stats={stats} name={user && user.name} onGo={onGo} renderCreate={renderCreate} />;
}
