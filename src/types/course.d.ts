import { Types } from 'mongoose';

export interface ICourse {
  _id: string;
  name: string;
  url: string;
  domain: string;
  image: string;
  score: number;
  banner: {
    title: string;
    description: string;
    badge?: string; // Optional
  };
  trustReviews: {
    googleReview: number;
    yelp: number;
    trustPilot: number;
  };
  overview: {
    programSummary: {
      p1: string;
      p2: string;
    };
    programSpecifics: {
      requirements: string;
      period: string;
      dedicationTime: string;
      careerResult: string;
      competencies: string[];
    };
  };
  courseCurriculum: {
    expertiseFeatured: string[];
    toolsTaught: string;
  };
  programAdvisor: {
    advisor: {
      name: string;
      title: string;
      departement: string;
      description: string;
      image: string;
      signatures: string;
    };
    educationalPath: {
      programSyllabusUrl: string;
      previews: [
        {
          title: string;
          description: string;
        }
      ];
    };
  };
  fees: {
    total: number;
    installment1: number;
    installment2: number;
  };
  importantDates: {
    deadlines: [
      {
        date: string;
        description: string;
      }
    ];
  };
  faqs: {
    faqs: [
      {
        question: string;
        answer: string;
      }
    ];
  };
}

export interface ICourseDocument extends Document {
  _id: string;
  name: string;
  domain: Types.ObjectId;
  image: string;
  score: number;
  url: string;
  banner: {
    title: string;
    description: string;
    badge?: string; // Optional
  };
  trustReviews: {
    googleReview: number;
    yelp: number;
    trustPilot: number;
  };
  overview: {
    programSummary: {
      p1: string;
      p2: string;
    };
    programSpecifics: {
      requirements: string;
      period: string;
      dedicationTime: string;
      careerResult: string;
      competencies: string[];
    };
  };
  courseCurriculum: {
    expertiseFeatured: string[];
    toolsTaught: string;
  };
  programAdvisor: {
    advisor: {
      name: string;
      title: string;
      departement: string;
      description: string;
      image: string;
      signatures: string;
    };
    educationalPath: {
      programSyllabusUrl: string;
      previews: [
        {
          title: string;
          description: string;
        }
      ];
    };
  };
  fees: {
    total: number;
    installment1: number;
    installment2: number;
  };
  importantDates: {
    deadlines: [
      {
        date: string;
        description: string;
      }
    ];
  };
  faqs: {
    faqs: [
      {
        question: string;
        answer: string;
      }
    ];
  };
}

export type TCourseModel = Model<ICourseDocument>;

export interface ICourseDataSource {
  create(course: Omit<ICourse, '_id'>): Promise<ICourse | null>;
  getAll(): Promise<ICourse[]>;
  getByNameAndDomain(name: string, domain: string): Promise<ICourse | null>;
  getById(id: string): Promise<ICourse | null>;
  getByUrl(url: string): Promise<ICourse | null>;
  updateByUrl(url: string, course: Partial<ICourse>): Promise<ICourse | null>;
  deleteCourse(id: string): Promise<{} | null>;
}
