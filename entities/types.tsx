export type E164Number = string & { __tag: "E164Number" };

export type ErrorAxiosType = {
  response: {
    data: {
      state: boolean;
      message: string;
    };
    status: number;
    statusText: string;
  };
};

export type UserAdmin = {
  id: string;
  fullname: string;
  email: string;
  password?: string;
  createdAt?: Date;
  phone?: string | E164Number | null;
  image?: string | null;
  role: "ADMIN" | "CANDIDATE" | "COMPANY";
  subscription?: UserSubcriptionType;
};

type UserSubcriptionType = {
  id: string;
  tierId: string;
  tier: PlanSubscriptionType;

  status: "ACTIVE" | "DESACTIVE";

  startDate: Date;
  endDate: Date;
};

export type CandidateType = UserAdmin & {
  id: string;
  university: string;
  level: string;
  sectors: SectorType[];
  skills: string[];
  cvUrl: string | null;
  about: string | null;
  commune: string | null;
};

export type SectorType = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  totalOpportunities: number;
  totalCandidates: number;
};

export type CompanyType = UserAdmin & {
  id: string;
  companyName: string;
  logo: string;
  website: string | null;
  description: string | null;
  location: string | null;
  industry: string | null;
};

export type JobType = {
  INTERNSHIP: "INTERNSHIP";
  FULL_TIME: "FULL_TIME";
  PART_TIME: "PART_TIME";
  EVENT: "EVENT";
  CONFERENCE: "CONFERENCE";
  TRAINING: "TRAINING";
};

export type JobOfferType = {
  id: string;
  title: string;
  slug: string;
  description: string;
  detail: string | null;
  coverImage: string | null;
  type: keyof JobType;
  location: string;
  requirements: string;
  viewCount: number;
  deadline: Date | null;
  active: boolean;
  visibility: boolean;
  companyId: string;
  createdAt: Date;
  sectors: SectorType[];
  totalApplications: number;
  companyName: string;
  company: {
    companyName: string;
    logo: string;
    location: string;
  };
};

export type AdminStats = {
  totalUsers: number;
  totalStudents: number;
  totalCompanies: number;
  totalOpportunities: number;
  activeListings: number;
  totalApplications: number;
  placementRateExample: string | number;
};

export type RecentActivity = {
  id: string;
  type: "application" | "posting";
  date: Date;
  message: string;
  relatedEntity: string; // Nom de l'entreprise/candidat/offre
};

export type CandidateUserType = {
  id: string;
  user: string;
  email: string;
  joinDate: Date;
  type: "STUDENT" | "GRADUATE" | "PROFESSIONAL";
  status: string;
  applicationsCount: number;
  score: number;
};

export type SubscribersType = {
  id: string;
  user: UserAdmin;
  plan: "FREE" | "STANDARD" | "PREMIUM"; // FREE, STANDARD, PREMIUM
  status: "ACTIVE" | "EXPIRED"; // ACTIVE, EXPIRED, etc.
  startDate: Date;
  renewalDate: Date; // C'est la date de fin qui sert de date de renouvellement
  totalSpent: number; // Le montant total dépensé par cet utilisateur à vie
  currency: "USD";
};

export type PlanSubscriptionType = {
  id: string;
  name: "FREE" | "STANDARD" | "PREMIUM";
  priceUSD: number;
  benefits: string[];
  applicationLimit: number;
  notifiedLimit: number;
  createdAt: Date;
  updatedAt: Date;
};

export type MyProfilType = {
  id: string;
  fullname: string;
  email: string;
  phone: string;
  image: string | undefined;
  emailVerified: boolean;
  candidateProfile: {
    level: "STUDENT" | "GRADUATE" | "PROFESSIONAL";
    sectors: {
      id: string;
      name: string;
      slug: string;
    }[];
    university?: string | undefined;
    skills: string[];
    cvUrl?: string | undefined;
    about?: string | undefined;
    city?: string | undefined;
    commune?: string | undefined;
    address?: string | undefined;
    birthday?: Date | undefined;
  };
};

export type TestimonyType = {
  id: string;
  fullname: string;
  photo?: string;
  post?: string;
  email: string;
  stars: number; // 1 à 5
  comment?: string;
  createdAt: Date;
};

export type ContactType = {
  id: string;
  fullname: string;
  email: string;
  phone?: string;
  message: string;
  createdAt: Date;
};

export type NewsletterType = {
  id: string;
  email: string;
  createdAt: Date;
};

export type OpportunityRecruiter = {
  id: string;
  description: string;
  detail: string | null;
  slug: string;
  title: string;
  type:
    | "INTERNSHIP"
    | "FULL_TIME"
    | "PART_TIME"
    | "CONFERENCE"
    | "EVENT"
    | "TRAINING";
  location: string;
  visibility: boolean;
  requirements: string;
  coverImage: string;
  sectors: SectorType[];
  active: boolean;
  deadline: Date;
  createdAt: Date;
  viewCount: number;
  _count: {
    applications: number;
  };
};
