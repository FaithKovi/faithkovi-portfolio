// src/pages/blog/index.tsx
import React from 'react';
import Layout from '@theme/Layout';
import { motion } from 'framer-motion';
import styles from './blog.module.css';
import Head from '@docusaurus/Head';
import MediumFeed from '@site/src/components/MediumFeed';

const blogPosts = [
  {
    title: 'How Diátaxis Turns Documentation Chaos into Clarity',
    excerpt: 'Discover how the Diátaxis framework transforms scattered documentation into a structured, user-centered system that enhances clarity and usability.',
    link: 'https://vera-kaka.medium.com/how-diátaxis-turns-documentation-chaos-into-clarity-bb48c8ebc512',
  },
  {
    title: 'Serverless Computing and DevOps: The Future of Cloud Deployment',
    excerpt: 'Explore how combining serverless computing with DevOps practices enhances scalability, agility, and cost-efficiency in modern cloud deployments.',
    link: 'https://hackernoon.com/serverless-computing-and-devops-the-future-of-cloud-deployment',
  },
  {
    title: 'How to deploy the AWS Cloud Resume API with Terraform and GitHub Actions',
    excerpt: 'Learn how to automate the deployment of your Cloud Resume API on AWS using Terraform for infrastructure and GitHub Actions for CI/CD.',
    link: 'https://vera-kaka.medium.com/how-to-deploy-the-aws-cloud-resume-api-with-terraform-and-github-actions-e6624051ce94',
  },
  {
    title: 'How to deploy the AWS Cloud Resume API with Terraform and GitHub Actions',
    excerpt: 'Learn how to automate the deployment of your Cloud Resume API on AWS using Terraform for infrastructure and GitHub Actions for CI/CD.',
    link: 'https://vera-kaka.medium.com/how-to-deploy-the-aws-cloud-resume-api-with-terraform-and-github-actions-e6624051ce94',
  },
  {
    title: 'How to deploy the AWS Cloud Resume API with Terraform and GitHub Actions',
    excerpt: 'Learn how to automate the deployment of your Cloud Resume API on AWS using Terraform for infrastructure and GitHub Actions for CI/CD.',
    link: 'https://vera-kaka.medium.com/how-to-deploy-the-aws-cloud-resume-api-with-terraform-and-github-actions-e6624051ce94',
  },
  
];

// export default function Blog() {
//   return (
//     <Layout>
//       <Head>
//         <title>Blog - Faith Kovi</title>
//         <meta name="description" content="Read blog posts by Faith Kovi on DevRel, cloud native tooling, and documentation engineering." />
//       </Head>

//       <main className={styles.main}>
//         <h1 className={styles.pageTitle}>Blog Posts</h1>
//         <div className={styles.cardGrid}>
//           {blogPosts.map((post, index) => (
//             <motion.a
//               key={index}
//               href={post.link}
//               className={styles.card}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               transition={{ duration: 0.6, delay: index * 0.15 }}
//             >
//               <h3>{post.title}</h3>
//               <p>{post.excerpt}</p>
//             </motion.a>
//           ))}
//         </div>
//       </main>
//     </Layout>
//   );
// }

export default function Home(): JSX.Element {
  return (
    <main className="container mx-auto">
      <MediumFeed />
    </main>
  );
}
