export type UserDetails = {
  _id: string;
  name: string;
  email: string;
  username: string;
  userProfileImage: string;
  publicKeys: [
    {
      evm: string;
    }
  ];
  ens: string;
  bio: string;
  website: Website;
  instagram: Instagram;
  twitter: Twitter;
  discord: Discord;
  youtube: Youtube;
  linkedin: Linkedin;
  userLevel: string;
  publicNFTProfile: boolean;
  analytics: boolean;
  currency: string;
};

type Website = {
  title: string;
  value: string;
}

type Instagram = {
  title: string ;
  value: string;
}

type Twitter = {
  title: string;
  value: string;
}

type Discord = {
  title: string;
  value: string;
}

type Youtube = {
  title: string;
  value: string;
}

type Linkedin = {
  title: string;
  value: string;
}


