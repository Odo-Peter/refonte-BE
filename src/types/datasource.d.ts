import { IAdminDataSource } from './admin';
import { IUserDataSource } from './user';
import { IUserEnrollmentDataSource } from './user-enrollment';
import { IDomainDataSource } from './domain';
import { ICourseDataSource } from './course';
import { IUserCourseDataSource } from './user-course';
import { IPaypalAccessTokenDataSource } from './paypal-access-token';
import { IDepositDataSource } from './deposit';
import { IUserApplicationDataSource } from './user-application';
import { IUserBootcampDataSource } from './user-bootcamp';

export interface IDataSources {
  admin: IAdminDataSource;
  user: IUserDataSource;
  userEnrollment: IUserEnrollmentDataSource;
  domain: IDomainDataSource;
  course: ICourseDataSource;
  userCourse: IUserCourseDataSource;
  paypalAccessToken: IPaypalAccessTokenDataSource;
  deposit: IDepositDataSource;
  userApplication: IUserApplicationDataSource;
  userBootcamp: IUserBootcampDataSource;
}
