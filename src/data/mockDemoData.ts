export type Influencer = {
  id: string;
  rank: number;
  name: string;
  role: string;
  organization: string;
  score: number;
  change: number;
  areas: string[];
  avatar: string;
  citation: string;
  bio: string;
};

export const mockInfluencers: Influencer[] = [
  { id: 'p1', rank: 1, name: 'Sam Altman', role: 'CEO', organization: 'OpenAI', score: 99.5, change: 0, areas: ['AGI', 'Leadership', 'Policy'], avatar: 'SA', citation: '15K+', bio: 'Leading OpenAI mission to ensure that artificial general intelligence benefits all of humanity.' },
  { id: 'p2', rank: 2, name: 'Demis Hassabis', role: 'CEO', organization: 'Google DeepMind', score: 98.2, change: 1, areas: ['RL', 'Science', 'AlphaFold'], avatar: 'DH', citation: '82K+', bio: 'Pioneer in artificial intelligence and neuroscience. Led the development of AlphaGo and AlphaFold.' },
  { id: 'p3', rank: 3, name: 'Ilya Sutskever', role: 'Co-founder', organization: 'SSI', score: 97.8, change: -1, areas: ['Alignment', 'LLMs', 'Safety'], avatar: 'IS', citation: '420K+', bio: 'Renowned researcher in deep learning, co-inventor of AlexNet, focusing on safe superintelligence.' },
  { id: 'p4', rank: 4, name: 'Jensen Huang', role: 'CEO', organization: 'NVIDIA', score: 96.5, change: 2, areas: ['Hardware', 'Compute', 'Vision'], avatar: 'JH', citation: '5K+', bio: 'Founder and CEO of NVIDIA, driving the hardware revolution that powers modern AI.' },
  { id: 'p5', rank: 5, name: 'Fei-Fei Li', role: 'Co-Director', organization: 'Stanford HAI', score: 95.0, change: 0, areas: ['Computer Vision', 'Human-Centered AI'], avatar: 'FL', citation: '210K+', bio: 'Creator of ImageNet and a leading voice in human-centered artificial intelligence.' },
];
