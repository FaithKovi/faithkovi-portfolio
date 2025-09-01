import React from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import styles from './resume.module.css';

interface Experience {
  title: string;
  company: string;
  location: string;
  duration: string;
  description: string[];
}

interface Education {
  degree: string;
  institution: string;
  location: string;
  duration: string;
  details?: string[];
}

interface Project {
  name: string;
  description: string;
  technologies: string[];
  link?: string;
}

const resumeData = {
  personalInfo: {
    name: "Faith Kovi",
    title: "Documentation Engineer",
    email: "faithkovi@gmail.com",
    github: "github.com/FaithKovi",
    website: "faithkovi.xyz",
    linkedin: "linkedin.com/in/faith-kovi/"
  },
  summary: "Documentation Engineer and Technical Writer skilled in creating developer-focused documentation that simplifies complex technical concepts. Experienced in collaborating with engineering teams to enhance product understanding, create comprehensive API documentation, and improve user experience. Proficient at documentation-as-code workflows and committed to delivering technically accurate, user-centred documentation.",
  experience: [
    {
      title: "Documentation Engineer",
      company: "Clouddley",
      location: "Delaware, USA (Remote)",
      duration: "Jul. 2023 - Present",
      description: [
        "Produced comprehensive technical documentation for internal and customer use,enhancing product understanding and user experience.",
        "Curated a repository of tutorials and help systems, improving user onboarding and support efficiency.",
        "Collaborated closely with engineering teams to translate technical features into user-friendly documentation and tutorials, resulting in an 80% reduction in developer support tickets.",
        "Implemented documentation-as-code workflows using Git, enabling version control, peer reviews, and automated publishing processes."
      ]
    },
    {
      title: "Freelance DevOps Engineer",
      company: "Remote",
      duration: "Nov. 2022 - Jun. 2023",
      description: [
        "Migrated PostgreSQL databases to DigitalOcean Managed Database, documenting the migration process to ensure replicability.",
        "Resolved critical issues with Elastic Beanstalk servers, significantly enhancing application stability and reducing server downtime.",
        "Leveraged AWS services, including ECS Fargate, DynamoDB, and Lambda, to optimize application scalability and reliability.","Streamlined the deployment process by automating CI/CD pipelines using CodeBuild, CodeDeploy, and CodePipeline, resulting in faster, more reliable software releases."
      ]
    },
    {
      title: "Junior DevOps/QA Engineer",
      company: "Grais",
      location: "New York, USA",
      duration: "Apr. 2022 - Oct. 2022",
      description: [
        "Automated packaging and deployment of web applications on ECS Fargate using GitHub Actions.",
        "Migrated multiple domains to AWS Route53 for centralized management.",
        "Orchestrated deployment of 3-tier applications utilizing AWS Amplify, Elastic Beanstalk, and RDS.",
        "Implemented comprehensive monitoring and logging with CloudWatch and integrated various AWS services to meet business/client needs."
      ]
    }
  ] as Experience[],
  education: [
    {
      degree: "Bachelor of Science in Biochemistry",
      institution: "University of Port Harcourt",
      location: "Port Harcourt, Rivers State, Nigeria",
      duration: "2016 - 2021",
      details: [
      ]
    }
  ] as Education[],
  skills: {
    "Programming Languages": ["Python", "Golang", "Bash"],
    "Documentation Tools": ["Gitbook", "Mintlify", "Hugo", "Swagger/OpenAPI", "Docusaurus", "Postman"],
    "Technical Writing & Documentation": ["API Documentation", "Developer Guides", "Technical Tutorials", "Information Architecture", "User Experience Writing" ],
    "Cloud Platforms": ["AWS", "GCP", "DigitalOcean"],
    "Containers & Orchestration": ["Docker", "Kubernetes", "ECS Fargate"],
    "Infrastructure as Code": ["Terraform", "CloudFormation"],
    "CI/CD": ["GitHub Actions", "AWS CodePipeline", "CircleCI", "Travis CI"],
    "Tools & Technologies": ["Git", "Docker", "AWS", "CI/CD"],
    "Version Control": ["GitHub", "GitLab"]
  },
  projects: [
    {
      name: "Portfolio Website",
      description: "Built a responsive portfolio website using Docusaurus, showcasing technical writing samples, project documentation, and professional experience. Implemented modern web development practices with React components, optimised for performance and SEO. Deployed using GitHub Pages with automated CI/CD workflows.",
      technologies: ["Docusaurus", "GitHub Pages", "GitHub Actions"],
      link: "https://github.com/FaithKovi/faithkovi-portfolio"
    },
    {
      name: "Cloud Resume API",
      description: "Developed and automated a CI/CD pipeline using GitHub Actions to provision infrastructure on Amazon Web Services(AWS) with Terraform, including S3, DynamoDB, Lambda, and API Gateway. Implemented scripts to upload and convert resume data for DynamoDB, enabling JSON resume data retrieval via an API Gateway URL and documented infrastructure provisioning workflows with Terraform and GitHub Actions.",
      technologies: ["Python", "Terraform", "GitHub Actions", "AWS"],
      link: "https://github.com/FaithKovi/cloud-resume-api-AWS"
    }
  ] as Project[]
};

const Resume: React.FC = () => {
  return (
    <Layout>
      <Head>
        <title>Resume</title>
        <meta name="description" content="Professional resume and experience" />
      </Head>
      <div className={styles.resumeContainer}>
        <div className={styles.resumeContent}>
          {/* Header Section */}
          <header className={styles.header}>
            <h1 className={styles.name}>{resumeData.personalInfo.name}</h1>
            <h2 className={styles.title}>{resumeData.personalInfo.title}</h2>
            <div className={styles.contactInfo}>
              <div className={styles.contactItem}>
                📧 <a href={`mailto:${resumeData.personalInfo.email}`}>
                  {resumeData.personalInfo.email}
                </a>
              </div>
              <div className={styles.contactItem}>
                💼 <a href={`https://${resumeData.personalInfo.linkedin}`} target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              </div>
              <div className={styles.contactItem}>
                🔗 <a href={`https://${resumeData.personalInfo.github}`} target="_blank" rel="noopener noreferrer">
                  GitHub
                </a>
              </div>
              <div className={styles.contactItem}>
                🌐 <a href={`https://${resumeData.personalInfo.website}`} target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              </div>
            </div>
          </header>

          {/* Summary Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Professional Summary</h3>
            <p className={styles.summary}>{resumeData.summary}</p>
          </section>

          {/* Experience Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Professional Experience</h3>
            {resumeData.experience.map((exp, index) => (
              <div key={index} className={styles.experienceItem}>
                <div className={styles.experienceHeader}>
                  <div>
                    <h4 className={styles.jobTitle}>{exp.title}</h4>
                    <p className={styles.company}>{exp.company} • {exp.location}</p>
                  </div>
                  <span className={styles.duration}>{exp.duration}</span>
                </div>
                <ul className={styles.achievements}>
                  {exp.description.map((achievement, i) => (
                    <li key={i}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>

          {/* Skills Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Technical Skills</h3>
            <div className={styles.skillsGrid}>
              {Object.entries(resumeData.skills).map(([category, skills]) => (
                <div key={category} className={styles.skillCategory}>
                  <h4 className={styles.skillCategoryTitle}>{category}</h4>
                  <div className={styles.skillTags}>
                    {skills.map((skill, index) => (
                      <span key={index} className={styles.skillTag}>{skill}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Featured Projects</h3>
            <div className={styles.projectsGrid}>
              {resumeData.projects.map((project, index) => (
                <div key={index} className={styles.projectCard}>
                  <h4 className={styles.projectTitle}>{project.name}</h4>
                  <p className={styles.projectDescription}>{project.description}</p>
                  <div className={styles.projectTech}>
                    {project.technologies.map((tech, i) => (
                      <span key={i} className={styles.techTag}>{tech}</span>
                    ))}
                  </div>
                  {project.link && (
                    <a 
                      href={project.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className={styles.projectLink}
                    >
                      View Project →
                    </a>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Education Section */}
          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>Education</h3>
            {resumeData.education.map((edu, index) => (
              <div key={index} className={styles.educationItem}>
                <div className={styles.educationHeader}>
                  <div>
                    <h4 className={styles.degree}>{edu.degree}</h4>
                    <p className={styles.institution}>{edu.institution} • {edu.location}</p>
                  </div>
                  <span className={styles.duration}>{edu.duration}</span>
                </div>
                {edu.details && (
                  <ul className={styles.educationDetails}>
                    {edu.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>

          {/* Download Resume Button */}
          <div className={styles.downloadSection}>
            <a 
              href="/resume.pdf" 
              download="Faith_Kovi_Resume.pdf"
              className={styles.downloadButton}
            >
              📄 Download PDF Resume
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Resume;