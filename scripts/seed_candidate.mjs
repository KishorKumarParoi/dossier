const pg = require("/app/node_modules/pg");
const { Client } = pg;

const connectionString = process.env.DATABASE_URL || "postgresql://dossier:postgres@db:5432/dossier";

async function run() {
  const client = new Client({ connectionString });
  await client.connect();
  console.log("Connected to PostgreSQL for profile population...");

  try {
    // 1. Basics in ProfileField
    const basics = [
      ["name", "Kishor Kumar Paroi"],
      ["headline", "Principal AI Systems Architect | (Dev/ML/LLM/AI)Ops | Founder@KoomAI | FDE (LangGraph, Kubernetes, AKS, Fargate, Kubeflow, Hybrid RAG<35ms, Agent Mesh, AI Security) | LLM Fine-Tuning (LoRA, QLoRA, SFT, DPO, FSDP) & vLLM | Data Engineer (AWS, Azure, GCP, Databricks, Snowflake) | Rust Git Engine & Go Microservices"],
      ["email", "kishor.ruet.cse@gmail.com"],
      ["phone", "+880 1724-714156"],
      ["city", "Dhaka"],
      ["country", "Bangladesh"],
      ["linkedin", "https://linkedin.com/in/kishor-kumar-paroi-b06344166"],
      ["website", "https://kishor.tech"],
      ["summary", "Principal AI Systems Architect, (Dev/ML/LLM/AI)Ops leader, and Founder at KoomAI. Specializing in forward-deployed AI, distributed LLM fine-tuning (LoRA, QLoRA, SFT, DPO, DeepSpeed ZeRO-3, PyTorch FSDP, Axolotl, Unsloth), sub-35ms low-latency retrieval systems, LangGraph agent meshes, Kubernetes (AKS, EKS, Fargate), production MLOps/LLMOps flywheels, Medallion lakehouses across AWS, Azure, GCP, and Databricks, with high-throughput Rust Git engines and Go microservices."]
    ];

    for (const [key, value] of basics) {
      await client.query(`
        INSERT INTO "ProfileField" (key, value, "updatedAt")
        VALUES ($1, $2, NOW())
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, "updatedAt" = NOW()
      `, [key, value]);
    }
    console.log("✓ Profile basics seeded with AKS & Fargate Headline.");

    // 2. Languages
    await client.query(`
      INSERT INTO "Language" (id, name, level, sort, "createdAt")
      VALUES 
        ('lang-1', 'English', 'C2', 0, NOW()),
        ('lang-2', 'Bengali', 'NATIVE', 1, NOW())
      ON CONFLICT (name) DO UPDATE SET level = EXCLUDED.level
    `);
    console.log("✓ Languages seeded.");

    // 3. Core Skills
    await client.query(`DELETE FROM "ExperienceSkill"`);
    await client.query(`DELETE FROM "ProjectSkill"`);
    await client.query(`DELETE FROM "Skill"`);

    const skills = [
      "(Dev/ML/LLM/AI)Ops", "LLM Fine-Tuning", "LoRA / QLoRA", "SFT & DPO Alignment", 
      "PyTorch FSDP", "DeepSpeed ZeRO-3", "Unsloth", "Axolotl", "Hugging Face TRL",
      "LangGraph", "FastMCP", "Hybrid RAG", "vLLM", "Kubeflow", "Kubernetes", "AKS", "AWS Fargate", 
      "PySpark", "Delta Lake", "Snowflake", "Docker", "Rust Git Engine", "Go Microservices", 
      "Rust", "Go", "Python", "PyTorch", "FlashAttention-2", "NeMo Guardrails", "Kafka", 
      "MLOps", "LLMOps", "Databricks", "AWS", "GCP", "Azure", "Terraform IaC"
    ];

    for (let i = 0; i < skills.length; i++) {
      const name = skills[i];
      await client.query(`
        INSERT INTO "Skill" (id, name, sort, "createdAt")
        VALUES ($1, $2, $3, NOW())
      `, [`skill-${i + 1}`, name, i]);
    }
    console.log("✓ Skills seeded with AKS & Fargate (" + skills.length + " total).");

    // 4. Experience
    await client.query(`DELETE FROM "ExperienceSkill"`);
    await client.query(`DELETE FROM "Experience"`);

    const experiences = [
      {
        id: "exp-1",
        role: "Forward Deployed AI Engineer (Production RAG, GenAI & MLOps)",
        company: "phi0.ai",
        location: "Europe / Remote",
        startYear: 2026,
        startMonth: 7,
        endYear: 2026,
        endMonth: 10,
        current: false,
        bullets: "Orchestrated forward deployment of 5 concurrent autonomous AI agents executing multi-step tools, cyclic state machines (LangGraph), and dynamic routing; attained 99.4% task completion.\nDevised high-throughput Hybrid RAG engine combining dense HNSW vector search, sparse BM25, and multi-stage re-ranking (FlashRank ONNX + Cohere v3.5) with semantic caching (<35ms latency); curtailed hallucinations by 46%.\nFine-tuned open-source LLMs (Llama 3.3, Mistral) using QLoRA and DPO for specialized customer routing; deployed multi-adapter serving in vLLM.\nCodified continuous MLOps & GenAI flywheel featuring NeMo Guardrails, autonomous PII scrubbing, and canary model rollouts on Kubernetes, securing $1.4M in enterprise contracts.",
        sort: 0
      },
      {
        id: "exp-2",
        role: "Data Engineering & AI Systems Intern",
        company: "Samsung AI Core / Care Health",
        location: "Gurgaon / Remote",
        startYear: 2026,
        startMonth: 3,
        endYear: 2026,
        endMonth: 6,
        current: false,
        bullets: "Spearheaded multi-node distributed LLM fine-tuning with PyTorch FSDP and DeepSpeed ZeRO-3 alongside HIPAA-compliant de-identification; trimmed training wall-clock time by 42% ($14K saved/run).\nAccelerated 8B/70B LLM inference on NVIDIA H100 GPUs via FlashAttention-2 and custom fused CUDA kernels; realized 3.8x throughput on >32K context windows, mitigating p99 latency by 54%.\nFormulated batch & streaming pipelines via AWS S3, EMR, Athena, PySpark; slashed operational compute overhead by $4.2K/run via event-driven worker dispatch.\nDeployed real-time health insurance claim fraud detection pipeline over AWS Kinesis and OpenTelemetry; safeguarded $380K annually.",
        sort: 1
      },
      {
        id: "exp-3",
        role: "Senior Full Stack Engineer",
        company: "kepi.ai",
        location: "Rajshahi, Bangladesh (Remote)",
        startYear: 2022,
        startMonth: 1,
        endYear: 2025,
        endMonth: 9,
        current: false,
        bullets: "Architected zero-downtime microservices migration to Kubernetes on AWS EKS; scaled platform throughput by 300% while curtailing p95 latency by 48% at 99.99% multi-region availability.\nSpearheaded enterprise AI initiatives: devised autonomous multi-agent pipelines and scalable LLM microservices, driving a 22% sustained increase in customer LTV.\nFortified zero-trust mesh infrastructure with Istio mTLS and fine-grained RBAC.\nDesigned event-driven asynchronous processing core using Redis Streams and Celery; sustained 15M+ daily async background tasks.",
        sort: 2
      },
      {
        id: "exp-4",
        role: "Full Stack Engineer",
        company: "foodpanda",
        location: "Dhaka / Remote",
        startYear: 2021,
        startMonth: 1,
        endYear: 2022,
        endMonth: 12,
        current: false,
        bullets: "Crafted high-traffic checkout microservices with Next.js/MERN; trimmed latency by 34% and sustained 100K+ daily peak orders at 99.98% uptime, averting $120K in checkout cart abandonment.",
        sort: 3
      }
    ];

    for (const exp of experiences) {
      await client.query(`
        INSERT INTO "Experience" (id, role, company, location, "startYear", "startMonth", "endYear", "endMonth", current, bullets, sort, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      `, [exp.id, exp.role, exp.company, exp.location, exp.startYear, exp.startMonth, exp.endYear, exp.endMonth, exp.current, exp.bullets, exp.sort]);
    }
    console.log("✓ Experience entries seeded with fine-tuning achievements.");

    // 5. Projects
    await client.query(`DELETE FROM "ProjectSkill"`);
    await client.query(`DELETE FROM "Project"`);

    const projects = [
      {
        id: "proj-1",
        name: "KoomAI: Sub-35ms Agentic Hybrid RAG",
        link: "https://koom.kishor.tech/",
        startYear: 2026,
        startMonth: 1,
        endYear: null,
        endMonth: null,
        current: true,
        bullets: "Architected sub-35ms multi-stage retrieval combining HNSW vector search, BM25, and local ONNX re-ranking with semantic caching.\nIntegrated FastMCP tools and LangGraph state machines for enterprise autonomous agent workflows.",
        sort: 0
      },
      {
        id: "proj-2",
        name: "Distributed LLM Fine-Tuning & Alignment Engine (LoRA / DPO)",
        link: "https://github.com/KishorKumarParoi",
        startYear: 2026,
        startMonth: 2,
        endYear: null,
        endMonth: null,
        current: true,
        bullets: "Engineered scalable distributed fine-tuning harness with PyTorch FSDP, DeepSpeed ZeRO-3, Unsloth, and Hugging Face TRL.\nImplemented supervised fine-tuning (SFT) and Direct Preference Optimization (DPO) on domain datasets with 4-bit QLoRA, realizing 38% accuracy gains over base models.",
        sort: 1
      },
      {
        id: "proj-3",
        name: "Nexus Lakehouse: Medallion Streaming Pipeline",
        link: "https://github.com/KishorKumarParoi/Koom-AI",
        startYear: 2025,
        startMonth: 6,
        endYear: 2026,
        endMonth: 2,
        current: false,
        bullets: "Engineered scalable Bronze-Silver-Gold medallion architecture using Apache Spark, Delta Lake, and Kafka streaming.\nImplemented automated SCD Type-2 dimension tracking and real-time schema evolution.",
        sort: 2
      },
      {
        id: "proj-4",
        name: "Rust Git Engine & Go Microservices Platform",
        link: "https://github.com/KishorKumarParoi",
        startYear: 2025,
        startMonth: 1,
        endYear: 2025,
        endMonth: 6,
        current: false,
        bullets: "Engineered high-throughput Git storage and diffing engine in Rust, featuring custom packfile parsers, object compression, and parallel tree traversal.\nDesigned Go microservices gateway with gRPC and Protocol Buffers for sub-5ms repository queries and multi-region synchronization.",
        sort: 3
      }
    ];

    for (const proj of projects) {
      await client.query(`
        INSERT INTO "Project" (id, name, link, "startYear", "startMonth", "endYear", "endMonth", current, bullets, sort, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
      `, [proj.id, proj.name, proj.link, proj.startYear, proj.startMonth, proj.endYear, proj.endMonth, proj.current, proj.bullets, proj.sort]);
    }
    console.log("✓ Projects seeded with Fine-Tuning Engine.");

    // 6. Education
    await client.query(`DELETE FROM "Education"`);
    await client.query(`
      INSERT INTO "Education" (id, degree, school, "startYear", "startMonth", "endYear", "endMonth", current, notes, sort, "createdAt", "updatedAt")
      VALUES 
        ('edu-1', 'B.Sc. in Computer Science & Engineering', 'Rajshahi University of Engineering & Technology (RUET)', 2018, 1, 2023, 12, false, 'CGPA: 3.25 / 4.00 (Distinction). Ranked 483rd in Bangladesh National Admission.', 0, NOW(), NOW()),
        ('edu-2', 'Higher Secondary Certificate (HSC)', 'Saint Joseph Higher Secondary School', 2015, 1, 2017, 6, false, 'GPA: 5.00 / 5.00. Ranked 85th in Dhaka Education Board.', 1, NOW(), NOW())
    `);
    console.log("✓ Education seeded.");

    // 7. Facts
    await client.query(`DELETE FROM "Fact"`);
    const facts = [
      "Founder of KoomAI, building production agent meshes and sub-35ms low latency retrieval systems.",
      "Engineered distributed LLM fine-tuning pipelines using LoRA, QLoRA, SFT, DPO, PyTorch FSDP, and DeepSpeed ZeRO-3.",
      "Delivered production AI deployments across LangGraph, Kubernetes, FastMCP, and hybrid retrieval.",
      "Specialized in Medallion Lakehouses with PySpark, Delta Lake, Snowflake, and streaming Kafka."
    ];
    for (let i = 0; i < facts.length; i++) {
      await client.query(`
        INSERT INTO "Fact" (id, text, sort, "createdAt", "updatedAt")
        VALUES ($1, $2, $3, NOW(), NOW())
      `, [`fact-${i + 1}`, facts[i], i]);
    }
    console.log("✓ Facts seeded.");

    console.log("\n🚀 All resume data with LLM Fine-Tuning successfully populated into Dossier!");
  } finally {
    await client.end();
  }
}

run().catch((err) => {
  console.error("Error seeding candidate resume:", err);
  process.exit(1);
});
