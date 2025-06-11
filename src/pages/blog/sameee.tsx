import React from 'react';
import Layout from '@theme/Layout';
import MediumFeed from '@site/src/components/MediumFeed';

export default function BlogPage() {
  return (
    <Layout>
        <title>Blog - Read my latest Medium articles"</title>
        <main className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6">Latest from Medium</h1>
        <MediumFeed limit={10} />
      </main>
    </Layout>
  );
}
