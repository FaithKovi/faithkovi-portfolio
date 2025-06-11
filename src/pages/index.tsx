// src/pages/index.tsx
import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { motion } from 'framer-motion';
import styles from './index.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Link from '@docusaurus/Link';
import MediumFeed from '@site/src/components/MediumFeed';
// 


const roles = ['Documentation Engineer | Technical Writer', , 'DevOps Advocate', 'Cloud-Native Enthusiast'];

const recentPosts = [
  {
    title: 'How to Deploy a Rails App on DigitalOcean with Clouddley Triggr',
    link: '/blog/rails-deploy-digitalocean',
  },
  {
    title: 'Exploring Cloud-Native Tooling in DevRel',
    link: '/blog/cloud-native-devrel',
  },
  {
    title: 'Technical Writing Best Practices',
    link: '/blog/tech-writing-practices',
  },
];

const skills = ['Mintlify', 'Docusaurus', 'Hugo', 'Markdown', 'API Documentation', 'Technical Writing', 'User Experience Writing', 'AWS', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'GitHub Actions' ];

const socialLinks = [
  { name: 'GitHub', url: 'https://github.com/FaithKovi' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/faith-kovi/' },
  { name: 'X', url: 'https://x.com/Vera__Kaka' },
];

const Home = () => {
  const [currentRoleIndex, setCurrentRoleIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <Layout>
      <Head>
        <title>Faith Kovi | Documentation Engineer</title>
        <meta name="description" content="Portfolio of Faith Kovi — Documentation Engineer, Technical Writer, and DevOps Enthusiast." />
      </Head>

      <main className={styles.main}>
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className={styles.hero}
        >
          <img src={useBaseUrl('/img/faith-kovi-headshot.jpg')} alt="Faith Kovi" className={styles.profileImage} />
          <h1 className={styles.name}>Hi, I'm Faith Kovi</h1>

          <motion.h2
            key={currentRoleIndex}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className={styles.role}
          >
            {roles[currentRoleIndex]}
          </motion.h2>

          <p className={styles.description}>
            I'm a Documentation Engineer and Technical Writer with a passion for making complex technical concepts easy to understand. I work closely with engineering teams to create clear, developer-friendly documentation including API guides and tutorials. With a background in DevOps and cloud-native technologies, I focus on delivering content that supports users, scales with products, and reduces support overhead.
          </p>

          <div className={styles.buttons}>
            <motion.a href="/faithkovi-portfolio/projects" className={styles.button} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              View Projects
            </motion.a>
            <motion.a href="/faithkovi-portfolio/blog" className={styles.buttonOutline} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              Read Blog
            </motion.a>
          </div>
        </motion.div>

        <section className={styles.section}>
          <h2>Services I Offer</h2>
          <div className={styles.servicesGrid}>
            <div className={styles.serviceCard}>
              <h3>Documentation Engineering</h3>
              <p>Implementing docs-as-code, version control, and automation for scalable technical content.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3>Technical Writing</h3>
              <p>Clear and concise documentation for developer portals, APIs, and cloud tools.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3>API Documentation</h3>
              <p>Developer-focused API references, guides, and use cases that make it easier to understand and integrate your APIs.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3>Product Documentation</h3>
              <p>Comprehensive documentation that explains how your product works, from onboarding to advanced features.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3>DevOps & Infrastructure Documentation</h3>
              <p>Creating guides, tutorials, runbooks, and operational guides that support internal teams.</p>
            </div>
            <div className={styles.serviceCard}>
              <h3>Non-Technical Writing</h3>
              <p>Engaging content that builds connection, trust, and clarity beyond the technical sphere.</p>
            </div>
          </div>
        </section>


        {/* <section className={styles.section}>
          <h2>Recent Blog Posts</h2>
          <ul className={styles.postList}>
            {recentPosts.map((post, idx) => (
              <li key={idx}><Link to={post.link}>{post.title}</Link></li>
            ))}
          </ul>
        </section> */}

        <section className={styles.section}>
          <h2>Skills</h2>
          <div className={styles.skills}>
            {skills.map((skill, idx) => (
              <span key={idx} className={styles.skillBadge}>{skill}</span>
            ))}
          </div>
        </section>

        <section className={styles.section}>
          <h2>Connect With Me</h2>
          <div className={styles.socials}>
            {socialLinks.map((link, idx) => (
              <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer">{link.name}</a>
            ))}
          </div>
        </section>
      </main>
    </Layout>
  );
};

export default Home;
