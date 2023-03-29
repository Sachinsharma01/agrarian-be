export interface IUserCrops {
  _id: string;
  userId: any;
  crops: Array<ICrop>;
}

interface ICrop {
  _id: any;
  name: string;
  image: string;
  key: string;
  pdf: string;
  area?: number;
  sowingDate: string;
  currentWeek: number;
  progress: number;
}

export interface IAddCropDTO {
  userId: string;
  crop: {
    name: string;
    image: string;
    _id: string;
    totalWeeks: number;
  };
  sowingDate: string;
  area?: number;
}
