import { createContext } from 'react';

/** Lo que comparte la partida con toda la aplicación. */

// Ya hecho. Fuera de un <PartidaProvider> vale null.
export const PartidaContext = createContext(null);
