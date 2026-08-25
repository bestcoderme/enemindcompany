/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Course, Assignment, LearningStudyGroup, LearningNote, Certificate } from '../../types/learning';

export const INITIAL_COURSES: Course[] = [
  {
    id: 'course_py_data',
    title: 'Python for Data Analysis & Statistical Modeling',
    shortDescription: 'Master pandas, NumPy, SQL integration, and automated reporting connected to Google Sheets.',
    description: 'A comprehensive, project-driven course designed for university students transitioning into Data Analytics and ML Engineering. Covers data cleaning, exploratory analysis, visualization, and cloud database queries.',
    providerId: 'provider_dr_amina',
    providerName: 'Dr. Amina Ochieng',
    providerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    providerType: 'TEACHER',
    category: 'Computer Science',
    subject: 'Data Science & Python',
    skills: ['Python', 'SQL', 'pandas', 'Data Visualization', 'Google Sheets'],
    careerPaths: ['Data Analyst', 'Machine Learning Engineer', 'Financial Analyst'],
    level: 'BEGINNER',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    duration: '6 Weeks (18 Hours)',
    requirements: ['Basic computer literacy', 'Google account for Drive & Colab sync'],
    price: 0,
    currency: 'KSh',
    isFree: true,
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    courseType: 'SELF_PACED',
    googleClassroomId: 'cls_course_01',
    googleDriveFolderId: 'drive_folder_py_data',
    googleMeetUrl: 'https://meet.google.com/enemind-data-lab',
    googleChatSpaceId: 'spaces/python_data_2026',
    enrollmentCount: 342,
    rating: 4.9,
    ratingCount: 88,
    certificateAvailable: true,
    createdAt: '2026-06-15T10:00:00Z',
    updatedAt: '2026-08-20T14:30:00Z',
    lessons: [
      {
        id: 'lsn_py_01',
        courseId: 'course_py_data',
        title: '01. Python Setup & Google Colab Cloud Notebooks',
        description: 'Set up your cloud development environment, connect Google Drive for persistent storage, and write your first vectorized operations.',
        order: 1,
        type: 'VIDEO',
        duration: '45 mins',
        content: `### Welcome to Python for Data Analysis
In this first module, we introduce Python virtual environments and Google Colab cloud execution.

Key takeaways:
1. **Google Drive Integration**: Mounting Drive notebooks via \`from google.colab import drive\`.
2. **Core Data Structures**: Lists, Tuples, Dictionaries, and Vectorized operations.
3. **Memory Management**: How memory allocation works when loading 100k+ row datasets.`,
        resourceLinks: [
          { title: 'Google Colab Starter Notebook', url: 'https://colab.research.google.com/notebooks/intro.ipynb', type: 'doc' },
          { title: 'Google Drive Datasets Folder', url: 'https://drive.google.com/drive/folders/enemind_datasets', type: 'drive' }
        ],
        googleDocId: 'doc_py_colab_guide',
        googleDocUrl: 'https://docs.google.com/document/d/demo_py_colab',
        status: 'AVAILABLE',
        createdAt: '2026-06-15T10:00:00Z',
        updatedAt: '2026-06-15T10:00:00Z',
      },
      {
        id: 'lsn_py_02',
        courseId: 'course_py_data',
        title: '02. Data Cleaning with pandas & Real University Datasets',
        description: 'Handling missing values, deduplication, datetime parsing, and reshaping complex survey data.',
        order: 2,
        type: 'DOCUMENT',
        duration: '50 mins',
        content: `### Cleaning Data with Pandas
Data in the wild is messy. Learn how to diagnose missing values, convert data types safely, and export structured summaries directly into Google Sheets.`,
        resourceLinks: [
          { title: 'Pandas Cheat Sheet (PDF in Drive)', url: 'https://drive.google.com/file/d/demo_pandas_cheat', type: 'drive' }
        ],
        googleDriveFileId: 'file_pandas_summary',
        status: 'AVAILABLE',
        createdAt: '2026-06-16T10:00:00Z',
        updatedAt: '2026-06-16T10:00:00Z',
      },
      {
        id: 'lsn_py_03',
        courseId: 'course_py_data',
        title: '03. Live Workshop: Interactive Dashboards & Google Sheets Sync',
        description: 'Interactive session on syncing cleaned data directly to automated Google Sheets using Google Apps Script.',
        order: 3,
        type: 'LIVE_SESSION',
        duration: '60 mins',
        content: `Join Dr. Amina on Google Meet for live code reviews and automated Sheets integration.`,
        googleMeetId: 'meet_py_live_03',
        googleMeetUrl: 'https://meet.google.com/enemind-data-lab',
        status: 'AVAILABLE',
        createdAt: '2026-06-17T10:00:00Z',
        updatedAt: '2026-06-17T10:00:00Z',
      },
      {
        id: 'lsn_py_04',
        courseId: 'course_py_data',
        title: '04. Hands-On Project: Campus Spending & Grade Analytics',
        description: 'Analyze real campus transaction and exam performance data to identify key student trends.',
        order: 4,
        type: 'PROJECT',
        duration: '2 hours',
        content: `Submit your Google Colab link or GitHub repository. Include charts, regression metrics, and insights.`,
        googleDocUrl: 'https://docs.google.com/document/d/demo_project_spec',
        status: 'AVAILABLE',
        createdAt: '2026-06-18T10:00:00Z',
        updatedAt: '2026-06-18T10:00:00Z',
      },
      {
        id: 'lsn_py_05',
        courseId: 'course_py_data',
        title: '05. Knowledge Check: Data Analysis Quiz (Google Form)',
        description: 'Test your understanding of indexing, group-by aggregations, and data validation.',
        order: 5,
        type: 'QUIZ',
        duration: '30 mins',
        googleFormId: 'form_py_quiz_05',
        googleFormUrl: 'https://docs.google.com/forms/d/demo_py_quiz',
        status: 'AVAILABLE',
        createdAt: '2026-06-19T10:00:00Z',
        updatedAt: '2026-06-19T10:00:00Z',
      }
    ]
  },
  {
    id: 'course_cloud_devops',
    title: 'Cloud DevOps, Docker & Kubernetes Engineering',
    shortDescription: 'From Linux containerization to CI/CD pipelines and microservice orchestration on GCP & AWS.',
    description: 'Learn container architecture, Dockerfiles, multi-stage builds, Kubernetes pod manifests, ingress controllers, and automated GitHub Actions workflows.',
    providerId: 'provider_eng_mwangi',
    providerName: 'Eng. Brian Mwangi',
    providerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    providerType: 'TEACHER',
    category: 'Engineering',
    subject: 'Cloud & Infrastructure',
    skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux', 'GCP', 'DevOps'],
    careerPaths: ['DevOps Engineer', 'Cloud Architect', 'Software Engineer'],
    level: 'INTERMEDIATE',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
    duration: '8 Weeks (32 Hours)',
    requirements: ['Familiarity with command line & basic Git'],
    price: 350,
    currency: 'KSh',
    isFree: false,
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    courseType: 'COHORT',
    googleClassroomId: 'cls_course_01',
    googleDriveFolderId: 'drive_folder_cloud_devops',
    googleMeetUrl: 'https://meet.google.com/devops-cohort-2026',
    enrollmentCount: 198,
    rating: 4.95,
    ratingCount: 64,
    certificateAvailable: true,
    createdAt: '2026-05-10T10:00:00Z',
    updatedAt: '2026-08-18T11:00:00Z',
    lessons: [
      {
        id: 'lsn_cd_01',
        courseId: 'course_cloud_devops',
        title: '01. Container Internals: Namespaces, cgroups & Docker',
        description: 'Understand low-level Linux isolation mechanisms and build production Docker images with minimal security footprint.',
        order: 1,
        type: 'DOCUMENT',
        duration: '1 hour',
        content: `### Containerization Deep-Dive
Why virtual machines are heavyweight and how Linux kernel namespaces provide sub-second isolation for container workloads.`,
        googleDocUrl: 'https://docs.google.com/document/d/demo_docker_internals',
        status: 'AVAILABLE',
        createdAt: '2026-05-10T10:00:00Z',
        updatedAt: '2026-05-10T10:00:00Z',
      },
      {
        id: 'lsn_cd_02',
        courseId: 'course_cloud_devops',
        title: '02. Kubernetes Architecture: Pods, Services & Deployments',
        description: 'Deploy stateless microservices across multi-node clusters with automated self-healing.',
        order: 2,
        type: 'VIDEO',
        duration: '1.5 hours',
        resourceLinks: [
          { title: 'Architecture Slides (Google Slides)', url: 'https://docs.google.com/presentation/d/demo_k8s_slides', type: 'slides' }
        ],
        googleSlidesUrl: 'https://docs.google.com/presentation/d/demo_k8s_slides',
        status: 'AVAILABLE',
        createdAt: '2026-05-12T10:00:00Z',
        updatedAt: '2026-05-12T10:00:00Z',
      },
      {
        id: 'lsn_cd_03',
        courseId: 'course_cloud_devops',
        title: '03. Google Classroom Assignment: Microservice Deployment',
        description: 'Write Helm charts and deploy a 3-tier application connected to a PostgreSQL database.',
        order: 3,
        type: 'GOOGLE_CLASSROOM_ACTIVITY',
        duration: '2.5 hours',
        googleDocUrl: 'https://docs.google.com/document/d/demo_helm_spec',
        status: 'AVAILABLE',
        createdAt: '2026-05-15T10:00:00Z',
        updatedAt: '2026-05-15T10:00:00Z',
      }
    ]
  },
  {
    id: 'course_fullstack_ts',
    title: 'Modern Full-Stack Web: React 19, Node.js & TypeScript',
    shortDescription: 'Build production-ready, performant web applications with Tailwind CSS, REST APIs, and authentication.',
    description: 'Learn modern web standards, state management, asynchronous server APIs, secure JWT tokens, and automated unit testing.',
    providerId: 'provider_prof_sarah',
    providerName: 'Prof. Sarah Kimani',
    providerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    providerType: 'TEACHER',
    category: 'Computer Science',
    subject: 'Web Development',
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'REST APIs'],
    careerPaths: ['Full-Stack Developer', 'Frontend Engineer', 'Software Engineer'],
    level: 'BEGINNER',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=600&auto=format&fit=crop&q=80',
    duration: '7 Weeks (28 Hours)',
    requirements: ['Basic HTML/CSS understanding'],
    price: 0,
    currency: 'KSh',
    isFree: true,
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    courseType: 'SELF_PACED',
    googleClassroomId: 'cls_course_03',
    googleDriveFolderId: 'drive_folder_web_dev',
    enrollmentCount: 512,
    rating: 4.88,
    ratingCount: 140,
    certificateAvailable: true,
    createdAt: '2026-04-01T10:00:00Z',
    updatedAt: '2026-08-10T12:00:00Z',
    lessons: [
      {
        id: 'lsn_fs_01',
        courseId: 'course_fullstack_ts',
        title: '01. Modern TypeScript & React Component Paradigms',
        description: 'Props typing, custom hooks, memoization patterns, and accessibility principles.',
        order: 1,
        type: 'DOCUMENT',
        duration: '55 mins',
        googleDocUrl: 'https://docs.google.com/document/d/demo_react_ts',
        status: 'AVAILABLE',
        createdAt: '2026-04-01T10:00:00Z',
        updatedAt: '2026-04-01T10:00:00Z',
      },
      {
        id: 'lsn_fs_02',
        courseId: 'course_fullstack_ts',
        title: '02. Building Robust REST APIs with Express & Middleware',
        description: 'Rate limiting, CORS configuration, schema validation with Zod, and error handling.',
        order: 2,
        type: 'VIDEO',
        duration: '1.2 hours',
        status: 'AVAILABLE',
        createdAt: '2026-04-05T10:00:00Z',
        updatedAt: '2026-04-05T10:00:00Z',
      },
      {
        id: 'lsn_fs_03',
        courseId: 'course_fullstack_ts',
        title: '03. Project: Campus Housing & Marketplace Full-Stack App',
        description: 'Implement user auth, database models, and responsive search filtering.',
        order: 3,
        type: 'PROJECT',
        duration: '3 hours',
        status: 'AVAILABLE',
        createdAt: '2026-04-10T10:00:00Z',
        updatedAt: '2026-04-10T10:00:00Z',
      }
    ]
  },
  {
    id: 'course_cyber_sec',
    title: 'Cybersecurity Fundamentals & Network Defense',
    shortDescription: 'Ethical hacking methodologies, OWASP Top 10 vulnerabilities, encryption, and threat modeling.',
    description: 'Master security principles, penetration testing fundamentals, public key infrastructure (PKI), TLS certificates, and vulnerability assessments.',
    providerId: 'provider_eng_mwangi',
    providerName: 'Eng. Brian Mwangi',
    providerType: 'TEACHER',
    category: 'Cybersecurity',
    subject: 'Information Security',
    skills: ['Cybersecurity', 'Network Security', 'Cryptography', 'Penetration Testing', 'Linux'],
    careerPaths: ['Security Analyst', 'Cybersecurity Engineer', 'DevSecOps Specialist'],
    level: 'INTERMEDIATE',
    language: 'English',
    thumbnail: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
    duration: '6 Weeks (20 Hours)',
    requirements: ['Computer networking fundamentals'],
    price: 300,
    currency: 'KSh',
    isFree: false,
    status: 'PUBLISHED',
    visibility: 'PUBLIC',
    courseType: 'LIVE',
    googleMeetUrl: 'https://meet.google.com/sec-defense-live',
    enrollmentCount: 165,
    rating: 4.92,
    ratingCount: 42,
    certificateAvailable: true,
    createdAt: '2026-06-01T10:00:00Z',
    updatedAt: '2026-08-15T09:00:00Z',
    lessons: [
      {
        id: 'lsn_sec_01',
        courseId: 'course_cyber_sec',
        title: '01. Threat Modeling & OWASP Top 10 Web Vulnerabilities',
        description: 'SQL Injection, XSS, SSRF, and authentication bypass attack vectors with mitigation code.',
        order: 1,
        type: 'VIDEO',
        duration: '1 hour',
        status: 'AVAILABLE',
        createdAt: '2026-06-01T10:00:00Z',
        updatedAt: '2026-06-01T10:00:00Z',
      },
      {
        id: 'lsn_sec_02',
        courseId: 'course_cyber_sec',
        title: '02. Cryptography, AES/RSA Keys & PKI Infrastructure',
        description: 'Symmetric vs asymmetric encryption, digital signatures, and certificate authorities.',
        order: 2,
        type: 'DOCUMENT',
        duration: '45 mins',
        googleDocUrl: 'https://docs.google.com/document/d/demo_crypto_notes',
        status: 'AVAILABLE',
        createdAt: '2026-06-03T10:00:00Z',
        updatedAt: '2026-06-03T10:00:00Z',
      }
    ]
  }
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg_01',
    courseId: 'course_py_data',
    courseTitle: 'Python for Data Analysis',
    teacherId: 'provider_dr_amina',
    teacherName: 'Dr. Amina Ochieng',
    title: 'University GPA Distribution & Regression Model',
    description: 'Clean the provided semester dataset and generate a predictive model for graduation honor categories. Export metrics to Google Sheets.',
    dueDate: '2026-09-05T23:59:59Z',
    maxScore: 100,
    googleClassroomAssignmentId: 'cw_01',
    googleFormId: 'form_asg_gpa_01',
    googleDriveFolderId: 'drive_asg_01',
    status: 'ACTIVE',
  },
  {
    id: 'asg_02',
    courseId: 'course_cloud_devops',
    courseTitle: 'Cloud DevOps & Kubernetes',
    teacherId: 'provider_eng_mwangi',
    teacherName: 'Eng. Brian Mwangi',
    title: 'Multi-Container Docker Compose & Nginx Ingress',
    description: 'Construct a resilient docker-compose environment with healthchecks, persistent volumes, and reverse proxy routing.',
    dueDate: '2026-09-12T23:59:59Z',
    maxScore: 50,
    googleClassroomAssignmentId: 'cw_02',
    googleDriveFolderId: 'drive_asg_02',
    status: 'ACTIVE',
  }
];

export const INITIAL_STUDY_GROUPS: LearningStudyGroup[] = [
  {
    id: 'group_eee421',
    name: 'CSC & EEE 421 Cloud Systems Study Circle',
    description: 'Collaborative revision group preparing for final semester examinations, sharing lab configs and Google Drive past papers.',
    courseId: 'course_cloud_devops',
    courseTitle: 'Cloud DevOps & Kubernetes',
    subject: 'Distributed Systems',
    teacherId: 'provider_eng_mwangi',
    isPrivate: false,
    createdAt: '2026-08-01T10:00:00Z',
    googleChatSpaceId: 'spaces/eee421_cloud_circle',
    googleDriveFolderId: 'drive_grp_eee421',
    googleMeetUrl: 'https://meet.google.com/eee421-study-room',
    members: [
      { id: 'usr_01', name: 'Alex Muli', role: 'ADMIN', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', joinedAt: '2026-08-01' },
      { id: 'usr_02', name: 'Faith Wanjiku', role: 'MODERATOR', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100', joinedAt: '2026-08-02' },
      { id: 'usr_03', name: 'David Kiprono', role: 'MEMBER', avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100', joinedAt: '2026-08-03' }
    ],
    resources: [
      { id: 'res_01', title: '2025 Past Exam Solutions (Google Doc)', type: 'doc', url: 'https://docs.google.com/document/d/demo_eee421_pastpaper', addedBy: 'Alex Muli', date: '2026-08-10' },
      { id: 'res_02', title: 'Group Lab Drive Folder', type: 'drive', url: 'https://drive.google.com/drive/folders/demo_eee421_folder', addedBy: 'Faith Wanjiku', date: '2026-08-12' },
      { id: 'res_03', title: 'Exam Revision Tracker (Google Sheet)', type: 'sheet', url: 'https://docs.google.com/spreadsheets/d/demo_eee421_sheet', addedBy: 'Alex Muli', date: '2026-08-15' }
    ],
    announcements: [
      { id: 'ann_01', author: 'Alex Muli', content: 'Upcoming group study session this Friday at 7 PM on Google Meet to review Raft consensus algorithm.', date: '2026-08-20' }
    ]
  },
  {
    id: 'group_data_analysts',
    name: 'Nairobi Student Data Science Guild',
    description: 'Weekly portfolio building, Kaggle competitions, SQL problem sets, and peer resume reviews for campus analysts.',
    courseId: 'course_py_data',
    courseTitle: 'Python for Data Analysis',
    subject: 'Data Science',
    isPrivate: false,
    createdAt: '2026-07-20T10:00:00Z',
    googleChatSpaceId: 'spaces/data_science_guild',
    googleDriveFolderId: 'drive_grp_data_guild',
    googleMeetUrl: 'https://meet.google.com/nairobi-data-guild',
    members: [
      { id: 'usr_01', name: 'Alex Muli', role: 'MEMBER', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100', joinedAt: '2026-07-20' },
      { id: 'usr_04', name: 'Mercy Jebet', role: 'ADMIN', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100', joinedAt: '2026-07-20' }
    ],
    resources: [
      { id: 'res_04', title: 'SQL Practice Problems (Google Sheet)', type: 'sheet', url: 'https://docs.google.com/spreadsheets/d/demo_sql_questions', addedBy: 'Mercy Jebet', date: '2026-07-25' }
    ],
    announcements: [
      { id: 'ann_02', author: 'Mercy Jebet', content: 'Dataset for Week 4 project has been uploaded to the shared Google Drive folder!', date: '2026-08-18' }
    ]
  }
];

export const INITIAL_USER_NOTES: LearningNote[] = [
  {
    id: 'note_01',
    ownerId: 'usr_default',
    title: 'Linear Algebra: Eigenvalues & Principal Component Analysis (PCA)',
    content: `# Linear Algebra: Eigenvalues & PCA

## 1. Geometric Intuition
An eigenvector $v$ of a linear transformation matrix $A$ is a non-zero vector whose direction remains unchanged after transformation:
$$Av = \\lambda v$$

Where $\\lambda$ is the corresponding scalar eigenvalue.

## 2. Derivation of Characteristic Equation
$$(A - \\lambda I)v = 0$$

For a non-trivial solution ($v \\neq 0$), the determinant must equal zero:
$$\\det(A - \\lambda I) = 0$$

## 3. Application in Machine Learning
1. **Dimensionality Reduction**: Project high-dimensional vectors along axes of maximum variance.
2. **Covariance Matrix Spectral Decomposition**: Find orthogonal principal component axes.`,
    noteType: 'LECTURE',
    subject: 'Mathematics',
    courseId: 'cls_course_02',
    courseTitle: 'MAT 220: Linear Algebra & Matrix Computing',
    tags: ['Math', 'LinearAlgebra', 'DataScience', 'ExamPrep'],
    visibility: 'PRIVATE',
    isFavorite: true,
    isArchived: false,
    googleDocUrl: 'https://docs.google.com/document/d/demo_eigenvalues_doc',
    createdAt: '2026-08-18T14:00:00Z',
    updatedAt: '2026-08-22T16:30:00Z',
  },
  {
    id: 'note_02',
    ownerId: 'usr_default',
    title: 'Distributed Systems: Raft Consensus Protocol Notes',
    content: `# Raft Consensus Protocol Architecture

## Key Roles in a Cluster
1. **Leader**: Handles all client requests and manages log replication to followers.
2. **Follower**: Passive responder to heartbeats and appendEntries RPCs.
3. **Candidate**: State triggered upon election timeout.

## Election Safety Invariants
- Only one leader can be elected per term.
- Leader completeness: A candidate must contain all committed log entries to win an election.`,
    noteType: 'STUDY',
    subject: 'Computer Science',
    courseId: 'course_cloud_devops',
    courseTitle: 'Cloud DevOps & Kubernetes',
    tags: ['DistributedSystems', 'Raft', 'DevOps', 'CSC311'],
    visibility: 'PRIVATE',
    isFavorite: true,
    isArchived: false,
    createdAt: '2026-08-19T09:20:00Z',
    updatedAt: '2026-08-21T11:00:00Z',
  }
];

export const INITIAL_CERTIFICATES: Certificate[] = [
  {
    id: 'cert_enemind_py_01',
    studentId: 'usr_default',
    studentName: 'Alex Muli',
    courseId: 'course_py_data',
    courseTitle: 'Python for Data Analysis & Statistical Modeling',
    providerId: 'provider_dr_amina',
    providerName: 'Dr. Amina Ochieng',
    issuedAt: '2026-08-20T12:00:00Z',
    certificateNumber: 'ENE-CERT-2026-PY8832',
    verificationUrl: 'https://enemind.org/verify/ENE-CERT-2026-PY8832',
    skills: ['Python', 'pandas', 'SQL', 'Data Analytics', 'Google Drive Integration'],
    gradeScore: '96% (Distinction)',
  }
];
