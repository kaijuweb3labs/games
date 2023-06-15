export type UserDetails = {
  name: string;
  userProfileImage: string;
  publicKeys: [
    {
      evm: string;
    }
  ];
  ens: string;
  bio: string;
  website: string;
  instagram: string;
  twitter: string;
  discord: string;
  youtube: string;
  UserLevel: string;
  email: string;
  authProvider: string;
  username: string;
  _id: string;
  followedList: [];
};
