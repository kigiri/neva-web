const skills = {
  129: "First Aid",
  165: "Leatherworking",
  171: "Alchemy",
  182: "Herbalism",
  185: "Cooking",
  186: "Mining",
  197: "Tailoring",
  202: "Engineering",
  333: "Enchanting",
  356: "Fishing",
  393: "Skinning",
  633: "Lockpicking",
  755: "Jewelcrafting",
  762: "Riding",
  773: "Inscription",
};

const ranks = [
  { min: 0,   max: 75,  name: "Apprentice" },
  { min: 50,  max: 150, name: "Journeyman" },
  { min: 125, max: 225, name: "Expert" },
  { min: 200, max: 300, name: "Artisan" },
  { min: 275, max: 375, name: "Master" },
  { min: 350, max: 450, name: "Grand Master" },
];

export default { skills, ranks };
