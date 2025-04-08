import { useEffect, useState } from "react";
import { Searchbar } from "../components/SearchBar";
import { PokemonCard } from "../model/PokemonCard";

const pokemonCards: PokemonCard[] = [
  new PokemonCard("Salamèche", "Salamèche.png", 150, ["fire"], "1"),
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
          "https://api.pokemontcg.io/v2/cards?q=set.id:base2&pageSize=250"
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
    <>
      <Searchbar onSearch={setSearchQuery} />
      <div>
        <h1>Données récupérées :</h1>
        {filteredCards.length > 0 &&
          filteredCards.map((card) => (
            <div key={card.id} onClick={() => toggleFavorite(card)}>
              <h2>{card.name}</h2>
              <img src={card.picture} alt={card.name} />
              <p>{card.price}€</p>
            </div>
          ))}

        <h2>Favoris :</h2>
        {favorites.length > 0 ? (
          favorites.map((fav) => (
            <div key={fav.id}>
              <h2>{fav.name}</h2>
              <img src={fav.picture} alt={fav.name} />
              <p>{fav.price}€</p>
            </div>
          ))
        ) : (
          <p>Aucun favori pour le moment.</p>
        )}
      </div>
    </>
  );
};
