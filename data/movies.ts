export interface Movie {
  id: string;
  title: string;
  description: string;
  image: any;
  genre: string;
  year: string;
  rating: string;
  duration: string;
}

export const movies: Movie[] = [
  {
    id: "1",
    title: "Spirited Away",
    description:
      "A young girl, Chihiro, becomes trapped in a strange new world of spirits. When her parents undergo a mysterious transformation, she must call upon the courage she never knew she had to free her family.",
    image: require("@/assets/images/spirited away.png"),
    genre: "Animation, Adventure",
    year: "2001",
    rating: "PG",
    duration: "2h 5m",
  },
  {
    id: "2",
    title: "Malificent",
    description:
      "A beautiful, pure-hearted young woman, Maleficent, has an idyllic life growing up in a peaceful forest kingdom until one day when her home is invaded by soldiers in league with a corrupt king.",
    image: require("@/assets/images/malificent.png"),
    genre: "Fantasy, Action",
    year: "2014",
    rating: "PG-13",
    duration: "1h 32m",
  },
  {
    id: "3",
    title: "Under Paris",
    description:
      "A shark more than twice as large as the largest great white is lurking beneath the surface of the Seine River in Paris during the 2024 Summer Olympics. Marine biologist and shark specialist Sophia is recruited.",
    image: require("@/assets/images/under paris.png"),
    genre: "Horror, Thriller",
    year: "2024",
    rating: "R",
    duration: "1h 45m",
  },
  {
    id: "4",
    title: "The Arrival",
    description:
      "A linguist works with the military to communicate with alien lifeforms after twelve mysterious spacecraft appear around the world. When the aliens seem intent on visiting Earth, she races to find a way to communicate with them.",
    image: require("@/assets/images/arrival.png"),
    genre: "Sci-Fi, Drama",
    year: "2016",
    rating: "PG-13",
    duration: "1h 56m",
  },
  {
    id: "5",
    title: "Tron: Legacy",
    description:
      "The son of a virtual world designer goes looking for his father and ends up inside the digital world that his father designed. He meets his father's creation and is tricked into a game of power by the ruler of the digital world.",
    image: require("@/assets/images/tron.png"),
    genre: "Sci-Fi, Action",
    year: "2010",
    rating: "PG",
    duration: "2h 5m",
  },
  {
    id: "6",
    title: "The Boss Baby",
    description:
      "A suit-wearing briefcase-carrying baby pairs up with his seven-year old brother to stop the dastardly plot of the CEO of Puppy Co., a company that makes products for babies.",
    image: require("@/assets/images/boss baby 1.png"),
    genre: "Animation, Comedy",
    year: "2017",
    rating: "PG",
    duration: "1h 37m",
  },
  {
    id: "7",
    title: "Slime Movie",
    description:
      "A young boy discovers a gelatinous alien that grows bigger and bigger the more it eats. Together with his friends, they must protect the slime from scientists who want to study it.",
    image: require("@/assets/images/slime movie.png"),
    genre: "Family, Sci-Fi",
    year: "2024",
    rating: "PG",
    duration: "1h 50m",
  },
];

export const featuredMovie: Movie = {
  id: "0",
  title: "Movie Vault",
  description:
    "Your ultimate destination for streaming the best movies. Discover new favorites, revisit classics, and explore a world of cinema right at your fingertips.",
  image: require("@/assets/images/movie vault.png"),
  genre: "All Genres",
  year: "2024",
  rating: "PG",
  duration: "24/7",
};
