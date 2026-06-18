import type { CompanyPersonProfile } from "../types/companyPeople";

type PersonInput = Omit<
  CompanyPersonProfile,
  "id" | "entityId" | "linkedinSearchUrl" | "linkStatus"
> & {
  linkStatus?: CompanyPersonProfile["linkStatus"];
  linkedinSearchKeywords?: string;
};

const linkedinPeopleSearchUrl = (keywords: string) =>
  `https://www.linkedin.com/search/results/people/?keywords=${encodeURIComponent(keywords)}`;

export const linkedinCompanySearchUrl = (companyName: string) =>
  `https://www.linkedin.com/search/results/companies/?keywords=${encodeURIComponent(companyName)}`;

export const linkedinCompanyPeopleSearchUrl = (companyName: string, intent = "AI leadership engineering") =>
  linkedinPeopleSearchUrl(`${companyName} ${intent}`);

const person = (
  entityId: string,
  companyName: string,
  input: PersonInput,
): CompanyPersonProfile => ({
  ...input,
  id: `${entityId}-${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`,
  entityId,
  linkedinSearchUrl: linkedinPeopleSearchUrl(
    input.linkedinSearchKeywords ?? `${input.name} ${companyName}`,
  ),
  linkStatus: input.linkStatus ?? (input.linkedinUrl ? "verified-profile" : "linkedin-search"),
});

const peopleFor = (
  entityId: string,
  companyName: string,
  people: PersonInput[],
): CompanyPersonProfile[] => people.map((item) => person(entityId, companyName, item));

export const companyPeopleByEntityId: Record<string, CompanyPersonProfile[]> = {
  openai: peopleFor("openai", "OpenAI", [
    {
      name: "Sam Altman",
      role: "CEO / company leadership",
      focus: "Capital strategy, product direction, ecosystem partnerships",
      location: "San Francisco Bay Area",
      profileSummary:
        "Public-facing executive lead for OpenAI. Useful for reading the company's commercial priorities, platform posture, and partnership strategy.",
      signals: ["CEO", "Platform strategy", "Enterprise ecosystem"],
    },
    {
      name: "Greg Brockman",
      role: "President / technical leadership",
      focus: "Research execution, engineering culture, frontier model systems",
      location: "San Francisco Bay Area",
      profileSummary:
        "Co-founder profile tied to OpenAI's engineering organization and frontier model execution. Useful for understanding technical operating cadence.",
      signals: ["Co-founder", "Engineering leadership", "Frontier systems"],
    },
    {
      name: "Mark Chen",
      role: "Research leadership",
      focus: "Frontier model research, post-training, productized model quality",
      profileSummary:
        "Research leader associated with OpenAI model capability development. Useful for tracking how benchmark gains translate into product releases.",
      signals: ["Research", "Model quality", "Post-training"],
    },
    {
      name: "Jakub Pachocki",
      role: "Chief scientist / research leadership",
      focus: "Core model research, reasoning systems, technical roadmap",
      profileSummary:
        "Senior research profile tied to OpenAI's core model roadmap. Useful for following model capability, reasoning, and scaling direction.",
      signals: ["Chief scientist", "Reasoning", "Core research"],
    },
  ]),
  anthropic: peopleFor("anthropic", "Anthropic", [
    {
      name: "Dario Amodei",
      role: "CEO / research leadership",
      focus: "Frontier model strategy, safety posture, enterprise direction",
      location: "San Francisco Bay Area",
      profileSummary:
        "Co-founder and public executive lead for Anthropic. Useful for reading Claude's safety, enterprise, and frontier capability positioning.",
      signals: ["CEO", "AI safety", "Claude strategy"],
    },
    {
      name: "Daniela Amodei",
      role: "President / operating leadership",
      focus: "Company operations, go-to-market, enterprise adoption",
      profileSummary:
        "Operating leader associated with Anthropic's scaling from research lab to enterprise AI platform.",
      signals: ["President", "Operations", "Enterprise adoption"],
    },
    {
      name: "Jared Kaplan",
      role: "Co-founder / science leadership",
      focus: "Scaling laws, model behavior, research direction",
      profileSummary:
        "Research profile connected to scaling laws and frontier model behavior. Useful for understanding Claude's technical foundations.",
      signals: ["Co-founder", "Scaling laws", "Research"],
    },
    {
      name: "Sam McCandlish",
      role: "Research leadership",
      focus: "Model scaling, training dynamics, alignment research",
      profileSummary:
        "Research leader associated with Anthropic's model scaling and training agenda.",
      signals: ["Research", "Training dynamics", "Alignment"],
    },
  ]),
  "google-deepmind": peopleFor("google-deepmind", "Google DeepMind", [
    {
      name: "Demis Hassabis",
      role: "CEO / research leadership",
      focus: "AI research strategy, Gemini, scientific AI",
      location: "London",
      profileSummary:
        "Executive and scientific lead for Google DeepMind. Useful for tracking the link between Gemini, scientific AI, and long-horizon research bets.",
      signals: ["CEO", "Scientific AI", "Gemini"],
    },
    {
      name: "Koray Kavukcuoglu",
      role: "Research and technology leadership",
      focus: "Model research, AI systems, applied research translation",
      profileSummary:
        "Senior technical leader associated with DeepMind's model research and product translation.",
      signals: ["Research", "AI systems", "Model strategy"],
    },
    {
      name: "Oriol Vinyals",
      role: "Research leadership",
      focus: "Large models, multimodal AI, learning systems",
      profileSummary:
        "Research profile tied to large-model systems and multimodal work. Useful for reading Gemini's technical direction.",
      signals: ["Large models", "Multimodal", "Research"],
    },
  ]),
  "meta-ai": peopleFor("meta-ai", "Meta AI", [
    {
      name: "Yann LeCun",
      role: "Chief AI scientist / research leadership",
      focus: "Open research, AI architectures, long-term model direction",
      profileSummary:
        "Public research leader for Meta AI. Useful for understanding Meta's open science posture and architecture-level AI worldview.",
      signals: ["Chief AI scientist", "Open research", "Architecture"],
    },
    {
      name: "Ahmad Al-Dahle",
      role: "Generative AI product leadership",
      focus: "GenAI products, Llama adoption, developer platform translation",
      profileSummary:
        "Product and platform leader associated with Meta's generative AI work. Useful for tracking Llama's product ecosystem.",
      signals: ["GenAI products", "Llama ecosystem", "Platform"],
    },
  ]),
  xai: peopleFor("xai", "xAI", [
    {
      name: "Elon Musk",
      role: "Founder / company leadership",
      focus: "Capital, product direction, ecosystem distribution",
      profileSummary:
        "Founder-level profile tied to xAI's capital strategy, distribution surface, and Grok positioning.",
      signals: ["Founder", "Grok", "Distribution"],
    },
    {
      name: "Igor Babuschkin",
      role: "Co-founder / engineering leadership",
      focus: "Model systems, research engineering, infrastructure execution",
      profileSummary:
        "Technical leadership profile associated with xAI's model engineering and research execution.",
      signals: ["Co-founder", "Research engineering", "Model systems"],
    },
  ]),
  "alibaba-qwen": peopleFor("alibaba-qwen", "Alibaba Qwen", [
    {
      name: "Jingren Zhou",
      role: "Cloud intelligence leadership",
      focus: "Alibaba Cloud AI platform, Qwen ecosystem, enterprise adoption",
      profileSummary:
        "Executive profile connected to Alibaba Cloud's AI platform strategy and Qwen commercialization.",
      signals: ["Alibaba Cloud", "Qwen ecosystem", "Enterprise AI"],
      linkStatus: "needs-verification",
    },
  ]),
  deepseek: peopleFor("deepseek", "DeepSeek", [
    {
      name: "Liang Wenfeng",
      role: "Founder / company leadership",
      focus: "Model strategy, research direction, cost-efficient frontier models",
      profileSummary:
        "Founder profile associated with DeepSeek's model strategy and cost-efficiency narrative.",
      signals: ["Founder", "Open models", "Cost efficiency"],
      linkStatus: "needs-verification",
    },
  ]),
  "mistral-ai": peopleFor("mistral-ai", "Mistral AI", [
    {
      name: "Arthur Mensch",
      role: "CEO / company leadership",
      focus: "European AI platform strategy, model portfolio, enterprise partnerships",
      location: "Paris",
      profileSummary:
        "Co-founder and executive lead for Mistral AI. Useful for tracking European frontier model commercialization.",
      signals: ["CEO", "European AI", "Enterprise"],
    },
    {
      name: "Timothee Lacroix",
      role: "Co-founder / technical leadership",
      focus: "Model research, systems, open model strategy",
      profileSummary:
        "Technical co-founder profile tied to Mistral's model development and open-weight strategy.",
      signals: ["Co-founder", "Model research", "Open weights"],
    },
    {
      name: "Guillaume Lample",
      role: "Co-founder / research leadership",
      focus: "Language models, research execution, model quality",
      profileSummary:
        "Research co-founder profile associated with Mistral's language model quality and research execution.",
      signals: ["Co-founder", "Language models", "Research"],
    },
  ]),
  "moonshot-ai-kimi": peopleFor("moonshot-ai-kimi", "Moonshot AI Kimi", [
    {
      name: "Yang Zhilin",
      role: "Founder / model leadership",
      focus: "Long-context models, consumer AI product, China foundation model market",
      profileSummary:
        "Founder profile associated with Kimi and long-context model positioning in China's foundation model market.",
      signals: ["Founder", "Long context", "Kimi"],
      linkStatus: "needs-verification",
    },
  ]),
  "zhipu-ai-z-ai": peopleFor("zhipu-ai-z-ai", "Zhipu AI Z.AI", [
    {
      name: "Zhang Peng",
      role: "CEO / company leadership",
      focus: "GLM platform strategy, enterprise adoption, developer ecosystem",
      profileSummary:
        "Executive profile associated with Zhipu AI's GLM platform and enterprise adoption strategy.",
      signals: ["CEO", "GLM", "Enterprise AI"],
      linkStatus: "needs-verification",
    },
    {
      name: "Tang Jie",
      role: "Academic and research leadership",
      focus: "Knowledge engineering, GLM research ecosystem, academic collaboration",
      profileSummary:
        "Research leadership profile connected to Zhipu's academic roots and model research ecosystem.",
      signals: ["Research", "Knowledge engineering", "Academic ecosystem"],
      linkStatus: "needs-verification",
    },
  ]),
  "isomorphic-labs": peopleFor("isomorphic-labs", "Isomorphic Labs", [
    {
      name: "Demis Hassabis",
      role: "Founder / scientific leadership",
      focus: "AI for drug discovery, scientific AI strategy",
      profileSummary:
        "Founder-level profile linking DeepMind's scientific AI agenda with Isomorphic Labs' drug discovery platform.",
      signals: ["Founder", "Drug discovery", "Scientific AI"],
    },
    {
      name: "Max Jaderberg",
      role: "AI leadership",
      focus: "Machine learning research, AI platform execution, scientific modeling",
      profileSummary:
        "Technical leadership profile associated with AI systems for scientific discovery.",
      signals: ["AI systems", "Scientific modeling", "Research"],
    },
  ]),
  apple: peopleFor("apple", "Apple machine learning", [
    {
      name: "Craig Federighi",
      role: "Software engineering leadership",
      focus: "Platform software, Apple Intelligence, on-device user experience",
      profileSummary:
        "Executive profile tied to Apple's software platforms and user-facing AI integration.",
      signals: ["Software", "Apple Intelligence", "Platform"],
    },
    {
      name: "John Giannandrea",
      role: "AI and machine learning leadership",
      focus: "Machine learning organization, search, intelligent features",
      profileSummary:
        "AI leadership profile historically associated with Apple's machine learning organization and intelligent product features.",
      signals: ["AI leadership", "Machine learning", "Product intelligence"],
      linkStatus: "needs-verification",
    },
  ]),
  cohere: peopleFor("cohere", "Cohere", [
    {
      name: "Aidan Gomez",
      role: "CEO / research leadership",
      focus: "Enterprise LLM strategy, Command models, retrieval and language AI",
      profileSummary:
        "Co-founder and executive lead for Cohere. Useful for reading enterprise-first foundation model positioning.",
      signals: ["CEO", "Enterprise LLM", "Command"],
    },
    {
      name: "Ivan Zhang",
      role: "Co-founder / product leadership",
      focus: "Enterprise product, platform packaging, customer adoption",
      profileSummary:
        "Co-founder profile associated with Cohere's productization and enterprise market execution.",
      signals: ["Co-founder", "Enterprise product", "GTM"],
    },
    {
      name: "Nick Frosst",
      role: "Co-founder / technical leadership",
      focus: "Model research, product translation, developer communication",
      profileSummary:
        "Technical co-founder profile tied to Cohere's model research and developer-facing communication.",
      signals: ["Co-founder", "Model research", "Developer ecosystem"],
    },
  ]),
  siemens: peopleFor("siemens", "Siemens AI", [
    {
      name: "Roland Busch",
      role: "CEO / company leadership",
      focus: "Industrial AI, automation strategy, global enterprise execution",
      profileSummary:
        "Executive profile tied to Siemens' industrial technology strategy and AI-enabled automation agenda.",
      signals: ["CEO", "Industrial AI", "Automation"],
    },
    {
      name: "Peter Koerte",
      role: "Technology and strategy leadership",
      focus: "Digital industries, industrial software, AI-enabled operations",
      profileSummary:
        "Leadership profile associated with Siemens' technology strategy and industrial software direction.",
      signals: ["Technology strategy", "Industrial software", "AI operations"],
    },
  ]),
  recursion: peopleFor("recursion", "Recursion", [
    {
      name: "Chris Gibson",
      role: "CEO / scientific platform leadership",
      focus: "AI drug discovery platform, data flywheel, biotech partnerships",
      profileSummary:
        "Executive profile tied to Recursion's AI-native drug discovery platform and commercial partnerships.",
      signals: ["CEO", "AI drug discovery", "Data platform"],
    },
    {
      name: "Ben Mabey",
      role: "Technology leadership",
      focus: "Machine learning platform, data infrastructure, scientific workflows",
      profileSummary:
        "Technical leadership profile associated with Recursion's data and machine learning platform.",
      signals: ["ML platform", "Data infrastructure", "Scientific workflows"],
      linkStatus: "needs-verification",
    },
  ]),
  nvidia: peopleFor("nvidia", "NVIDIA AI", [
    {
      name: "Jensen Huang",
      role: "CEO / company leadership",
      focus: "Accelerated computing strategy, AI platform ecosystem, partner network",
      profileSummary:
        "Executive lead for NVIDIA. Useful for understanding accelerated computing strategy and AI infrastructure ecosystem power.",
      signals: ["CEO", "AI infrastructure", "Accelerated computing"],
    },
    {
      name: "Ian Buck",
      role: "Accelerated computing leadership",
      focus: "GPU computing, CUDA ecosystem, AI infrastructure software",
      profileSummary:
        "Technical leadership profile associated with CUDA and NVIDIA's accelerated computing software ecosystem.",
      signals: ["CUDA", "GPU computing", "Developer ecosystem"],
    },
    {
      name: "Bryan Catanzaro",
      role: "Applied deep learning leadership",
      focus: "Deep learning research, model systems, applied AI",
      profileSummary:
        "Research leadership profile tied to applied deep learning and AI model systems at NVIDIA.",
      signals: ["Deep learning", "Research", "Model systems"],
    },
  ]),
  ptc: peopleFor("ptc", "PTC", [
    {
      name: "Neil Barua",
      role: "CEO / company leadership",
      focus: "Industrial software, lifecycle management, enterprise AI adoption",
      profileSummary:
        "Executive profile tied to PTC's industrial software strategy and enterprise transformation roadmap.",
      signals: ["CEO", "Industrial software", "Enterprise"],
    },
  ]),
  qualcomm: peopleFor("qualcomm", "Qualcomm AI", [
    {
      name: "Cristiano Amon",
      role: "CEO / company leadership",
      focus: "Edge AI, mobile AI chips, automotive and device ecosystem",
      profileSummary:
        "Executive profile tied to Qualcomm's edge AI and device ecosystem strategy.",
      signals: ["CEO", "Edge AI", "Mobile AI"],
    },
    {
      name: "Durga Malladi",
      role: "Technology leadership",
      focus: "5G, AI platforms, silicon roadmap",
      profileSummary:
        "Technology leadership profile associated with Qualcomm's platform roadmap across connectivity and AI.",
      signals: ["Technology", "5G", "AI platforms"],
      linkStatus: "needs-verification",
    },
  ]),
  "voyage-ai": peopleFor("voyage-ai", "Voyage AI", [
    {
      name: "Tengyu Ma",
      role: "Founder / research leadership",
      focus: "Embedding models, retrieval systems, enterprise search",
      profileSummary:
        "Founder and research profile tied to Voyage AI's embedding and retrieval model strategy.",
      signals: ["Founder", "Embeddings", "Retrieval"],
    },
  ]),
};

export const peopleForEntity = (entityId: string): CompanyPersonProfile[] =>
  companyPeopleByEntityId[entityId] ?? [];

