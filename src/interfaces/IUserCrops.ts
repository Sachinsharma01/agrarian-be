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
}

export interface IAddCropDTO {
  userId: string;
  crop: {
    name: string;
    image: string;
  };
}
