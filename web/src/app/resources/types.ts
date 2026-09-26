export type ResourceLink = {
  name: string;
  href: string;
};

export type ResourceCard = {
  title: string;
  desc: string;
  links: ResourceLink[];
};

export type ResourceCategory = {
  icon: string;
  title: string;
  cards: ResourceCard[];
};
