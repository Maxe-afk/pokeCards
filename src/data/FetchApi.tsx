import { useEffect, useState } from "react";
import { Searchbar } from "../components/SearchBar";
import { PokemonCard } from "../model/PokemonCard";
import Styles from "../data/FetchApi.module.css";

const pokemonCards: PokemonCard[] = [
  new PokemonCard("1", "Salamèche", "Salamèche.png", 150, ["fire"]),
];

export const FetchApi = () => {
  const [cards, setCards] = useState(pokemonCards);
  const [favorites, setFavorites] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://api.pokemontcg.io/v2/cards?q=set.id:base1&pageSize=250"
        );

        if (!response.ok) {
          throw new Error("Error");
        }
        const result = await response.json();
        console.log(result);
        const newPokemons: PokemonCard[] = [];
        result.data.map((newEntry) => {
          newPokemons.push(
            new PokemonCard(
              newEntry.id,
              newEntry.name,
              newEntry.images.large,
              newEntry.cardmarket?.prices?.averageSellPrice ?? 0,
              newEntry.types
            )
          );
        });
        setCards(newPokemons);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [hoveredFavorite, setHoveredFavorite] = useState<string | null>(null);

  function handleMouseEnter(cardId: string) {
    setHoveredCard(cardId);
  }

  function handleMouseLeave() {
    setHoveredCard(null);
  }

  function handleFavoriteMouseEnter(cardName: string) {
    setHoveredFavorite(cardName);
  }

  function handleFavoriteMouseLeave() {
    setHoveredFavorite(null);
  }

  const toggleFavorite = (card: PokemonCard) => {
    setFavorites((prevFavorites) => {
      if (prevFavorites.some((fav) => fav.name === card.name)) {
        // Remove from favorites
        return prevFavorites.filter((fav) => fav.name !== card.name);
      } else {
        // Add to favorites
        return [...prevFavorites, card];
      }
    });
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur : {error}</p>;

  const filteredCards = cards.filter((card) =>
    card.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={Styles.all}>
      
      <div className={Styles.box1}>
      
        <h2>First Edition</h2>
        <Searchbar onSearch={setSearchQuery} />
        <div className={Styles.cardsContainer}>
          {filteredCards.length > 0 ? (
            filteredCards.map((card) => (
              <div className={Styles.card} key={card.id} onClick={() => toggleFavorite(card)}>
                <img
                  onMouseEnter={() => handleMouseEnter(card.id)}
                  onMouseLeave={handleMouseLeave}
                  className={`${Styles.img} ${Styles.imgCursor} ${
                    favorites.some((fav) => fav.name === card.name)
                      ? Styles.inFavorites
                      : ""
                  }`}
                  src={card.picture}
                  alt={card.name}
                />
                <div
                  className={`${Styles["description"]} ${
                    hoveredCard === card.id ? Styles["visible"] : ""
                  }`}
                >
                  <h2>{card.name}</h2>
                  <p>{card.price}€</p>
                </div>
              </div>
            ))
          ) : (
            <p>Aucune carte ne correspond à votre recherche</p>
          )}
        </div>
      </div>
      <div className={Styles.box2}>
        <h2>Favoris :</h2>
        <h4>
          Valeur de votre collection:{" "}
          {favorites.reduce((total, fav) => total + fav.price, 0).toFixed(2)}€
        </h4>
        <div className={Styles.favoriteContainer}>
          {favorites.length > 0 ? (
            favorites.map((fav) => (
              <div
                key={fav.id}
                className={Styles.card}
              >
                <img className={Styles.img} src={fav.picture} alt={fav.name} onMouseEnter={() => handleFavoriteMouseEnter(fav.name)}
                onMouseLeave={handleFavoriteMouseLeave} />
                <div
                  className={`${Styles["description"]} ${
                    hoveredFavorite === fav.name ? Styles["visible"] : ""
                  }`}
                >
                  <h2>{fav.name}</h2>
                  <p>{fav.price}€</p>
                </div>
              </div>
            ))
          ) : (
            <p>Aucun favori pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  );
};