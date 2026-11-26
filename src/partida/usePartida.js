import { useContext } from 'react';
import { PartidaContext } from './PartidaContext';

/** La partida (héroe y mochila). Ya hecho. Solo funciona dentro de <PartidaProvider>. */
export function usePartida() {
  const partida = useContext(PartidaContext);
  if (!partida) throw new Error('usePartida tiene que usarse dentro de <PartidaProvider>');
  return partida;
}
