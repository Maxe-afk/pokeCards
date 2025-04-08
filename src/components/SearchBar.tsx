type Props = {
  onSearch: (query: string) => void;
};

export const Searchbar = ({ onSearch }: Props) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearch(event.target.value);
  };

  return (
    <form>
      <input
        type="text"
        onChange={handleChange}
        placeholder="Rechercher un Pokémon"
      />
    </form>
  );
};
