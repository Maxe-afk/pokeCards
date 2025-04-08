import { useEffect, useState } from "react";
import { PokemonCard } from "../model/PokemonCard";
import Styles from "../data/FetchApi.module.css";

const pokemonCards: PokemonCard[] = [
  new PokemonCard("Salamèche", "Salamèche.png", 150),
];





export const FetchApi = () => {
  const [cards, setCards] = useState(pokemonCards);
  const [favorites, setFavorites] = useState<PokemonCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
              newEntry.name,
              newEntry.images.large,
              newEntry.cardmarket.prices.averageSellPrice
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

  function handleMouseEnter(cardName: string) {
    setHoveredCard(cardName);
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

  return (
    <div className={Styles.all}>
      <div className={Styles.box1}>
      <h2 className={Styles.cardName}>Données récupérées :</h2>
      <div className={Styles.cardsContainer}>
        
      {cards.length > 0 &&
  cards.map((card) => (
    <div
      key={card.name}
      onClick={() => toggleFavorite(card)} className={Styles.card}>
    
      
      <img
        onMouseEnter={() => handleMouseEnter(card.name)}
        onMouseLeave={handleMouseLeave}
        className={`${Styles.img} ${Styles.imgCursor} ${
          favorites.some((fav) => fav.name === card.name) ? Styles.inFavorites : ''
        }`}
        src={card.picture}
        alt={card.name}
      />
      <div className={`${Styles['description']} ${
          hoveredCard === card.name ? Styles['visible'] : ''
        }`}>

      <h2>{card.name}</h2>
      <p>{card.price}€</p>

      </div>
      
    </div>
  ))}
      </div>
      </div>
      <div className={Styles.box2}>
<h2>Favoris :</h2>
      <div className={Styles.favoriteContainer}>
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <div
              key={fav.name}
              className={Styles.card}
              onMouseEnter={() => handleFavoriteMouseEnter(fav.name)}
              onMouseLeave={handleFavoriteMouseLeave}
            >
              <img
                className={Styles.img}
                src={fav.picture}
                alt={fav.name}
              />
              <div className={`${Styles['description']} ${
                hoveredFavorite === fav.name ? Styles['visible'] : ''
              }`}>
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