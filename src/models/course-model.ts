import { Schema, model } from "mongoose";
import { ICourseDocument, TCourseModel } from "../types/course";
// Schema<ICourseDocument, TCourseModel>(

const CourseSchema = new Schema<ICourseDocument, TCourseModel>({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  domain: {
    type: Schema.Types.ObjectId,
    ref: "domain",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  url: {
    type: String,
    required: true,
    unique: true,
  },
  banner: {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    badge: String,
  },
  trustReviews: {
    googleReview: Number,
    yelp: Number,
    trustPilot: Number,
  },
  overview: {
    programSummary: {
      p1: String,
      p2: String,
    },
    programSpecifics: {
      requirements: String,
      period: String,
      dedicationTime: String,
      careerResult: String,
      competencies: [String],
    },
  },
  courseCurriculum: {
    expertiseFeatured: [String],
    toolsTaught: String,
  },
  programAdvisor: {
    advisor: {
      name: String,
      title: String,
      departement: String,
      description: String,
      image: String,
      signatures: String,
    },
    educationalPath: {
      programSyllabusUrl: String,
      previews: [
        {
          title: String,
          description: String,
        },
      ],
    },
  },
  fees: {
    total: Number,
    installment1: Number,
    installment2: Number,
  },
  importantDates: {
    deadlines: [
      {
        date: String,
        description: String,
      },
    ],
  },
  faqs: {
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
  },
});

const CourseModel = model<ICourseDocument, TCourseModel>(
  "course",
  CourseSchema
);

export default CourseModel;
