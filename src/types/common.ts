type OpenClose = {
  open: string;
  close: string;
};

export interface HoursOfOperation {
  sunday?: OpenClose;
  monday?: OpenClose;
  tuesday?: OpenClose;
  wednesday?: OpenClose;
  thursday?: OpenClose;
  friday?: OpenClose;
  saturday?: OpenClose;
}

export interface SocialMediaLinks {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  snapchat?: string;
}
