// src/pages/about.tsx
import * as React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <Layout>
      <Head>
        <title>About | Faith Kovi</title>
        <meta name="description" content="About Faith Kovi - DevRel Enthusiast and Documentation Engineer" />
      </Head>

      <main className="container" style={{ padding: '2rem' }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1>About Me</h1>
          <p style={{ fontSize: '1.2rem', lineHeight: '1.8' }}>
            Hi, I’m Faith Kovi —a <b>Documentation Engineer</b> and <b>Technical Writer</b> passionate about making complex ideas easy to understand and accessible to everyone. I help engineering teams and developer-focused companies craft clear, impactful documentation that enhances the developer experience, reduces support tickets, and accelerates product growth.
            <br /><br />
            I began my journey in Cloud Engineering and DevOps, working with cloud platforms such as AWS, GCP, and DigitalOcean, as well as tools like Docker, Kubernetes, ECS, Fargate, Terraform, and Ansible. This hands-on experience shaped the way I approach technical writing, with a deep respect for accuracy, clarity, and the real-world workflows developers face. I know what it’s like to troubleshoot with no good docs in sight, and I’m committed to making sure others don’t have to.
            <br /><br />
            Over the years, I’ve transitioned into a full-time Documentation Engineer role, where I collaborate closely with engineering teams to create comprehensive API documentation, user guides, and tutorials. My goal is to ensure that every piece of content not only informs but also empowers users to achieve their goals quickly and efficiently.
            Now, I specialise in building scalable documentation systems using docs-as-code tools like <b>Docusaurus</b>, <b>GitBook</b>, and <b>Mintlify</b>. Whether it’s setting up a documentation site from scratch, creating step-by-step tutorials, or writing detailed guides, I focus on making sure every piece of content is actionable and easy to navigate.
            <br /><br />
            Outside of work, I’m an open-source contributor and I engage in other content writing. If you’re looking to improve your documentation or create technical content that truly serves your users, I’d love to work with you.
          </p>
        </motion.div>
      </main>
    </Layout>
  );
}
