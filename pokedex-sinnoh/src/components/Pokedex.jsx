import { useState, useEffect } from "react"


export default function Pokedex() {
    const [id, setId] = useState(1)
    const [pokemon, setPokemon] = useState(null)

    const fetchData = async () => { //sincroniza para achar dados da API
        try{
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            //crase = template string
            const data = await response.json();
            setPokemon(data);
        }catch(error){
            console.log("Error", error);
        }
    }

    useEffect(() => {
        fetchData()
    }, [id])
    //useeffect acontece quando é feita a conecxão com a API retornando dados

    const nextPokemon = () =>{
        setId(id + 1)
    }

    const previewPokemon = () =>{
        setId(id - 1)
    }
    return(
        <div>
            { pokemon && (
                <div className="pokemon">
                    <h1>Pokémon</h1>
                    <p>{pokemon.name}</p>
                    <p>Peso: {pokemon.weight}g</p>
                    <img src={pokemon.sprites.front_default} alt="Pokemon" />
                    <button onClick={previewPokemon}>Anterior</button>
                    <button onClick={nextPokemon}>Próximo</button>
                    

                </div>
            )}
        </div>
    )
}